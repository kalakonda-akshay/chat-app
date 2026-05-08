import { io } from "socket.io-client";
import { API_URL } from "../api/axios.js";

let socket;

export const connectSocket = (token) => {
  if (socket?.connected) return socket;

  socket = io(API_URL, {
    auth: { token },
    transports: ["websocket", "polling"]
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
