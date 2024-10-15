import { useEffect, useRef } from 'react';

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
      console.log('Message from server:', event.data);
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

  const handleResponseAudioDelta = (data, setMessages, audioPlayerRef) => {
    console.log('Handling audio delta:', data);
    const { audio_delta } = data;
    if (audio_delta) {
      const audioBuffer = audio_delta;
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant' && lastMessage.audio) {
          lastMessage.audio += audioBuffer;
        } else {
          newMessages.push({ role: 'assistant', audio: audioBuffer });
        }
        return newMessages;
      });

      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = `data:audio/wav;base64,${audioBuffer}`;
        audioPlayerRef.current.play();
      }
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

  const handleErrorEvent = (error, setMessages) => {
    console.error('Error from server:', error);
    setMessages((prev) => [
      ...prev,
      { role: 'system', text: `Error: ${error.message}` },
    ]);
  };
};