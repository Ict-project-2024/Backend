import UserVote from "../models/UserVote.js";

const assignBadges = (userVote) => {
	const now = new Date();
	const today = now.toISOString();
	const dayAgo = new Date(new Date(new Date().setDate(new Date().getDate() - 1)).toDateString())

	// First Step Badger
	if (userVote.votes === 1) {
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

	} else if (userVote.consecutiveDays === 30) {
		userVote.badges.accuracyStar = false;
		userVote.badges.weeklyWarrior = true;
		userVote.badges.dailyContributor = true;

	} else if (userVote.consecutiveDays === 7) {
		userVote.badges.accuracyStar = false;
		userVote.badges.weeklyWarrior = false;
		userVote.badges.dailyContributor = true;
	} else if (userVote.consecutiveDays < 7) {
		userVote.badges.dailyContributor = false;
		userVote.badges.weeklyWarrior = false
		userVote.badges.accuracyStar = false;
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
