import express from "express";
import { createMessage, getMessages, markMessagesSeen } from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getMessages).post(protect, createMessage);
router.patch("/seen", protect, markMessagesSeen);

export default router;
