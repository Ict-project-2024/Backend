import Student from "../models/User.js";
import LibAccessLog from "../models/LibAccessLog.js";
import McAccessLog from "../models/McAccessLog.js";
import { CreateError } from "../utils/error.js";
import LibraryStatus from "../models/LibStatus.js";
import McStatus from "../models/McStatus.js";


export const verifyStudent = async (teNumber, phoneNumber, next) => {
	let student = await Student.findOne({ TeNumber: teNumber.toLowerCase() });
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
