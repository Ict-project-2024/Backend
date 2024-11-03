import mongoose from "mongoose";
import UserVote from "../models/UserVote.js";
import { CreateError } from "../utils/error.js";
import { createNotification } from '../controllers/notificationController.js';

const assignBadges = async (userVote) => {
	const now = new Date();
	const today = now.toISOString().slice(0, 10);

	// First Step Badge
	if (userVote.votes === 1 && !userVote.badges.firstStep) {
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

	// Daily Contributor Badge
	if (userVote.lastVoteDate && new Date(userVote.lastVoteDate).toISOString().slice(0, 10) === today) {
		userVote.consecutiveDays += 1;
	} else {
		userVote.consecutiveDays = 1;
	}

	if (userVote.consecutiveDays === 7 && !userVote.badges.dailyContributor) {
		userVote.badges.dailyContributor = true;
		await createNotification(userVote.userId, "You've achieved the Daily Contributor badge!", "badge");
	}

	// Weekly Warrior Badge
	if (userVote.consecutiveDays === 30 && !userVote.badges.weeklyWarrior) {
		userVote.badges.weeklyWarrior = true;
		await createNotification(userVote.userId, "You've achieved the Weekly Warrior badge!", "badge");
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
