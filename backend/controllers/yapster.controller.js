import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENROUTER_API_KEY,
	baseURL: "https://openrouter.ai/api/v1", // ✅ Required
});

export const generateYapsterReply = async (req, res) => {
	try {
		const { message } = req.body;

		console.log("✅ [Yapster] Incoming message:", message);

		if (!message || typeof message !== "string") {
			return res.status(400).json({ error: "Message is required" });
		}

		const chatCompletion = await openai.chat.completions.create({
			model: "openai/gpt-3.5-turbo", // ✅ free-tier
			messages: [
				{
					role: "system",
					content: "You are Yapster, an intelligent chatbot assistant in a messaging app.",
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
		if (!reply) throw new Error("No reply from Yapster AI");

		console.log("🤖 [Yapster Reply]:", reply);
		res.status(200).json({ message: reply });
	} catch (error) {
		console.error("❌ [Yapster AI Error]:", error);
		res.status(500).json({ error: "Something went wrong with Yapster bot." });
	}
};
