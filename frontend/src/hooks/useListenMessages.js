import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { setMessages } = useConversation();

	useEffect(() => {
		if (!socket) return;

		const handleNewMessage = (newMessage) => {
			if (!newMessage || typeof newMessage !== "object") return;

			// Safely add shouldShake flag
			const updatedMessage = { ...newMessage, shouldShake: true };

			// Play notification sound
			try {
				const sound = new Audio(notificationSound);
				sound.play();
			} catch (error) {
				console.error("Notification sound error:", error);
			}

			// Append new message
			setMessages((prevMessages) => [...prevMessages, updatedMessage]);
		};

		socket.on("newMessage", handleNewMessage);

		return () => {
			socket.off("newMessage", handleNewMessage);
		};
	}, [socket, setMessages]);
};

export default useListenMessages;
