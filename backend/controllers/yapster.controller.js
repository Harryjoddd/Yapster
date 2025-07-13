import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
});

export const generateYapsterReply = async (req, res) => {
	try {
		const { message } = req.body;

		if (!message) {
			return res.status(400).json({ error: "Message is required" });
		}

		const chatCompletion = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content: "You are Yapster, an intelligent and helpful chatbot assistant inside a messaging app.",
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

		if (!reply) throw new Error("No reply received from Yapster AI");

		res.status(200).json({ message: reply });
	} catch (error) {
		console.error("Yapster AI Error:", error);
		res.status(500).json({ error: "Something went wrong with Yapster bot." });
	}
};
