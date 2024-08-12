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
    
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 5);
    currentTime.setMinutes(currentTime.getMinutes() + 30);
    canteenStatus.lastModified = currentTime.toLocaleString("en-US", { timeZone: "Asia/Colombo" });

    await canteenStatus.save();
};

function getCurrentTimeInTimeZone(timeZone) {
    return new Intl.DateTimeFormat('en-US', {
        timeZone: timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).format(new Date());
}

export const getCanteenStatus = async (canteen, next) => {
    const currentDate = new Date().toISOString().slice(0, 10);
    const status = await CanteenStatus.findOne({ date: currentDate, canteen: canteen });

    if (!status) {
        return next(CreateError(404, "No canteen status available for today"));
    }

    return status;
};
