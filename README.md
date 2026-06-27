# LinkPilot

LinkPilot is a URL shortener built with a Next.js frontend and an Express/MongoDB backend.

## Environment

Use one env file only at the project root:

```text
.env.local
```

Required values:

```bash
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/linkpilot?retryWrites=true&w=majority
BASE_URL=http://localhost:4000
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000
DNS_SERVERS=1.1.1.1,8.8.8.8
SHORT_CODE_LENGTH=8
MONGO_SERVER_SELECTION_TIMEOUT_MS=8000
REDIRECT_RATE_LIMIT_WINDOW_MS=60000
REDIRECT_RATE_LIMIT_MAX=120
```

The backend and frontend both read this root `.env.local`.

## Run

```bash
npm install
npm run dev
```

Frontend: `http://localhost:3000`

Backend: `http://localhost:4000`

Health check:

```text
http://localhost:4000/health
```
