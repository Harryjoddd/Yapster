import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";

const Messages = () => {
	const { messages, loading } = useGetMessages();
	useListenMessages();
	const lastMessageRef = useRef();

	useEffect(() => {
		setTimeout(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 100);
	}, [messages]);

	const isArray = Array.isArray(messages);

	return (
		<div className='px-4 flex-1 overflow-auto'>
			{/* ✅ If messages is an array, render normally */}
			{!loading && isArray &&
				messages.map((message, idx) => (
					<div key={message._id || idx} ref={lastMessageRef}>
						<Message message={message} />
					</div>
				))}

			{/* ✅ If still loading, show skeletons */}
			{loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}

			{/* ✅ If messages is an empty array */}
			{!loading && isArray && messages.length === 0 && (
				<p className='text-center'>Send a message to start the conversation</p>
			)}

			{/* ❌ If messages is not an array, prevent crash */}
			{!loading && !isArray && (
				<p className='text-center text-red-500'>Error: Messages data is invalid</p>
			)}
		</div>
	);
};

export default Messages;
