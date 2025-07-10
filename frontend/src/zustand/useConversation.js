// frontend/src/zustand/useConversation.js
import { create } from "zustand";

const useConversation = create((set) => ({
	selectedConversation: null,
	setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
	messages: [],
	setMessages: (updater) =>
		set((state) => {
			const newMessages =
				typeof updater === "function" ? updater(state.messages) : updater;

			// Safety fallback to ensure it's always an array
			return {
				messages: Array.isArray(newMessages) ? newMessages : [],
			};
		}),
}));

export default useConversation;
