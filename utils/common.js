import Student from "../models/User.js";
import LibAccessLog from "../models/LibAccessLog.js";
import McAccessLog from "../models/McAccessLog.js";
import { CreateError } from "../utils/error.js";
import LibraryStatus from "../models/LibStatus.js";
import McStatus from "../models/McStatus.js";
import Notification from '../models/Notification.js';


export const verifyStudent = async (teNumber, phoneNumber, next) => {
	let student = await Student.findOne({ teNumber: teNumber.toLowerCase() });
	if (!student) {
		return next(CreateError(400, "No user found.. redirect to register page"));
	}
	return student;
};

export const logEntry = async (teNumber, phoneNumber, location) => {
	let accessLog = undefined;
	if (location == "Library") {
		accessLog = new LibAccessLog({ teNumber, phoneNumber });
	} else {
		accessLog = new McAccessLog({ teNumber, phoneNumber });
	}
	await accessLog.save();
};

export const logExit = async (teNumber, location) => {
	let accessLog = undefined;
	if (location == "Library") {
		accessLog = await LibAccessLog.findOne({ teNumber: teNumber.toLowerCase(), exitTime: null });
	} else {
		accessLog = await McAccessLog.findOne({ teNumber: teNumber.toLowerCase(), exitTime: null });
	}

	if (!accessLog) {
		throw new Error('No entry log found for this student');
	}
	accessLog.exitTime = new Date();
	await accessLog.save();
};

export const getDailyTraffic = async (currentDate, location) => {
	if (location == "Library") {
		return await LibAccessLog.aggregate([
			{ $match: { entryTime: { $gte: new Date(currentDate) } } },
			{ $group: { _id: '$teNumber', count: { $sum: 1 } } },
		]);
	} else {
		return await McAccessLog.aggregate([
			{ $match: { entryTime: { $gte: new Date(currentDate) } } },
			{ $group: { _id: '$teNumber', count: { $sum: 1 } } },
		]);
	}
};

export const accessHistory = async (location) => {
	const currentDate = new Date();
	const pastTwentyEightDays = new Date(currentDate.setDate(currentDate.getDate() - 28));

	const matchStage = {
		$match: { date: { $gte: pastTwentyEightDays.toISOString().split('T')[0] } }
	};

	const sortStage = {
		$sort: { date: 1 }
	};

	const pipeline = [
		matchStage,
		sortStage
	];

	if (location == "Library") {
		return await LibraryStatus.aggregate(pipeline);
	} else {
		return await McStatus.aggregate(pipeline);
	}
};


export const userAccessHistory = async (location, dateOptions) => {
	const matchStage = {};

	// Apply filtering based on dateOptions
	if (dateOptions) {
		if (dateOptions.specificDate) {
			// Match specific date
			const specificDateStart = new Date(dateOptions.specificDate);
			const specificDateEnd = new Date(dateOptions.specificDate);
			specificDateEnd.setDate(specificDateEnd.getDate() + 1);

			matchStage.entryTime = { $gte: specificDateStart, $lt: specificDateEnd };
		} else if (dateOptions.startDate && dateOptions.endDate) {
			// Match date range
			const startDate = new Date(dateOptions.startDate);
			const endDate = new Date(dateOptions.endDate);
			endDate.setDate(endDate.getDate() + 1);

			matchStage.entryTime = { $gte: startDate, $lt: endDate };
		} else if (dateOptions.pastDays) {
			// Match past X days
			const currentDate = new Date();
			const pastDaysDate = new Date(currentDate.setDate(currentDate.getDate() - dateOptions.pastDays));

			matchStage.entryTime = { $gte: pastDaysDate };
		}
	}

	const sortStage = {
		$sort: { entryTime: 1 } // 1 for ascending order, -1 for descending order
	};

	// Create pipeline, only add $match stage if there are filtering conditions
	const pipeline = Object.keys(matchStage).length > 0 ? [{ $match: matchStage }, sortStage] : [sortStage];

	// Choose collection based on location
	if (location === "Library") {
		return await LibAccessLog.aggregate(pipeline);
	} else {
		return await McAccessLog.aggregate(pipeline);
	}
};

export const createNotification = async (userId, message, type) => {
    const notification = new Notification({ userId, message, type });
    await notification.save();
};
