'use client'
import React, { useState, useRef } from 'react';
import { startRecording, stopRecording } from './helper/audioHandler';
import { useWebSocket } from './helper/webSocketHandler';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const audioPlayerRef = useRef(null);
  const wsRef = useRef(null);

  useWebSocket(setMessages, audioPlayerRef, wsRef);

  const handleStartRecording = () => {
    startRecording(setIsRecording, setMessages, wsRef);
  };

  const handleStopRecording = () => {
    stopRecording(setIsRecording);
  };

  return (
    <div className="App">
      <h1>OpenAI Realtime API Demo</h1>
      <button onClick={isRecording ? handleStopRecording : handleStartRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>

      <div id="status">{isRecording ? 'Recording...' : 'Idle'}</div>

      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            {msg.text && <p>{msg.text}</p>}
            {msg.audio && (
              <audio controls src={`data:audio/wav;base64,${msg.audio}`} />
            )}
          </div>
        ))}
      </div>

      <audio ref={audioPlayerRef} style={{ display: 'none' }} />
    </div>
  );
}

export default App;