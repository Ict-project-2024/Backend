import McStatus from "../models/McStatus.js";
import { verifyStudent, logEntry, logExit, getDailyTraffic } from "../utils/common.js";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";

export const enterMc = async (req, res, next) => {
  const { teNumber, phoneNumber } = req.body;

  try {
    await verifyStudent(teNumber, phoneNumber, next);

    await logEntry(teNumber, phoneNumber);

    let status = await McStatus.findOne({ date: new Date().toISOString().slice(0, 10) });
    if (!status) {
      status = new McStatus();
    }
    status.currentOccupancy += 1;
    await status.save();

    return next(CreateSuccess(200, "Entry logged successfully"));
  } catch (error) {
    return next(CreateError(500, error.message));
  }
};

export const exitMc = async (req, res, next) => {
  const { teNumber } = req.body;

  try {
    await logExit(teNumber);

    let status = await McStatus.findOne({ date: new Date().toISOString().slice(0, 10) });
    if (!status) {
      return next(CreateError(404, "No medical center status found for today"));
    }
    status.currentOccupancy -= 1;
    await status.save();

    return next(CreateSuccess(200, "Exit logged successfully"));
  } catch (error) {
    return next(CreateError(500, error.message));
  }
};

export const viewTrafficStatus = async (req, res, next) => {
  const currentDate = new Date().toISOString().slice(0, 10);
  try {
    const status = await McStatus.findOne({ date: currentDate });

    if (!status) {
      return next(CreateError(404, "No traffic data available for today"));
    }

    const dailyTraffic = await getDailyTraffic(currentDate);

    return next(CreateSuccess(200, "Medical center traffic status", {
      currentOccupancy: status.currentOccupancy,
      dailyTraffic,
      lastModified: status.lastModified
    }));
  } catch (error) {
    return next(CreateError(500, error.message));
  }
};

