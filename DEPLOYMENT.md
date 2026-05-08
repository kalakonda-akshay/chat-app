# Deployment Guide

## GitHub

This repository is safe to push because `backend/.env` is ignored. Do not commit real database passwords or JWT secrets.

## Vercel Frontend

Vercel should deploy the React frontend only.

1. Import the GitHub repo in Vercel.
2. Use the root project directory.
3. The included `vercel.json` tells Vercel to build `frontend`.
4. Add this environment variable after deploying your backend:

```text
VITE_API_URL=https://your-backend-url.com
```

## Backend

The backend uses Express and Socket.IO. For real-time WebSocket support, deploy it to a long-running Node host such as Render, Railway, Fly.io, or a VPS.

Set these backend environment variables:

```text
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=change_this_to_a_long_random_secret
CLIENT_URL=https://your-vercel-app.vercel.app
```

Then set `VITE_API_URL` in Vercel to the deployed backend URL.
