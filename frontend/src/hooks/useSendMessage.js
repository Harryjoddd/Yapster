import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	const sendMessage = async (message) => {
		if (!selectedConversation?._id) return toast.error("No conversation selected");

		setLoading(true);

		try {
			// Optimistically add user's message to chat
			const tempMessage = {
				_id: Date.now(),
				senderId: "user",
				receiverId: selectedConversation._id,
				message,
				createdAt: new Date().toISOString(),
				shouldShake: false,
			};
			setMessages((prev) => [...prev, tempMessage]);

			const isBot = selectedConversation.username === "yapster-bot";

			if (isBot) {
				const res = await fetch("/api/users/ai/chat", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ message }),
				});

				const data = await res.json();

				if (!res.ok) throw new Error(data.error || "Bot failed to reply.");

				// Show bot reply
				const botReply = {
					_id: Date.now() + 1,
					senderId: selectedConversation._id,
					receiverId: "user",
					message: data.message,
					createdAt: new Date().toISOString(),
					shouldShake: true,
				};

				setMessages((prev) => [...prev, botReply]);
			} else {
				// Normal user messaging
				const res = await fetch(`/api/messages/send/${selectedConversation._id}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ message }),
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Failed to send message");

				setMessages((prev) => [...prev, data]);
			}
		} catch (error) {
			console.error("💥 Error sending message:", error);
			toast.error(error.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};

export default useSendMessage;
