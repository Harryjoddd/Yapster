import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUsersForSidebar } from "../controllers/user.controller.js";
import { chatWithYapster } from "../controllers/yapster.controller.js"; // 🚀 New

const router = express.Router();

// Get all users for sidebar
router.get("/", protectRoute, getUsersForSidebar);

// ✨ Chat with AI bot Yapster
router.post("/yapster", protectRoute, chatWithYapster); // 🧠 New AI route

export default router;
