import McStatus from "../models/McStatus.js";
import { verifyStudent, logEntry, logExit, getDailyTraffic, accessHistory, userAccessHistory } from "../utils/common.js";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";


export const enterMc = async (req, res, next) => {
  const { teNumber, phoneNumber } = req.body;

  try {
    await verifyStudent(teNumber.toLowerCase(), phoneNumber, next);

    await logEntry(teNumber.toLowerCase(), phoneNumber);


    const currentTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" });

    let status = await McStatus.findOne({ date: currentTime.split(",")[0] });

    if (!status) {
      status = new McStatus();
    }
    status.currentOccupancy += 1;
    status.entrances += 1; // Increment the number of entrances; for admin view: nivindulakshitha

    status.lastModified = currentTime;

    status.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" }).split(",")[0];
 
    await status.save();

    return next(CreateSuccess(200, "Entry logged successfully"));
  } catch (error) {
    return next(CreateError(500, error.message));
  }
};

export const exitMc = async (req, res, next) => {
  const { teNumber } = req.body;

  const currentTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" });

  try {

    await logExit(teNumber.toLowerCase());


    let status = await McStatus.findOne({ date: currentTime.split(",")[0] });

    if (!status) {
      return next(CreateError(204, "No medical center status found for today"));
    }

    if (status.currentOccupancy > 0) {
      status.currentOccupancy -= 1;
    } else {
      status.currentOccupancy = 0;
    }
    status.lastModified = currentTime;
    status.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" }).split(",")[0]
    

    await status.save();

    return next(CreateSuccess(200, "Exit logged successfully"));
  } catch (error) {
    return next(CreateError(500, error.message));
  }
};

export const viewTrafficStatus = async (req, res, next) => {
  const currentDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" }).split(",")[0];

  try {
    const status = await McStatus.findOne({ date: currentDate });

    if (!status) {
      return next(CreateError(204, "No traffic data available for today"));
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
    return next(CreateSuccess(200, "Medical Center access history", history));
  } catch (error) {
    return next(CreateError(500, error.message));
  }
};

export const viewUserAccess = async (req, res, next) => {
  const dateOptions = req.body;
  const { teNumber } = req.body;

  try {
    const history = await userAccessHistory("Medical Center", dateOptions, teNumber);
    return next(CreateSuccess(200, "Medical center access history", history));
  } catch (error) {
    return next(CreateError(500, error.message));
  }
};

export const updateDoctorAvailability = async (req, res, next) => {
  try {
    let { isAvailable } = req.body;

    // Convert `isAvailable` to a boolean if it’s a string
    if (typeof isAvailable === "string") {
      isAvailable = isAvailable.toLowerCase() === 'true';
    }

    const currentDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" }).split(",")[0];

    // Find and update the document that matches the current date
    const status = await McStatus.findOneAndUpdate(
      { date: currentDate },   // Match the document with today’s date
      { isAvailable }, // Update `isAvailable` 
      { new: true, upsert: true } // Return updated document, create if it doesn’t exist
    );

    if (!status) {
      return next(CreateError(204, "No status available for today."));
    }

    return next(CreateSuccess(200, 'Doctor availability updated successfully', { isAvailable: status.isAvailable }));
  } catch (error) {
    next(CreateError(500, error.message));
  }
};



export const getDoctorAvailability = async (req, res, next) => {

  const currentDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" }).split(",")[0];

  try {
    const doctor = await McStatus.findOne({ date: currentDate });


    if (!doctor) {
      return res.status(204).json({ message: "Doctor availability status not found" });
    }
    
    return next(CreateSuccess(200, "Doctor availability status", {
      isAvailable: doctor.isAvailable
    }));

  } catch (error) {
    next(CreateError(500, error.message));
  }
};