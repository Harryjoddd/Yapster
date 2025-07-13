import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import { askYapsterBot } from "../controllers/ai.controller.js"; // ✅ AI Bot controller

const router = express.Router();

// 📨 Routes for user-to-user messages
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

// 🤖 Route for AI chatbot (Yapster Bot)
router.post("/ask-bot", protectRoute, askYapsterBot); // ✅ Added AI bot route

export default router;
