import express from 'express';
import { WebSocketServer } from 'ws';
import corsMiddleware from './middlewares/corsMiddleware.js';
import router from './routes/index.js'
import { handleClientWebSocket } from './ws/clientWs.js';
import { connectToOpenAiWebSocket } from './ws/openAiWs.js';


const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(corsMiddleware);
app.use('/', router);


app.listen(PORT, async () => {
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
