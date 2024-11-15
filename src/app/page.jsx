"use client";
import React, { useState, useEffect, useRef } from "react";
import { startRecording, stopRecording } from "./components/AudioHandler";
import { useWebSocket } from "./components/WebSocketHandler";
import { functions } from "./helper/apiReqHandler";
import { jwtDecode } from "jwt-decode";
import "./app.css";

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const audioPlayerRef = useRef(null);
  const wsRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState("");


  const microsoftHandleLogin = async () => {
    window.location.href = "http://localhost:5000/auth/microsoft/login";

  };

  const googleHandleLogin = async () => {
    window.location.href = "http://localhost:5000/auth/google/login";
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("jwtToken", token);
      window.history.replaceState({}, document.title, "/");

      try {
        const decoded = jwtDecode(token);
        console.log(decoded)
        if (decoded.isAuth) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    } else {
      const storedToken = localStorage.getItem("jwtToken");
      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          console.log(decoded)
          if (decoded.isAuth) {
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("Invalid stored token:", error);
          localStorage.removeItem("jwtToken");
        }
      }
    }
}, []);

  useWebSocket(setMessages, audioPlayerRef, wsRef);

  const handleStartRecording = () => {
    startRecording(setIsRecording, setMessages, wsRef);
  };

  const handleStopRecording = () => {
    stopRecording(setIsRecording);
  };


  return (
    <div className="App">
      {!isAuthenticated && (
        <div className="entryAuthPage">
          <div className="welcomeText">
            Welcome, I am JARVIS.
            <br />
            <br />
            Your personal AI assistant
          </div>
          <div className="loginBtns">
            <button onClick={microsoftHandleLogin} className="signInBtn">
              <img
                src="/microsoft.png"
                alt="microsoft"
                className="microsoftPhoto"
              />
              Sign in with Microsoft
            </button>
            <button onClick={googleHandleLogin} className="signInBtn">
              <img
                src="/google.png"
                alt="google"
                className="googlePhoto"
              />
              Sign in with Google
            </button>
          </div>
        </div>
      )}
      {isAuthenticated && (
        <div className="realtime-api-wrapper-div">
          <div className="realtime-api-demo">
            <h1>JARVIS</h1>
            <button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
            <div id="status">{isRecording ? "Recording..." : "Idle"}</div>

            <div className="messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.role}`}>
                  {msg.text && <p>{msg.text}</p>}
                  {msg.audio && (
                    <audio
                      controls
                      src={`data:audio/wav;base64,${msg.audio}`}
                    />
                  )}
                </div>
              ))}
            </div>

            <audio ref={audioPlayerRef} style={{ display: "none" }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
