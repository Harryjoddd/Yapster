import { create } from "zustand";

const useConversation = create((set) => ({
	selectedConversation: null,
	setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
	messages: [],
	setMessages: (updater) =>
		set((state) => {
			const newMessages =
				typeof updater === "function" ? updater(state.messages) : updater;

			// Safety fallback
			return {
				messages: Array.isArray(newMessages) ? newMessages : [],
			};
		}),
}));

export default useConversation;
