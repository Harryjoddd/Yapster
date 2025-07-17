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
			// Optimistic UI: show user's message instantly
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
				if (data.error) throw new Error(data.error);

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
				if (data.error) throw new Error(data.error);

				setMessages((prev) => [...prev, data]);
			}
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};

export default useSendMessage;
