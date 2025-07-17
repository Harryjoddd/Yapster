import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	const sendMessage = async (message) => {
		if (!selectedConversation?._id) {
			toast.error("No conversation selected");
			return;
		}

		setLoading(true);

		try {
			// Optimistic UI: show user's message
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

				if (!res.ok || data.error) {
					throw new Error(data.error || "Bot error");
				}

				console.log("🧠 Bot replied:", data.message); // Debugging log

				const aiReply = {
					_id: Date.now() + 1,
					senderId: selectedConversation._id,
					receiverId: "user",
					message: data.message,
					createdAt: new Date().toISOString(),
					shouldShake: true,
				};

				setMessages((prev) => [...prev, aiReply]);
			} else {
				const res = await fetch(`/api/messages/send/${selectedConversation._id}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ message }),
				});

				const data = await res.json();

				if (!res.ok || data.error) {
					throw new Error(data.error || "Message failed");
				}

				setMessages((prev) => [...prev, data]);
			}
		} catch (error) {
			console.error("❌ sendMessage error:", error.message);
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};

export default useSendMessage;
