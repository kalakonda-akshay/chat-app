# Full-Stack Deployment Guide

This project consists of two parts:
1. **Frontend**: React + Vite (hosted on **Vercel**)
2. **Backend**: Express + Socket.IO + MongoDB (hosted on **Render** / **Railway** / VPS)

---

## 1. Backend Deployment (Render)

Because Socket.IO requires continuous, long-lived WebSocket connections, deploy the backend to a dedicated Node server like Render:

### Steps on Render:
1. Log in to [Render.com](https://render.com) and click **New +** → **Web Service**.
2. Connect your GitHub repository.
3. Configure the service settings:
   - **Root Directory**: `chat-app/backend` (or `backend` if repo root is the chat-app folder)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
4. Add the following **Environment Variables**:
   - `PORT`: `5000`
   - `MONGO_URI`: `your_mongodb_atlas_connection_string`
   - `JWT_SECRET`: `your_random_jwt_secret_key`
   - `CLIENT_URL`: `https://chat-app-chi-pink.vercel.app` (your exact Vercel frontend URL, no trailing slash)
5. Click **Create Web Service** and copy your backend URL (e.g. `https://chat-app-backend.onrender.com`).

---

## 2. Frontend Deployment (Vercel)

The frontend is deployed to Vercel at `https://chat-app-chi-pink.vercel.app`.

### Connect Backend to Vercel:
1. Open your project on [Vercel Dashboard](https://vercel.com).
2. Navigate to **Settings** → **Environment Variables**.
3. Add or update the variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://chat-app-backend.onrender.com` (your live Render backend URL, without trailing slash)
4. Go to **Deployments** → click **...** on the latest deployment → **Redeploy**.

---

## 3. Verification

1. Open `https://chat-app-backend.onrender.com` in your browser:
   - Should return: `{"message":"MERN real-time chat API is running."}`
2. Open `https://chat-app-chi-pink.vercel.app/`:
   - Register a new user or click **Login as Demo**.
   - Open in an incognito window with a second user to test live messaging and presence.
