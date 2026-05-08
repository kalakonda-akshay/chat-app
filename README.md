# Nebula Chat - MERN Real-Time Chat App

Nebula Chat is a complete MERN stack chat application with JWT authentication, MongoDB persistence, Socket.IO real-time messaging, private chats, group rooms, typing indicators, online presence, unread counts, file sharing, and a responsive dark UI.

## Tech Stack

- Frontend: React.js, Vite, Tailwind CSS, Axios, React Router DOM, Context API, Socket.IO Client
- Backend: Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, bcryptjs, Socket.IO, Multer

## Folder Structure

```text
chat-app/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── socket/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## Backend Setup

### Easiest Windows Setup

After extracting the ZIP, open the `chat-app` folder and double-click:

```text
start-app.bat
```

This script will:

- Stop old processes using ports `5000` and `5173`
- Install backend dependencies
- Create or reset the demo user
- Install frontend dependencies
- Start backend and frontend in separate terminals
- Open `http://localhost:5173`

The frontend uses Vite proxy rules, so browser requests go to `http://localhost:5173/api` and are forwarded to the backend on `http://localhost:5000`. This avoids local CORS and host mismatch issues.

If you ever get a port error, double-click:

```text
stop-app-ports.bat
```

Then run `start-app.bat` again.

Demo login:

```text
Email: demo@example.com
Password: password123
```

### Manual Backend Setup

```bash
cd backend
npm install
node seedDemoUser.js
npm run dev
```

The backend runs at:

```text
http://localhost:5000
```

The included `.env` file contains:

```env
PORT=5000
MONGO_URI=mongodb+srv://akshaykalakonda9_db_user:rV3GDIiUTKcjWOTc@cluster0.ycl3ozb.mongodb.net/chatapp?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=supersecretjwtkey
CLIENT_URL=http://localhost:5173
```

## Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

Keep the backend terminal open while using the frontend. The frontend proxies API and Socket.IO traffic to the backend.

## Main Features

- User registration and login
- JWT protected API routes
- bcryptjs password hashing
- Persistent login with `localStorage`
- Logout support
- One-to-one real-time messaging
- Group room create, join, and leave flows
- Socket.IO events for connection, disconnect, rooms, typing, online status, and messages
- MongoDB chat history
- Image and file upload through Multer
- Uploaded files saved in `backend/uploads`
- Image previews inside chat
- Emoji shortcuts
- Auto-scroll message view
- Delivered and seen indicators
- Online/offline user list
- Typing indicator
- Unread message counters
- Optional sound notifications
- Responsive dark glassmorphism UI

## API Routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/auth/users`
- `POST /api/auth/logout`

### Messages

- `GET /api/messages?receiverId=USER_ID`
- `GET /api/messages?roomId=ROOM_ID`
- `POST /api/messages`
- `PATCH /api/messages/seen`

### Rooms

- `GET /api/rooms`
- `POST /api/rooms`
- `PATCH /api/rooms/:id/join`
- `PATCH /api/rooms/:id/leave`

### Uploads

- `POST /api/upload`

## Socket.IO Events

- `connection`
- `disconnect`
- `join_room`
- `leave_room`
- `send_message`
- `receive_message`
- `typing`
- `stop_typing`
- `user_online`
- `user_offline`

## Usage Notes

1. Start the backend first.
2. Start the frontend second.
3. Register at least two users in separate browsers or incognito windows to test private chat.
4. Create a room and add members to test group chat.
5. Use the room ID field to join an existing room directly.
6. Use the attachment button to upload images or files.

## Production Notes

- Move secrets to secure environment variables before deployment.
- Add your deployed frontend URL to backend CORS settings.
- Store uploaded files in cloud storage for production-scale usage.
- Rotate the included sample JWT secret and database credentials before sharing publicly.
