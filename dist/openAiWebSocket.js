import WebSocket from 'ws';
export const handleOpenAiWebSocket = (clientSocket, openaiWs) => {
    openaiWs.on('message', (data) => {
        let messageStr;
        // Handle binary and string data types
        if (Buffer.isBuffer(data)) {
            messageStr = data.toString('utf-8');
        }
        else if (typeof data === 'string') {
            messageStr = data;
        }
        if (messageStr) {
            clientSocket.send(messageStr);
        }
        else {
            console.warn('Unsupported data type received from OpenAI:', typeof data);
        }
    });
    openaiWs.on('error', (error) => {
        console.error('OpenAI WebSocket error:', error);
        clientSocket.send(JSON.stringify({ type: 'error', error: { message: 'OpenAI WebSocket connection error', details: error.message } }));
    });
    openaiWs.on('close', () => {
        console.log('OpenAI WebSocket connection closed');
        clientSocket.close(); // Close the client socket too if the OpenAI WebSocket is closed
    });
    // Handle messages from the client and forward them to OpenAI WebSocket
    clientSocket.on('message', (message) => {
        try {
            const event = JSON.parse(message);
            // Check if OpenAI WebSocket is open before sending the message
            if (openaiWs.readyState === WebSocket.OPEN) {
                openaiWs.send(JSON.stringify(event));
            }
            else {
                console.warn('OpenAI WebSocket is not ready. Message not sent:', event);
                clientSocket.send(JSON.stringify({ type: 'error', error: { message: 'OpenAI WebSocket not ready.' } }));
            }
        }
        catch (e) {
            console.error('Error parsing message from client:', e);
            clientSocket.send(JSON.stringify({ type: 'error', error: { message: 'Invalid JSON format', details: e.message } }));
        }
    });
    clientSocket.on('close', () => {
        console.log('Client disconnected');
    });
    clientSocket.on('error', (error) => {
        console.error('Client WebSocket error:', error);
    });
};
//# sourceMappingURL=openAiWebSocket.js.map