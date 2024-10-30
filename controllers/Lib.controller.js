import LibraryStatus from "../models/LibStatus.js";
import { verifyStudent, logEntry, logExit, getDailyTraffic, accessHistory, userAccessHistory } from "../utils/common.js";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";

export const enterLibrary = async (req, res, next) => {
  const { teNumber, phoneNumber } = req.body;

  try {
    await logEntry(teNumber.toLowerCase(), phoneNumber, "Library");

    let status = await LibraryStatus.findOne({ date: new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" }).slice(0, 10) });
    if (!status) {
      status = new LibraryStatus();
    }
    status.currentOccupancy += 1;
    status.entrances += 1; // Increment the number of entrances; for admin view: nivindulakshitha
    status.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" }).slice(0, 10);
    status.lastModified = new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" });
    await status.save();

    return next(CreateSuccess(200, "Entry logged successfully"));
  } catch (error) {
    return next(CreateError(500, error.message));
  }
};

export const exitLibrary = async (req, res, next) => {
  const { teNumber } = req.body;

  try {
    await logExit(teNumber.toLowerCase(), "Library");

    let status = await LibraryStatus.findOne({ date: new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" }).slice(0, 10) });
    if (!status) {
      return next(CreateError(204, "No library status found for today"));
    }
    status.currentOccupancy -= 1;
    status.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" }).slice(0, 10);
    status.lastModified = new Date();
    await status.save();

    return next(CreateSuccess(200, "Exit logged successfully"));
  } catch (error) {
    return next(CreateError(500, error.message));
  }
};

export const viewTrafficStatus = async (req, res, next) => {
  const currentDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" }).slice(0, 10);
  try {
    const status = await LibraryStatus.findOne({ date: currentDate });

    if (!status) {
      return next(CreateError(204, "No traffic data available for today"));
    }

    const dailyTraffic = await getDailyTraffic(currentDate, "Library");

    return next(CreateSuccess(200, "Library traffic status", {
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
    const history = await accessHistory("Library");
    return next(CreateSuccess(200, "Library access history", history));
  } catch (error) {
    return next(CreateError(500, error.message));
  }
};


export const viewUserAccess = async (req, res, next) => {
  const dateOptions = req.body;

  try {
    const history = await userAccessHistory("Library", dateOptions);
    return next(CreateSuccess(200, "Library access history", history));
  } catch (error) {
    return next(CreateError(500, error.message));
  }
};

