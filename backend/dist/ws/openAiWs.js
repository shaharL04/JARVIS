import WebSocket from 'ws';
let openaiWs = null;
// Function to create a new OpenAI WebSocket connection with a client socket
export const connectToOpenAiWebSocket = (clientSocket) => {
    const openaiUrl = 'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01';
    console.log('Establishing connection to OpenAI Realtime API...');
    openaiWs = new WebSocket(openaiUrl, {
        headers: {
            Authorization: `Bearer ${process.env.OPENAI_KEY}`,
            'OpenAI-Beta': 'realtime=v1',
        },
    });
    openaiWs.on('open', () => {
        console.log('Connected to OpenAI Realtime API');
    });
    openaiWs.on('message', (data) => {
        let messageStr;
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
    openaiWs.on('close', () => {
        console.log('OpenAI WebSocket connection closed. Attempting to reconnect in 5 seconds...');
        setTimeout(() => connectToOpenAiWebSocket(clientSocket), 5000);
    });
    openaiWs.on('error', (error) => {
        console.error('OpenAI WebSocket error:', error);
    });
    return openaiWs;
};
// Function to forward messages from the client to OpenAI WebSocket
export const forwardToOpenAi = (clientSocket, openaiWs, message) => {
    if (openaiWs && openaiWs.readyState === WebSocket.OPEN) {
        console.log("Sending first message: " + JSON.stringify(message));
        openaiWs.send(JSON.stringify(message));
    }
    else {
        console.warn('OpenAI WebSocket is not ready. Message not sent:', message);
        clientSocket.send(JSON.stringify({ type: 'error', error: { message: 'OpenAI WebSocket not ready.' } }));
    }
};
//# sourceMappingURL=openAiWs.js.map