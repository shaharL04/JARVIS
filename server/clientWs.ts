import WebSocket from 'ws';
import { forwardToOpenAi } from './openAiWs.js';

export const handleClientWebSocket = (clientSocket: WebSocket, openaiWs: WebSocket) => {
    console.log('Client connected');

        // Handle messages from the client and forward them to OpenAI WebSocket
        clientSocket.on('message', (message: string) => {
            try {
                const event = JSON.parse(message);
                console.log("new message arrived front frontend: "+message)
                forwardToOpenAi(clientSocket, openaiWs, event);
            } catch (error) {
                console.error('Error parsing message from client:', error);
        
                // Narrowing the type of the error
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        
                clientSocket.send(JSON.stringify({
                    type: 'error',
                    error: {
                        message: 'Invalid JSON format sent to server.',
                        details: errorMessage,
                    },
                }));
            }
        });

    // Handle client disconnection
    clientSocket.on('close', () => {
        console.log('Client disconnected');
        clientSocket.close();
    });

    clientSocket.on('error', (error) => {
        console.error('Client WebSocket error:', error);
        clientSocket.close();
    });
};
