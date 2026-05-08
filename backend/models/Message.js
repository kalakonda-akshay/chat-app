import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      default: null
    },
    content: {
      type: String,
      trim: true,
      default: ""
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text"
    },
    fileUrl: {
      type: String,
      default: ""
    },
    seen: {
      type: Boolean,
      default: false
    },
    deliveredTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    seenBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
