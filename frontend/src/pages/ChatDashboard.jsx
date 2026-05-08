import { useEffect, useMemo, useRef, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useSocket } from "../hooks/useSocket.js";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";

const ChatDashboard = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [unread, setUnread] = useState({});
  const [soundEnabled, setSoundEnabled] = useState(false);
  const activeChatRef = useRef(null);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  const activeChatKey = useMemo(() => {
    if (!activeChat) return "";
    return activeChat.type === "room" ? `room:${activeChat._id}` : `user:${activeChat._id}`;
  }, [activeChat]);

  const playNotification = () => {
    if (!soundEnabled) return;
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.frequency.value = 740;
    gain.gain.setValueAtTime(0.04, audioContext.currentTime);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.08);
  };

  const fetchInitialData = async () => {
    const [usersResponse, roomsResponse] = await Promise.all([api.get("/auth/users"), api.get("/rooms")]);
    setUsers(usersResponse.data);
    setRooms(roomsResponse.data);
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!activeChat) return;

    const params =
      activeChat.type === "room" ? { roomId: activeChat._id } : { receiverId: activeChat._id };

    api.get("/messages", { params }).then(({ data }) => setMessages(data));

    if (activeChat.type === "room") {
      socket?.emit("join_room", activeChat._id);
      api.patch("/messages/seen", { roomId: activeChat._id });
    } else {
      api.patch("/messages/seen", { receiverId: activeChat._id });
    }

    setUnread((counts) => ({ ...counts, [activeChatKey]: 0 }));

    return () => {
      if (activeChat.type === "room") socket?.emit("leave_room", activeChat._id);
    };
  }, [activeChat, activeChatKey, socket]);

  useEffect(() => {
    if (!socket) return undefined;

    const handlePresence = ({ onlineUsers: ids }) => {
      setOnlineUsers(ids);
      setUsers((currentUsers) =>
        currentUsers.map((item) => ({ ...item, online: ids.includes(item._id) }))
      );
    };

    const handleReceiveMessage = (message) => {
      const current = activeChatRef.current;
      const incomingKey = message.room?._id
        ? `room:${message.room._id}`
        : `user:${message.sender._id === user._id ? message.receiver?._id : message.sender._id}`;

      const isActive =
        current &&
        ((current.type === "room" && message.room?._id === current._id) ||
          (current.type === "user" &&
            [message.sender._id, message.receiver?._id].includes(current._id)));

      if (isActive) {
        setMessages((currentMessages) => {
          if (currentMessages.some((item) => item._id === message._id)) return currentMessages;
          return [...currentMessages, message];
        });
      } else {
        setUnread((counts) => ({ ...counts, [incomingKey]: (counts[incomingKey] || 0) + 1 }));
        playNotification();
      }
    };

    const handleTyping = ({ userId, username, roomId, receiverId }) => {
      if (userId === user._id) return;
      const key = roomId ? `room:${roomId}` : `user:${userId || receiverId}`;
      setTypingUsers((current) => ({ ...current, [key]: username || "Someone" }));
    };

    const handleStopTyping = ({ userId, roomId, receiverId }) => {
      const key = roomId ? `room:${roomId}` : `user:${userId || receiverId}`;
      setTypingUsers((current) => {
        const copy = { ...current };
        delete copy[key];
        return copy;
      });
    };

    socket.on("user_online", handlePresence);
    socket.on("user_offline", handlePresence);
    socket.on("receive_message", handleReceiveMessage);
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);

    return () => {
      socket.off("user_online", handlePresence);
      socket.off("user_offline", handlePresence);
      socket.off("receive_message", handleReceiveMessage);
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
    };
  }, [socket, user._id, soundEnabled]);

  const sendMessage = async ({ content, fileUrl, messageType }) => {
    if (!activeChat || (!content.trim() && !fileUrl)) return;

    const payload = {
      content,
      fileUrl,
      messageType,
      receiver: activeChat.type === "user" ? activeChat._id : undefined,
      room: activeChat.type === "room" ? activeChat._id : undefined
    };

    socket?.emit("send_message", payload, (response) => {
      if (!response?.ok) console.error(response?.error || "Message failed");
    });
  };

  const sendTyping = (isTyping) => {
    if (!activeChat || !socket) return;
    const eventName = isTyping ? "typing" : "stop_typing";
    socket.emit(eventName, {
      receiverId: activeChat.type === "user" ? activeChat._id : undefined,
      roomId: activeChat.type === "room" ? activeChat._id : undefined,
      username: user.username
    });
  };

  const createRoom = async (roomName, members) => {
    const { data } = await api.post("/rooms", { roomName, members });
    setRooms((currentRooms) => [data, ...currentRooms]);
    setActiveChat({ ...data, type: "room" });
  };

  const joinRoom = async (roomId) => {
    const { data } = await api.patch(`/rooms/${roomId}/join`);
    setRooms((currentRooms) => {
      const exists = currentRooms.some((room) => room._id === data._id);
      return exists ? currentRooms.map((room) => (room._id === data._id ? data : room)) : [data, ...currentRooms];
    });
    setActiveChat({ ...data, type: "room" });
  };

  const leaveRoom = async (roomId) => {
    await api.patch(`/rooms/${roomId}/leave`);
    socket?.emit("leave_room", roomId);
    setRooms((currentRooms) => currentRooms.filter((room) => room._id !== roomId));
    if (activeChat?._id === roomId) {
      setActiveChat(null);
      setMessages([]);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#164e63,#0f172a_34%,#020617)] p-3 text-white sm:p-5">
      <div className="mx-auto grid h-[calc(100vh-24px)] max-w-7xl overflow-hidden rounded-2xl border border-white/10 bg-slate-950/55 shadow-2xl backdrop-blur-xl sm:h-[calc(100vh-40px)] chat-grid">
        <Sidebar
          activeChat={activeChat}
          createRoom={createRoom}
          joinRoom={joinRoom}
          leaveRoom={leaveRoom}
          onlineUsers={onlineUsers}
          rooms={rooms}
          setActiveChat={setActiveChat}
          unread={unread}
          users={users}
        />
        <section className="flex min-h-0 flex-col border-l border-white/10 max-[900px]:border-l-0">
          <Navbar soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} />
          <ChatWindow
            activeChat={activeChat}
            currentUser={user}
            leaveRoom={leaveRoom}
            messages={messages}
            onSend={sendMessage}
            onTyping={sendTyping}
            typingLabel={typingUsers[activeChatKey]}
          />
        </section>
      </div>
    </main>
  );
};

export default ChatDashboard;
