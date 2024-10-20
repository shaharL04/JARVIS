'use client'
import React, { useState, useRef } from 'react';
import { startRecording, stopRecording } from './components/AudioHandler';
import { useWebSocket } from './components/WebSocketHandler';
import { MsalProvider, useMsal, useIsAuthenticated } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';

const scopes = [
  'Mail.Read',
  'Mail.Send',
  'Calendars.Read',
  'Calendars.ReadWrite',
  'User.Read'
];


function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const audioPlayerRef = useRef(null);
  const wsRef = useRef(null);

  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [email, setEmail] = useState({ subject: '', body: '', to: '' });

  const handleLogin = () => {
    instance.loginPopup({ scopes }).then(response => {
      console.log('Access token:', response.accessToken);
      // The user is now authenticated
    });
  };

  useWebSocket(setMessages, audioPlayerRef, wsRef);

  const handleStartRecording = () => {
    startRecording(setIsRecording, setMessages, wsRef);
  };

  const handleStopRecording = () => {
    stopRecording(setIsRecording);
  };



  return (
      
      <div className="App">
        {!isAuthenticated && <button onClick={handleLogin}>Login with Outlook</button>}
        {isAuthenticated && (
          <>
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
          </>
        )}
      </div>
  );
}

export default App;