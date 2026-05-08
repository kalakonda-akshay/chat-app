import express from "express";
import { createRoom, getRooms, joinRoom, leaveRoom } from "../controllers/roomController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getRooms).post(protect, createRoom);
router.patch("/:id/join", protect, joinRoom);
router.patch("/:id/leave", protect, leaveRoom);

export default router;
