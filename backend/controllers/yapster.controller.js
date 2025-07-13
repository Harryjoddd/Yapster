// backend/controllers/yapster.controller.js
import { Configuration, OpenAIApi } from "openai";

const config = new Configuration({
	apiKey: process.env.OPENAI_API_KEY, // 🔐 Make sure this is in your .env
});

const openai = new OpenAIApi(config);

// Yapster AI Chat Controller
export const chatWithYapster = async (req, res) => {
	try {
		const { message } = req.body;

		if (!message || typeof message !== "string") {
			return res.status(400).json({ error: "Invalid message input" });
		}

		const gptResponse = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: [
				{ role: "system", content: "You are Yapster, a friendly AI assistant." },
				{ role: "user", content: message },
			],
		});

		const botReply = gptResponse.data.choices[0].message.content.trim();

		res.status(200).json({
			senderId: "YAPSTER_AI",
			message: botReply,
			createdAt: new Date(),
		});
	} catch (error) {
		console.error("Yapster AI error:", error.message);
		res.status(500).json({ error: "Yapster AI bot failed to respond" });
	}
};
