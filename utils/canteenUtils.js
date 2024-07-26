import CanteenStatus from "../models/CanteenStatus.js";

export const reportCanteenStatus = async (canteen, peopleRange, next) => {
    const currentDate = new Date().toISOString().slice(0, 10);
    let canteenStatus = await CanteenStatus.findOne({ date: currentDate, canteen });

    if (!canteenStatus) {
        canteenStatus = new CanteenStatus({ date: currentDate, canteen });
    }

    if (!canteenStatus.votes[peopleRange]) {
        return next(CreateError(400, "Invalid people range"));
    }

    canteenStatus.votes[peopleRange] += 1;
    await canteenStatus.save();
};

export const getCanteenStatus = async (canteen, next) => {
    const currentDate = new Date().toISOString().slice(0, 10);
    const status = await CanteenStatus.findOne({ date: currentDate, canteen });

    if (!status) {
        return next(CreateError(404, "No canteen status available for today"));
    }

    return status.votes;
};
