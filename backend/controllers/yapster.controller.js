// /backend/controllers/yapster.controller.js
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export const generateYapsterReply = async (req, res) => {
	try {
		const { message } = req.body;

		console.log("✅ Incoming message to Yapster:", message);

		if (!message || typeof message !== "string") {
			console.warn("⚠️ Invalid message format");
			return res.status(400).json({ error: "Message is required and must be a string." });
		}

		const chatCompletion = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content: "You are Yapster, a helpful AI chatbot assistant.",
				},
				{
					role: "user",
					content: message,
				},
			],
			temperature: 0.7,
			max_tokens: 100,
		});

		const reply = chatCompletion.choices?.[0]?.message?.content?.trim();

		console.log("🤖 Yapster reply:", reply);

		if (!reply) {
			console.error("❌ No reply from OpenAI");
			throw new Error("OpenAI returned no reply.");
		}

		return res.status(200).json({ message: reply });
	} catch (error) {
		console.error("❌ Yapster Error:", error);
		return res.status(500).json({ error: "Something went wrong with Yapster bot." });
	}
};
