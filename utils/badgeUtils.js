import UserVote from "../models/UserVote.js";

import { CreateError } from "../utils/error.js";
import { createNotification } from '../controllers/notificationController.js';


const assignBadges = async (userVote) => {
	const now = new Date();
	const today = now.toISOString();
	const dayAgo = new Date(new Date(new Date().setDate(new Date().getDate() - 1)).toDateString())


	// First Step Badge
	if (userVote.votes === 1 ) {

		userVote.badges.firstStep = true;
		await createNotification(userVote.userId, "Congratulations! You've earned the First Step badge!", "badge");
	}

	// Frequent Contributor Badge
	if (userVote.votes === 10 && userVote.badges.frequentContributor !== "Bronze") {
		userVote.badges.frequentContributor = "Bronze";
		await createNotification(userVote.userId, "You've earned the Bronze Frequent Contributor badge!", "badge");

	}
	else if (userVote.votes === 50 && userVote.badges.frequentContributor !== "Silver") {
		userVote.badges.frequentContributor = "Silver";
		await createNotification(userVote.userId, "You've earned the Silver Frequent Contributor badge!", "badge");
	}
	else if (userVote.votes === 100 && userVote.badges.frequentContributor !== "Gold") {
		userVote.badges.frequentContributor = "Gold";
		await createNotification(userVote.userId, "You've earned the Gold Frequent Contributor badge!", "badge");
	}

	let votedDateAgo = new Date(new Date(new Date(last).setDate(new Date(last).getDate() - 1)).toDateString())
	// Daily Contributor Badge
	if (votedDateAgo < dayAgo) {
		userVote.consecutiveDays -= 1;
	} else if (userVote.lastVoteDate && new Date(userVote.lastVoteDate).toISOString() !== today) {
		userVote.consecutiveDays += 1;
	}

	// Accuracy Star Badge
	if (userVote.consecutiveDays >= 90) {
		userVote.badges.accuracyStar = true;
		userVote.badges.weeklyWarrior = true;
		userVote.badges.dailyContributor = true;
    await createNotification(userVote.userId, "You've achieved the Accuracy Star badge!", "badge");

	} else if (userVote.consecutiveDays === 30) {
		userVote.badges.accuracyStar = false;
		userVote.badges.weeklyWarrior = true;
		userVote.badges.dailyContributor = true;
    await createNotification(userVote.userId, "You've achieved the Weekly Warrior badge!", "badge");

	} else if (userVote.consecutiveDays === 7) {
		userVote.badges.accuracyStar = false;
		userVote.badges.weeklyWarrior = false;
		userVote.badges.dailyContributor = true;
    await createNotification(userVote.userId, "You've achieved the Daily Contributor badge!", "badge");
	} else if (userVote.consecutiveDays < 7) {
		userVote.badges.dailyContributor = false;
		userVote.badges.weeklyWarrior = false
		userVote.badges.accuracyStar = false;
    await createNotification(userVote.userId, "Create a vote and earn your First badge!", "badge");

	}

	userVote.lastVoteDate = now;
};


export const updateUserVotesAndBadges = async (userId, next) => {
	let userVote = await UserVote.findOne({ userId: userId });

	if (!userVote) {
		userVote = new UserVote({ userId });
	}

	userVote.votes += 1;

	// Assign badges based on updated votes
	assignBadges(userVote);

	await userVote.save();
};
