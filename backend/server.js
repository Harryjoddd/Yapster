import dotenv from "dotenv";
dotenv.config();

import path from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";
import createBotUser from "./utils/createBotUser.js"; // ✅ NEW LINE

// Setup __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debug log
console.log("ENV MONGO_DB_URI:", process.env.MONGO_DB_URI);

// Port
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Serve static frontend
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("/*", (req, res) => {
	const indexPath = path.resolve(__dirname, "../frontend/dist/index.html");
	if (existsSync(indexPath)) {
		res.sendFile(indexPath);
	} else {
		res.status(404).send("Frontend not built. Please run 'npm run build' in frontend.");
	}
});

// Start server after connecting to DB and creating bot
const startServer = async () => {
	try {
		await connectToMongoDB();
		await createBotUser(); // ✅ Ensures the Yapster Bot exists
		server.listen(PORT, () => {
			console.log(`✅ Server Running on port ${PORT}`);
		});
	} catch (err) {
		console.error("Error starting server:", err);
	}
};

startServer();
