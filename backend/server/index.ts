import express from 'express';
import { WebSocketServer } from 'ws';
import corsMiddleware from './middlewares/corsMiddleware.js';
import router from './routes/index.js'
import { handleClientWebSocket } from './ws/clientWs.js';
import { connectToOpenAiWebSocket } from './ws/openAiWs.js';
import session from 'express-session';
import bodyParser from 'body-parser';
import { connectRedis } from './config/redisClient.js';


const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(bodyParser.json());
app.use(corsMiddleware);

app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret', // Use a secure secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 86400000 } // Secure: true for HTTPSs
  }));

app.use('/', router);




async function startServer() {
    await connectRedis(); 

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
  }

  startServer();

// WebSocket server for handling audio from the frontend
const wss = new WebSocketServer({ port: 9000 });

// Handle new client connections
wss.on('connection', (clientSocket) => {
    // Create the OpenAI WebSocket connection for this client
    const openaiWs = connectToOpenAiWebSocket(clientSocket);
    
    // Handle messages from the client
    handleClientWebSocket(clientSocket, openaiWs);
});
