# JARVIS

The **JARVIS** project is a real-time AI assistant that offers both voice and text interaction capabilities. By integrating the OpenAI API for natural language understanding and utilizing WebSockets for low-latency communication, JARVIS delivers timely weather updates, news briefings, and email automation, streamlining everyday tasks.

## Features

- **Voice & Text Interaction**: Communicate with the assistant using either voice commands or text input.
- **Real-Time Processing**: Utilizes WebSockets to ensure near-instantaneous responses.
- **Integrated Modules**: Access weather updates, news briefings, and email automation directly within the assistant.
- **Natural Language Understanding**: Leverages the OpenAI API to interpret and respond to user queries effectively.

## Technologies Used

- **Frontend**: React.js, CSS, Socket.io
- **Backend**: Node.js, Express.js, Socket.io
- **Real-Time Processing**: WebSockets
- **AI Integration**: OpenAI RealTime API

## 🚀 Getting Started

Follow these steps to get the Unitalking platform up and running locally.

### 1. Clone the Repository

```bash
git clone https://github.com/shaharL04/JARVIS.git
cd JARVIS
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

### 4. Start Redis Using Docker

Make sure Docker is installed and running on your system. Then run:

```bash
docker run --name redis -p 6379:6379 -d redis
```

If Redis is already running, you can skip this step.

### 5. Set Up Environment Variables

Create a `.env` file in the backend directory and add the following environment variables:

```env
NEWS_API_KEY = 
WHEATHER_API_KEY = 
STOCKS_API_KEY = 
OPENEXCHANGERATES_API_KEY = 
OPENAI_KEY=
AZURE_AD_TENANT_ID=
AZURE_AD_CLIENT_ID=
AZURE_AD_CLIENT_SECRET=
AZURE_AD_REDIRECT_URI_AFTER_ADMIN_GRANT=http://localhost:5000/auth/microsoft/login
AZURE_AD_REDIRECT_URI=http://localhost:5000/auth/microsoft/callback
AZURE_AD_CLIENT_REDIRECT_URI=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback
```

Update the values according to your setup.

### 6. Run the Backend Server

```bash
cd backend
npm run dev
```

## Demo
https://www.dropbox.com/scl/fi/bm9i7p1ivraurcwlmuqbm/JARVIS1.mp4?rlkey=xnlxbrg29c2ns7noflhrc8039&st=70ddu4qz&dl=0

