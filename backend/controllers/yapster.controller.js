import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export const generateYapsterReply = async (req, res) => {
	try {
		const { message } = req.body;

		// Debug: Check incoming message
		console.log("✅ [Yapster] Incoming message:", message);

		if (!message || typeof message !== "string") {
			console.warn("⚠️ Invalid message body received");
			return res.status(400).json({ error: "Message is required" });
		}

		// Call OpenAI API
		const chatCompletion = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content:
						"You are Yapster, an intelligent and helpful chatbot assistant inside a messaging app.",
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

		console.log("🤖 [Yapster] AI Reply:", reply);

		if (!reply) {
			console.error("❌ [Yapster] No response received from OpenAI");
			throw new Error("No reply received from Yapster AI");
		}

		return res.status(200).json({ message: reply });
	} catch (error) {
		console.error("❌ [Yapster AI Error]:", error);
		return res.status(500).json({ error: "Something went wrong with Yapster bot." });
	}
};
