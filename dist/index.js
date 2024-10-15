import express from 'express';
import { WebSocketServer } from 'ws';
import { handleClientWebSocket } from './clientWs.js';
import { connectToOpenAiWebSocket } from './openAiWs.js';
const app = express();
const PORT = process.env.PORT || 5000;
// Start the Express server
const server = app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
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
//# sourceMappingURL=index.js.map