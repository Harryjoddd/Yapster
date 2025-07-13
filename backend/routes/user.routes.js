import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUsersForSidebar } from "../controllers/user.controller.js";
import { generateYapsterReply } from "../controllers/yapster.controller.js"; // ✅ updated import

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);

// ✅ Route to handle AI bot
router.post("/ai/chat", protectRoute, generateYapsterReply);

export default router;
