import CanteenStatus from "../models/CanteenStatus.js";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";

export const reportCanteenStatus = async (canteen, peopleRange, next) => {
    const currentDate = new Date().toISOString().slice(0, 10);
    let canteenStatus = await CanteenStatus.findOne({ date: currentDate, canteen });

    if (!canteenStatus) {
        canteenStatus = new CanteenStatus({ date: currentDate, canteen });
    }

    const validRanges = ["0-15", "15-25", "25-35", "35+"]; // Define valid ranges
    if (!validRanges.includes(peopleRange)) {
        return next(CreateError(400, "Invalid people range"));
    }

    canteenStatus.votes[peopleRange] += 1;
    canteenStatus.lastModified = new Date();

    await canteenStatus.save();
};

export const getCanteenStatus = async (location, next) => {
    const currentDate = new Date().toISOString().slice(0, 10);
    const status = await CanteenStatus.findOne({ date: currentDate, canteen: location });

    if (!status) {
        return next(CreateError(404, "No canteen status available for today"));
    }

    return status;
};
