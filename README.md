# MenTex – Mental Health Support Chat App

Full-stack chat app with React (Vite) + Node.js (Express) + Google Gemini streaming.

## Structure

```
client/   # React + Vite frontend
server/   # Node + Express backend
```

## Backend Setup

```x
cd server
npm install
npm run dev
```

Create `server/.env` with:

```
GEMINI_API_KEY=YOUR_REAL_API_KEY
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
OPENAI_SAFETY_MODEL=gpt-4o-mini
OPENROUTER_API_KEY=YOUR_OPENROUTER_KEY
OPENROUTER_MODEL=openai/gpt-4o-mini
PORT=4000
MONGO_URI=mongodb://localhost:27017/mentex
```

## Frontend Setup

```
cd client
npm install
npm run dev
```

## Notes

- The API key lives only in `server/.env`.
- The frontend streams responses via SSE.
- Empty messages and repeated greetings are ignored.
