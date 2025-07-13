import express from "express";
import dotenv from "dotenv";
import { askYapsterBot } from "../controllers/ai.controller.js";
import protectRoute from "../middleware/protectRoute.js";

dotenv.config();

const router = express.Router();

// Route: POST /api/ai/chat
router.post("/chat", protectRoute, askYapsterBot);

export default router;
