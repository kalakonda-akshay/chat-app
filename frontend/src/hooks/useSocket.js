import { useEffect, useState } from "react";
import { connectSocket, disconnectSocket } from "../socket/socket.js";
import { useAuth } from "../context/AuthContext.jsx";

export const useSocket = () => {
  const { token } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!token) return undefined;

    const activeSocket = connectSocket(token);
    setSocket(activeSocket);

    return () => {
      disconnectSocket();
      setSocket(null);
    };
  }, [token]);

  return socket;
};
