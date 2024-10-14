import express from 'express';
import { WebSocketServer } from 'ws';
import { handleOpenAiWebSocket } from './openAiWebSocket.js';
import WebSocket from 'ws';

const app = express();
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

// WebSocket server for handling audio from the frontend
const wss = new WebSocketServer({ port: 9000 });

// Define OpenAI WebSocket connection URL
const openaiUrl = 'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01';

// Create a WebSocket connection to OpenAI Realtime API
const openaiWs = new WebSocket(openaiUrl, {
    headers: {
        Authorization: `Bearer sk-CWb3g0xHbN0zXYz70qn1IeTq_kvL3BIbXmFRO8wqH6T3BlbkFJHhU-oiRlpKofImvsnr64-MUKKM54UsFsK97S7tzagA`,
        'OpenAI-Beta': 'realtime=v1',
    },
});


wss.on('connection', (clientSocket) => {
    console.log('Client connected');


    // Pass both clientSocket and openaiWs to the handler
    handleOpenAiWebSocket(clientSocket, openaiWs);
});
