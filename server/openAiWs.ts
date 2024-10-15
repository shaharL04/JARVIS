import WebSocket from 'ws';

let openaiWs: WebSocket | null = null;

// Function to create a new OpenAI WebSocket connection with a client socket
export const connectToOpenAiWebSocket = (clientSocket: WebSocket): WebSocket => {
    const openaiUrl = 'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01';

    openaiWs = new WebSocket(openaiUrl, {
        headers: {
            Authorization: `Bearer sk-CWb3g0xHbN0zXYz70qn1IeTq_kvL3BIbXmFRO8wqH6T3BlbkFJHhU-oiRlpKofImvsnr64-MUKKM54UsFsK97S7tzagA`,
            'OpenAI-Beta': 'realtime=v1',
        },
    });

    openaiWs.on('open', () => {
        console.log('Connected to OpenAI Realtime API');
    });

    openaiWs.on('message', (data: WebSocket.Data) => {
        let messageStr;
        // Handle binary and string data types
        if (Buffer.isBuffer(data)) {
            messageStr = data.toString('utf-8');
        } else if (typeof data === 'string') {
            messageStr = data;
        }
        console.log('Message received from OpenAI:', messageStr);
        
        if (messageStr) {
            clientSocket.send(messageStr); // Send message back to the client
        } else {
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
export const forwardToOpenAi = (clientSocket: WebSocket, openaiWs: WebSocket, message: any) => {
    if (openaiWs && openaiWs.readyState === WebSocket.OPEN) {
        openaiWs.send(JSON.stringify(message));
    } else {
        console.warn('OpenAI WebSocket is not ready. Message not sent:', message);
        clientSocket.send(JSON.stringify({ type: 'error', error: { message: 'OpenAI WebSocket not ready.' } }));
    }
};
