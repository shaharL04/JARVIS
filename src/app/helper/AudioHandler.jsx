const mediaRecorderRef = { current: null };
const audioChunksRef = { current: [] };

export const startRecording = async (setIsRecording, setMessages, wsRef) => {
  setIsRecording(true);
  audioChunksRef.current = [];

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.start();

    mediaRecorder.onstart = () => {
      console.log('Recording started');
      setMessages((prev) => [...prev, { role: 'system', text: 'Recording started...' }]);
    };

    mediaRecorder.ondataavailable = (event) => {
      console.log('Data available:', event.data);
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      console.log('Recording stopped');
      setMessages((prev) => [...prev, { role: 'system', text: 'Processing audio...' }]);
      processAudio(setMessages, wsRef);
    };
  } catch (error) {
    console.error('Error accessing microphone:', error);
    setIsRecording(false);
    setMessages((prev) => [
      ...prev,
      { role: 'system', text: 'Microphone access denied or unavailable.' },
    ]);
  }
};

export const stopRecording = (setIsRecording) => {
  setIsRecording(false);
  if (mediaRecorderRef.current) {
    mediaRecorderRef.current.stop();
  }
};

const processAudio = async (setMessages, wsRef) => {
  const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });

  // Process the audio to PCM16 mono 24kHz using AudioContext
  const processedBase64Audio = await convertBlobToPCM16Mono24kHz(blob);

  if (!processedBase64Audio) {
    console.error('Audio processing failed.');
    setMessages((prev) => [
      ...prev,
      { role: 'system', text: 'Failed to process audio.' },
    ]);
    return;
  }

  // Send the audio event to the backend via WebSocket
  if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
    const conversationCreateEvent = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_audio',
            audio: processedBase64Audio,
          },
        ],
      },
    };
    wsRef.current.send(JSON.stringify(conversationCreateEvent));

    // Optionally, add the user's audio message to the UI
    setMessages((prev) => [
      ...prev,
      { role: 'user', audio: processedBase64Audio },
    ]);

    // Trigger a response.create event to prompt assistant's response
    const responseCreateEvent = {
      type: 'response.create',
      response: {
        modalities: ['text', 'audio'],
      },
    };
    wsRef.current.send(JSON.stringify(responseCreateEvent));

    setMessages((prev) => [
      ...prev,
      { role: 'system', text: 'Audio sent to assistant for processing.' },
    ]);
  } else {
    console.error('WebSocket is not open.');
    setMessages((prev) => [
      ...prev,
      { role: 'system', text: 'Unable to send audio. Connection is closed.' },
    ]);
  }
};

const convertBlobToPCM16Mono24kHz = async (blob) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)({
      sampleRate: 24000,
    });

    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    console.log('Audio buffer decoded:', audioBuffer);

    let channelData =
      audioBuffer.numberOfChannels > 1
        ? averageChannels(
            audioBuffer.getChannelData(0),
            audioBuffer.getChannelData(1)
          )
        : audioBuffer.getChannelData(0);

    const pcm16Buffer = float32ToPCM16(channelData);
    const base64Audio = arrayBufferToBase64(pcm16Buffer);

    audioCtx.close();

    console.log('Converted audio to base64:', base64Audio.slice(0, 50) + '...');
    return base64Audio;
  } catch (error) {
    console.error('Error processing audio:', error);
    return null;
  }
};

const averageChannels = (channel1, channel2) => {
  const length = Math.min(channel1.length, channel2.length);
  const result = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    result[i] = (channel1[i] + channel2[i]) / 2;
  }
  return result;
};

const float32ToPCM16 = (float32Array) => {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < float32Array.length; i++) {
    let s = Math.max(-1, Math.min(1, float32Array[i]));
    s = s < 0 ? s * 0x8000 : s * 0x7fff;
    view.setInt16(i * 2, s, true);
  }
  return buffer;
};

const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};