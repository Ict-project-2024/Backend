import mongoose from "mongoose";
import UserVote from "../models/UserVote.js";
import { CreateError } from "../utils/error.js";

const assignBadges = (userVote) => {
	const now = new Date();
	const today = now.toISOString().slice(0, 10);

	// First Step Badger
	if (userVote.votes === 1 && !userVote.badges.firstStep) {
		userVote.badges.firstStep = true;
	}

	// Frequent Contributor Badge
	if (userVote.votes === 10) {
		userVote.badges.frequentContributor = "Bronze";
	} else if (userVote.votes === 50) {
		userVote.badges.frequentContributor = "Silver";
	} else if (userVote.votes === 100) {
		userVote.badges.frequentContributor = "Gold";
	}

	// Daily Contributor Badge
	if (userVote.lastVoteDate && new Date(userVote.lastVoteDate).toISOString().slice(0, 10) === today) {
		userVote.consecutiveDays += 1;
	} else {
		userVote.consecutiveDays = 1;
	}

	if (userVote.consecutiveDays === 7) {
		userVote.badges.dailyContributor = true;
	}

	// Weekly Warrior Badge
	if (userVote.consecutiveDays === 30) {
		userVote.badges.weeklyWarrior = true;
	}

	// Update last vote date
	userVote.lastVoteDate = now;
};

export const updateUserVotesAndBadges = async (userId, next) => {
	let userVote = await UserVote.findOne({ userId: userId});

	if (!userVote) {
		userVote = new UserVote({ userId });
	}

	userVote.votes += 1;

	// Assign badges based on updated votes
	assignBadges(userVote);

	await userVote.save();
};
