import McStatus from "../models/McStatus.js";
import { verifyStudent, logEntry, logExit, getDailyTraffic, accessHistory, userAccessHistory } from "../utils/common.js";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";

export const enterMc = async (req, res, next) => {
  const { teNumber, phoneNumber } = req.body;

  try {
    await verifyStudent(teNumber.toLowerCase(), phoneNumber, next);

    await logEntry(teNumber.toLowerCase(), phoneNumber);

    let status = await McStatus.findOne({ date: new Date().toISOString().slice(0, 10) });
    if (!status) {
      status = new McStatus();
    }
    status.currentOccupancy += 1;
    status.entrances += 1; // Increment the number of entrances; for admin view: nivindulakshitha
    status.lastModified = new Date();
    await status.save();

    return next(CreateSuccess(200, "Entry logged successfully"));
  } catch (error) {
    return next(CreateError(500, error.message));
  }
};

export const exitMc = async (req, res, next) => {
  const { teNumber } = req.body;

  try {
    await logExit(teNumber.toLowerCase());

    let status = await McStatus.findOne({ date: new Date().toISOString().slice(0, 10) });
    if (!status) {
      return next(CreateError(404, "No medical center status found for today"));
    }
    status.currentOccupancy -= 1;
    status.lastModified = new Date();
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

    const dailyTraffic = await getDailyTraffic(currentDate, "Medical Center");

    return next(CreateSuccess(200, "Medical center traffic status", {
      currentOccupancy: status.currentOccupancy,
      dailyTraffic,
      lastModified: status.lastModified
    }));
  } catch (error) {
    return next(CreateError(500, error.message));
  }
};


export const viewHistory = async (req, res, next) => {
    try {
        const history = await accessHistory("Medical Center");
        return next(CreateSuccess(200, "Library access history", history));
    } catch (error) {
        return next(CreateError(500, error.message));
    }
};

export const viewUserAccess = async (req, res, next) => {
  const dateOptions = req.body;

  try {
    const history = await userAccessHistory("Medical Center", dateOptions);
    return next(CreateSuccess(200, "Medical center access history", history));
  } catch (error) {
    return next(CreateError(500, error.message));
  }
};
