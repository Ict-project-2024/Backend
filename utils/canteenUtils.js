import CanteenStatus from "../models/CanteenStatus.js";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";

export const reportCanteenStatus = async (canteen, peopleRange, next) => {
    const localDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" }).slice(0, 10);
    let canteenStatus = await CanteenStatus.findOne({ date: localDate, canteen });

    // If no status for today exists, create a new one
    if (!canteenStatus) {
        canteenStatus = new CanteenStatus({ date: localDate, canteen });
    }

    const validRanges = ["0-15", "15-25", "25-35", "35+"];
    if (!validRanges.includes(peopleRange)) {
        return next(CreateError(400, "Invalid people range"));
    }

    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago

    // Check if lastModified is more than 30 minutes ago
    if (canteenStatus.lastModified < thirtyMinutesAgo) {
        // Clear all votes since last update was over 30 minutes ago
        canteenStatus.votes = { "0-15": 0, "15-25": 0, "25-35": 0, "35+": 0 };
    }

    // Add the new vote
    canteenStatus.votes[peopleRange] += 1;
    canteenStatus.lastModified = new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" });

    await canteenStatus.save();
    return next(CreateSuccess(200, "Canteen status reported successfully"));
};


export const getCanteenStatus = async (location, next) => {
    const currentDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" }).slice(0, 10);
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago

    try {
        // Find today's document for the specified canteen
        const status = await CanteenStatus.findOne({
            date: currentDate,
            canteen: location
        });

        if (!status) {
            return next(CreateError(204));
        }

        // Check if the last update was more than 30 minutes ago
        if (status.lastModified >= thirtyMinutesAgo) {
            return status; // Return the canteen status if it was last updated more than 30 minutes ago
        } else {
            
            return next(CreateError(204));
        }
    } catch (error) {
        return next(CreateError(500, error.message));
    }
};
