import LibraryStatus from "../models/LibStatus.js";
import { verifyStudent, logEntry, logExit, getDailyTraffic } from "../utils/common.js";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";

export const enterLibrary = async (req, res, next) => {
  const { teNumber, phoneNumber} = req.body;

  try {
    await verifyStudent(teNumber.toLowerCase(), phoneNumber, next);

    await logEntry(teNumber.toLowerCase(), phoneNumber, "Library");

    let status = await LibraryStatus.findOne({ date: new Date().toISOString().slice(0, 10) });
    if (!status) {
      status = new LibraryStatus();
    }
    status.currentOccupancy += 1;
    status.lastModified = new Date();
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

    let status = await LibraryStatus.findOne({ date: new Date().toISOString().slice(0, 10) });
    if (!status) {
      return next(CreateError(404, "No library status found for today"));
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
    const status = await LibraryStatus.findOne({ date: currentDate });

    if (!status) {
      return next(CreateError(404, "No traffic data available for today"));
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

