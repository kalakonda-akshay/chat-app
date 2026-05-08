import jwt from "jsonwebtoken";
import Message from "../models/Message.js";
import User from "../models/User.js";

const onlineUsers = new Map();

const populateMessage = (messageId) =>
  Message.findById(messageId)
    .populate("sender", "username email avatar online")
    .populate("receiver", "username email avatar online")
    .populate("room", "roomName members");

const initSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication token missing"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return next(new Error("User not found"));

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Socket authentication failed"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.user._id.toString();
    onlineUsers.set(userId, socket.id);
    socket.join(userId);

    await User.findByIdAndUpdate(userId, { online: true });

    io.emit("user_online", {
      userId,
      onlineUsers: Array.from(onlineUsers.keys())
    });

    socket.on("join_room", (roomId) => {
      socket.join(roomId);
    });

    socket.on("leave_room", (roomId) => {
      socket.leave(roomId);
      socket.to(roomId).emit("leave_room", { roomId, userId });
    });

    socket.on("typing", ({ receiverId, roomId, username }) => {
      const target = roomId || receiverId;
      if (target) {
        socket.to(target).emit("typing", { userId, username, receiverId, roomId });
      }
    });

    socket.on("stop_typing", ({ receiverId, roomId }) => {
      const target = roomId || receiverId;
      if (target) {
        socket.to(target).emit("stop_typing", { userId, receiverId, roomId });
      }
    });

    socket.on("send_message", async (payload, callback) => {
      try {
        const message = await Message.create({
          sender: userId,
          receiver: payload.receiver || null,
          room: payload.room || null,
          content: payload.content || "",
          messageType: payload.messageType || "text",
          fileUrl: payload.fileUrl || "",
          deliveredTo: [userId],
          seenBy: [userId]
        });

        const savedMessage = await populateMessage(message._id);
        const target = payload.room || payload.receiver;

        if (payload.room) {
          io.to(payload.room).emit("receive_message", savedMessage);
        } else if (payload.receiver) {
          io.to(payload.receiver).emit("receive_message", savedMessage);
          socket.emit("receive_message", savedMessage);
        }

        if (target) {
          io.to(target).emit("stop_typing", { userId, receiverId: payload.receiver, roomId: payload.room });
        }

        callback?.({ ok: true, message: savedMessage });
      } catch (error) {
        callback?.({ ok: false, error: error.message });
      }
    });

    socket.on("disconnect", async () => {
      onlineUsers.delete(userId);
      await User.findByIdAndUpdate(userId, { online: false });

      io.emit("user_offline", {
        userId,
        onlineUsers: Array.from(onlineUsers.keys())
      });
    });
  });
};

export default initSocket;
