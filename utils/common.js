import Student from "../models/User.js";
import AccessLog from "../models/LibAccesLog.js";
import { CreateError } from "../utils/error.js";


export const verifyStudent = async (teNumber, phoneNumber, next) => {
  let student = await Student.findOne({ TeNumber: teNumber });
  if (!student) {
    return next(CreateError(400, "No user found.. redirect to register page"));
  }
  return student;
};

export const logEntry = async (teNumber, phoneNumber) => {
  const accessLog = new AccessLog({ teNumber, phoneNumber });
  await accessLog.save();
};

export const logExit = async (teNumber) => {
  const accessLog = await AccessLog.findOne({ teNumber: teNumber, exitTime: null });
  if (!accessLog) {
    throw new Error('No entry log found for this student');
  }
  accessLog.exitTime = new Date();
  await accessLog.save();
};

export const getDailyTraffic = async (currentDate) => {
  return await AccessLog.aggregate([
    { $match: { entryTime: { $gte: new Date(currentDate) } } },
    { $group: { _id: '$teNumber', count: { $sum: 1 } } },
  ]);
};
