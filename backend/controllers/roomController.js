import Room from "../models/Room.js";

export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find({ members: req.user._id })
      .populate("members", "username email avatar online")
      .populate("createdBy", "username email avatar")
      .sort({ updatedAt: -1 });

    res.json(rooms);
  } catch (error) {
    next(error);
  }
};

export const createRoom = async (req, res, next) => {
  try {
    const { roomName, members = [] } = req.body;

    if (!roomName) {
      res.status(400);
      throw new Error("Room name is required");
    }

    const memberIds = [...new Set([req.user._id.toString(), ...members])];
    const room = await Room.create({
      roomName,
      members: memberIds,
      createdBy: req.user._id
    });

    const populatedRoom = await Room.findById(room._id)
      .populate("members", "username email avatar online")
      .populate("createdBy", "username email avatar");

    res.status(201).json(populatedRoom);
  } catch (error) {
    next(error);
  }
};

export const joinRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { members: req.user._id } },
      { new: true }
    )
      .populate("members", "username email avatar online")
      .populate("createdBy", "username email avatar");

    if (!room) {
      res.status(404);
      throw new Error("Room not found");
    }

    res.json(room);
  } catch (error) {
    next(error);
  }
};

export const leaveRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { $pull: { members: req.user._id } },
      { new: true }
    )
      .populate("members", "username email avatar online")
      .populate("createdBy", "username email avatar");

    if (!room) {
      res.status(404);
      throw new Error("Room not found");
    }

    res.json(room);
  } catch (error) {
    next(error);
  }
};
