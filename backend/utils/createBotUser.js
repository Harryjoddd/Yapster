import User from "../models/user.model.js";

const createBotUser = async () => {
	const existingBot = await User.findOne({ username: "yapster-bot" });
	if (existingBot) return;

	await User.create({
		fullName: "Yapster Bot",
		username: "yapster-bot",
		password: "yapsterpassword", // not used manually
		gender: "male",
		profilePic: "https://avatar.iran.liara.run/public/boy?username=yapster-bot",
	});
};

export default createBotUser;
