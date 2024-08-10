import CanteenStatus from "../models/CanteenStatus.js";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";

export const reportCanteenStatus = async (canteen, peopleRange, next) => {
    const currentDate = new Date();
    const localDate = currentDate.toLocaleDateString();
    let canteenStatus = await CanteenStatus.findOne({ date: localDate, canteen });

    if (!canteenStatus) {
        canteenStatus = new CanteenStatus({ date: localDate, canteen });
    }

    const validRanges = ["0-15", "15-25", "25-35", "35+"]; // Define valid ranges
    if (!validRanges.includes(peopleRange)) {
        return next(CreateError(400, "Invalid people range"));
    }

    canteenStatus.votes[peopleRange] += 1;
    await canteenStatus.save();
};

export const getCanteenStatus = async (canteen, next) => {
    const currentDate = new Date();
    const localDate = currentDate.toLocaleDateString();
    const status = await CanteenStatus.findOne({ date: localDate, canteen });

    if (!status) {
        return next(CreateError(404, "No canteen status available for today"));
    }
    const response = {
        votes: status.votes,
        lastModified: status.updatedAt
      };
    
    return response ;
};
