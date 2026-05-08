import Message from "../models/Message.js";

const populateMessage = (query) =>
  query
    .populate("sender", "username email avatar online")
    .populate("receiver", "username email avatar online")
    .populate("room", "roomName members");

export const getMessages = async (req, res, next) => {
  try {
    const { receiverId, roomId } = req.query;
    const currentUserId = req.user._id;

    let filter = {};

    if (roomId) {
      filter = { room: roomId };
    } else if (receiverId) {
      filter = {
        $or: [
          { sender: currentUserId, receiver: receiverId },
          { sender: receiverId, receiver: currentUserId }
        ]
      };
    } else {
      res.status(400);
      throw new Error("receiverId or roomId is required");
    }

    const messages = await populateMessage(Message.find(filter))
      .sort({ createdAt: 1 })
      .limit(200);

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const createMessage = async (req, res, next) => {
  try {
    const { receiver, room, content, messageType = "text", fileUrl = "" } = req.body;

    if (!receiver && !room) {
      res.status(400);
      throw new Error("Message needs a receiver or room");
    }

    if (!content && !fileUrl) {
      res.status(400);
      throw new Error("Message content or file is required");
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiver || null,
      room: room || null,
      content,
      messageType,
      fileUrl,
      deliveredTo: [req.user._id],
      seenBy: [req.user._id]
    });

    const populatedMessage = await populateMessage(Message.findById(message._id));
    res.status(201).json(populatedMessage);
  } catch (error) {
    next(error);
  }
};

export const markMessagesSeen = async (req, res, next) => {
  try {
    const { receiverId, roomId } = req.body;
    const currentUserId = req.user._id;

    const filter = roomId
      ? { room: roomId, sender: { $ne: currentUserId } }
      : { sender: receiverId, receiver: currentUserId };

    await Message.updateMany(filter, {
      $set: { seen: true },
      $addToSet: { seenBy: currentUserId }
    });

    res.json({ message: "Messages marked as seen" });
  } catch (error) {
    next(error);
  }
};
