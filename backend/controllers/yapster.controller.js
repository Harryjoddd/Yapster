import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

// Check if API key is loaded
if (!process.env.OPENAI_API_KEY) {
	console.error("❌ OPENAI_API_KEY is missing in .env");
	throw new Error("OPENAI_API_KEY is missing");
}

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
});

export const generateYapsterReply = async (req, res) => {
	try {
		const { message } = req.body;

		// Debug log
		console.log("📩 [Yapster] Received message:", message);

		if (!message || typeof message !== "string") {
			return res.status(400).json({ error: "Message is required" });
		}

		// Send to OpenAI
		const response = await openai.chat.completions.create({
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
			max_tokens: 150,
		});

		const reply = response.choices?.[0]?.message?.content?.trim();

		console.log("🤖 [Yapster] Bot reply:", reply);

		if (!reply) {
			console.error("❌ No reply received from OpenAI");
			return res.status(500).json({ error: "Yapster did not respond." });
		}

		return res.status(200).json({ message: reply });
	} catch (error) {
		console.error("❌ [Yapster Bot Error]:", error?.message || error);
		return res.status(500).json({ error: "Something went wrong with Yapster bot." });
	}
};
