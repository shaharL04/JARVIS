'use client'
import React, { useState, useRef } from 'react';
import { startRecording, stopRecording } from './components/AudioHandler';
import { useWebSocket } from './components/WebSocketHandler';
import {useMsal, useIsAuthenticated } from '@azure/msal-react';
import { functions } from './helper/apiReqHandler';
import { loginRequest } from './helper/authProvider';
import './app.css'




function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const audioPlayerRef = useRef(null);
  const wsRef = useRef(null);

  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [email, setEmail] = useState({ subject: '', body: '', to: '' });

  const handleLogin = async () => {
    try {
      const loginResponse = await instance.loginPopup(loginRequest);
      console.log("Login successful:", loginResponse);
      const token = loginResponse.accessToken;
      localStorage.setItem('accessToken', token);
    } catch (error) {
      console.error("Login error:", error);
    }
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
        {!isAuthenticated && 
          <div className='entryAuthPage'>
              <div className='welcomeText'>
              Welcome, I am JARVIS. 
              <br/>
              <br/>
               Your personal AI assistant
              </div>
              <button onClick={handleLogin} className='signInBtn'>
              <img src="/microsoft.png" alt="microsoft" className='microsoftPhoto'/>
                Sign in with Microsoft
                </button>
          </div>
        }
        {isAuthenticated && (
          <div className='realtime-api-wrapper-div'>
            <div className="realtime-api-demo">
              <h1>OpenAI Realtime API Demo</h1>
              
              <button onClick={isRecording ? handleStopRecording : handleStartRecording}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </button>
              <button onClick={() => functions.get_events_on_certain_dates("test")}>press meeeeee</button>
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
          </div>
        )}

      </div>
  );
}

export default App;