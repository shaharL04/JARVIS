import express from 'express';
import { WebSocketServer } from 'ws';
import { handleClientWebSocket } from './ws/clientWs.js';
import { connectToOpenAiWebSocket } from './ws/openAiWs.js';
import { getLatestNewsByCategory } from './api/news.js'
import { getWheatherPerLocation } from './api/weather.js'

const app = express();
const PORT = process.env.PORT || 5000;

// Start the Express server
app.listen(PORT, async () => {
    console.log(`Server is listening on port ${PORT}`);
    await getLatestNewsByCategory("test")
    await getWheatherPerLocation("test")
});

// WebSocket server for handling audio from the frontend
const wss = new WebSocketServer({ port: 9000 });

// Handle new client connections
wss.on('connection', (clientSocket) => {
    // Create the OpenAI WebSocket connection for this client
    const openaiWs = connectToOpenAiWebSocket(clientSocket);
    
    // Handle messages from the client
    handleClientWebSocket(clientSocket, openaiWs);
});
