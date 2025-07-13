import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export const askYapsterBot = async (req, res) => {
	try {
		const { message } = req.body;

		if (!message) {
			return res.status(400).json({ error: "Message is required." });
		}

		const completion = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{ role: "system", content: "You are Yapster, a friendly, funny, and helpful AI assistant." },
				{ role: "user", content: message },
			],
		});

		const aiReply = completion.choices[0].message.content.trim();

		res.status(200).json({ reply: aiReply });
	} catch (error) {
		console.error("Error in askYapsterBot controller:", error.message);
		res.status(500).json({ error: "Failed to get response from Yapster Bot." });
	}
};
