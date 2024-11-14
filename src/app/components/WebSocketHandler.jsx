import { useEffect, useRef } from 'react';
import { functions } from '../helper/apiReqHandler';
export const useWebSocket = (setMessages, audioPlayerRef, wsRef) => {
  useEffect(() => {
    const backendUrl = 'ws://localhost:9000';
    const ws = new WebSocket(backendUrl);

    ws.onopen = () => {
      console.log('Connected to backend WebSocket');
      setMessages((prev) => [
        ...prev,
        { role: 'system', text: 'Connected to assistant.' },
      ]);
      
    };

    ws.onmessage = (event) => {
      try {
        let dataStr;
        if (event.data instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            dataStr = reader.result;
            processServerMessage(dataStr, setMessages, audioPlayerRef);
          };
          reader.readAsText(event.data);
        } else {
          dataStr = event.data;
          processServerMessage(dataStr, setMessages, audioPlayerRef);
        }
      } catch (error) {
        console.error('Error handling incoming message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'system', text: 'WebSocket error occurred.' },
      ]);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setMessages((prev) => [
        ...prev,
        { role: 'system', text: 'Disconnected from assistant.' },
      ]);
    };

    wsRef.current = ws;



    return () => {
      ws.close();
    };
  }, [setMessages, audioPlayerRef]);

  const processServerMessage = (dataStr, setMessages, audioPlayerRef) => {
    console.log('Processing server message:', dataStr);

    try {
      const data = JSON.parse(dataStr);
      console.log('Parsed data:', data);

      switch (data.type) {
        case 'conversation.item.created':
          handleConversationItemCreated(data.item, setMessages, audioPlayerRef);
          break;
        case 'response.audio.delta':
          handleResponseAudioDelta(data, setMessages, audioPlayerRef);
          break;
        case 'response.audio.done':
          handleResponseAudioDone(setMessages);
          break;
        case 'response.audio_transcript.done':
          handleResponseAudioTranscriptDone(data, setMessages);
          break;
        case 'response.function_call_arguments.done':
          handleResponseFunctionCallArgsDone(data, setMessages);
          break;
        case 'error':
          handleErrorEvent(data.error, setMessages);
          break;
        default:
          console.log('Unhandled event type:', data.type);
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  };

  const handleConversationItemCreated = (item, setMessages, audioPlayerRef) => {
    console.log('Handling conversation item:', item);
    if (item.type === 'message' && item.role === 'assistant') {
      item.content.forEach((contentItem) => {
        console.log('Content item:', contentItem);
        if (contentItem.type === 'text') {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', text: contentItem.text },
          ]);
        } else if (contentItem.type === 'audio') {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', audio: contentItem.audio },
          ]);

          if (audioPlayerRef.current) {
            audioPlayerRef.current.src = `data:audio/wav;base64,${contentItem.audio}`;
            audioPlayerRef.current.play();
          }
        }
      });
    }
  };


  //HANDLE AND FIGURE OUT WHAT HAPPENS HERE EXAMPLE RESPONSE.AUDIO.DELTA:
  //Processing server message: {"type":"response.audio.delta","event_id":"event_AIu0Qc68KtxOeLBm8g42y","response_id":"resp_AIu0Pm662MQ8x9rgeknwz","item_id":"item_AIu0Po4sOqSLFWpGNEsvY","output_index":0,"content_index":0,"delta":"DgAJAAkADwAHAA4ACAAKAA0ADwATAAcACwAFAAsACgANAAYABwAKAAUACQABAAcABAAIAAMAAwACAAQAAgD//wQAAAAAAPv//v/9/wAA/v////z/+f/8//r/+P/1//v/+f/7//n/9v/3//f/+v/0//n/+P/4//T/9v/y//X/7v/0//D/8//z//D/8f/t//X/7//3//D/7//v//H/8f/u//T/8P/y/+7/7v/v/+3/8//t//H/8P/u//H/7P/y/+3/7v/q/+z/8f/t//D/7P/w/+7/9P/0//D/7v/t//D/8P/v/+3/7v/v/+3/8P/x/+//8P/v//H/8f/y//H/8P/x//D/8P/w/+7/8v/y//H/8f/y//D/8f/v//D/8v/w//P/8P/0//T/8//2//T/9//0//f/9f/2//X/+f/5//r/+P/3//j/+f/6//3//P/8//r/+v/6//n/+//8//7/AQD+//z////+/wAAAQD//wQAAQADAAEAAAAAAAEAAwADAAMAAwAHAAcABwAHAAUABAAFAAcACQANAAkACQAFAAoAEAATAAwAEAAKAAwADgASABAAEgARABEAFAARABMAFQAWABYAEAASABgAGAAXABQAEgAQABMAEQAXABYAEgAUABMAFwATABcAEQARABUAEQARABIAGQAUABEAEgATABYAFQAVABUAFAARABEAFQAWABMAEwASABEAEAAQABEAEAARABQADwAQAA0ACgAIAAkACgAHAAMABAADAAUAAwAGAAYAAwADAAYACgAHAAYAAAD+//7/AQADAAIA///9//////8AAAAAAAD///3/AAD8////AQADAAcABQAJAAcACQAHAAgACAAKAAoACQAMAAkADgALAA4AEAAQABcAFQAZABsAGgAYABsAIAAeABkAGQAbACMAKwAqACgAIgAmACEAJAAiACMAJQAhACUAHQAmACUAKQAqACwAKgAmACYAIgAfAB4AJQAiABwAHQAcAB0AGAATABYAEgAWABIAEwAUABQADgAKAA8ADQAHAP7/8f/q/+n/5f/l/+7/8f/1//f/AQD8//b/8//n/+b/1v/Q/8X/v/+7/7P/wv/G/8z/zv/I/87/z//L/8j/xf/K/8j/yP/O/9H/1//H/8v/1f/O/8P/tf+3/8L/x//Q/9r/5v/t/+//9f/1/+3/2P/L/8j/wv+9/7P/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"}
  // Initialize a global buffer to accumulate audio chunks
  let accumulatedPCMData = [];
  let audioQueue = [];
  let isPlaying = false;
  
  const CHUNK_BATCH_SIZE = 5; // Increase the chunk batch size to 5
  
  // Function to convert raw PCM data to a WAV format
  const convertPCMtoWAV = (pcmData, sampleRate = 24000, numChannels = 1) => {
    const header = new ArrayBuffer(44); // WAV header size
    const dataView = new DataView(header);
  
    // Write WAV header
    const writeString = (view, offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
  
    writeString(dataView, 0, 'RIFF'); // ChunkID
    dataView.setUint32(4, 36 + pcmData.length, true); // ChunkSize
    writeString(dataView, 8, 'WAVE'); // Format
    writeString(dataView, 12, 'fmt '); // Subchunk1ID
    dataView.setUint32(16, 16, true); // Subchunk1Size
    dataView.setUint16(20, 1, true); // AudioFormat (1 for PCM)
    dataView.setUint16(22, numChannels, true); // NumChannels
    dataView.setUint32(24, sampleRate, true); // SampleRate
    dataView.setUint32(28, sampleRate * numChannels * 2, true); // ByteRate
    dataView.setUint16(32, numChannels * 2, true); // BlockAlign
    dataView.setUint16(34, 16, true); // BitsPerSample
    writeString(dataView, 36, 'data'); // Subchunk2ID
    dataView.setUint32(40, pcmData.length, true); // Subchunk2Size
  
    const wavBuffer = new Uint8Array(44 + pcmData.length);
    wavBuffer.set(new Uint8Array(header), 0);
    wavBuffer.set(pcmData, 44);
  
    return wavBuffer;
  };
  
  // Play combined audio chunks in sequence
  const playNextInQueue = async (audioPlayerRef) => {
    if (audioQueue.length === 0 || isPlaying) return;
  
    isPlaying = true;
  
    // Combine multiple chunks (up to CHUNK_BATCH_SIZE) from the queue
    let combinedPCMData = [];
    const chunksToProcess = Math.min(CHUNK_BATCH_SIZE, audioQueue.length); // Process up to CHUNK_BATCH_SIZE or the remaining chunks
  
    for (let i = 0; i < chunksToProcess; i++) {
      const audioBase64 = audioQueue.shift();
      const audioBinary = atob(audioBase64);
      const pcmData = new Uint8Array(audioBinary.length);
      for (let j = 0; j < audioBinary.length; j++) {
        pcmData[j] = audioBinary.charCodeAt(j);
      }
      combinedPCMData.push(...pcmData); // Accumulate PCM data
    }
  
    // Combine with previously accumulated data
    accumulatedPCMData.push(...combinedPCMData);
  
    // Convert accumulated PCM data to WAV and clear accumulated data
    const wavData = convertPCMtoWAV(new Uint8Array(accumulatedPCMData));
    accumulatedPCMData = []; // Clear after converting to WAV
  
    const audioBlob = new Blob([wavData], { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);
  
    if (audioPlayerRef.current) {
      audioPlayerRef.current.src = audioUrl;
  
      audioPlayerRef.current.onloadeddata = () => {
        console.log('Audio data loaded, ready to play');
        audioPlayerRef.current.play().catch(error => console.error('Error playing audio:', error));
      };
  
      audioPlayerRef.current.onerror = () => {
        console.error('Error loading audio data');
      };
  
      audioPlayerRef.current.onplay = () => {
        console.log('Audio is playing');
      };
  
      // When audio finishes, play the next batch in the queue
      audioPlayerRef.current.onended = () => {
        console.log('Audio finished, playing next batch');
        isPlaying = false;
        playNextInQueue(audioPlayerRef);
      };
    }
  };
  
  const handleResponseAudioDelta = (data, setMessages, audioPlayerRef) => {

    const { delta } = data;
  
    if (delta) {
      audioQueue.push(delta); // Add each delta to the queue
  
      // Append the audioBase64 to the message data (for UI purposes)
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant' && lastMessage.audio) {
          lastMessage.audio += delta; // Append base64 audio chunks
        } else {
          newMessages.push({ role: 'assistant', audio: delta });
        }
        return newMessages;
      });
  
      // Play the next audio batch in the queue if not already playing
      playNextInQueue(audioPlayerRef);
    }
  };
  

  

  

  
  


  const handleResponseAudioDone = (setMessages) => {
    console.log('Audio response completed.');
    setMessages((prev) => [
      ...prev,
      { role: 'system', text: 'Audio response completed.' },
    ]);
  };

  const handleResponseAudioTranscriptDone = (data, setMessages) => {
    console.log('Transcript done:', data);
    const { transcript } = data;
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', text: transcript },
    ]);
  };

  const handleResponseFunctionCallArgsDone = (data, setMessages) => {
    const functionName = data.name;

    let functionArguments;
    try {
        functionArguments = JSON.parse(data.arguments);
    } catch (e) {
        console.error("Error parsing function arguments:", e);
        return; // Exit if parsing fails
    }

    if (typeof functions[functionName] !== "function") {
        console.error(`Function ${functionName} is not defined.`);
        return;
    }

    functions[functionName](functionArguments)
        .then((result) => {
            const functionOutputEvent = {
                type: "conversation.item.create",
                item: {
                    type: "function_call_output",
                    role: "system",
                    output: JSON.stringify(result, null, 2)
                }
            };

            // Send the function output event
            try {
                wsRef.current.send(JSON.stringify(functionOutputEvent));
                console.log("Function output event sent successfully.");
            } catch (error) {
                console.error("Error sending function output event:", error);
            }

            // Request another response from the LLM after sending result
            try {
                wsRef.current.send(JSON.stringify({ type: "response.create" }));
                console.log("Response.create event sent successfully.");
            } catch (error) {
                console.error("Error sending response.create event:", error);
            }
        })
        .catch((error) => {
            console.error("Error executing function:", error);
        });
};


  const handleErrorEvent = (error, setMessages) => {
    console.error('Error from server:', error);
    setMessages((prev) => [
      ...prev,
      { role: 'system', text: `Error: ${error.message}` },
    ]);
  };
};