import { reportCanteenStatus, getCanteenStatus } from "../utils/canteenUtils.js";
import { updateUserVotesAndBadges } from "../utils/badgeUtils.js";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";

export const reportStatus = async (req, res, next) => {
    const { userId, canteen, peopleRange } = req.body;
    try {
        await reportCanteenStatus(canteen, peopleRange, next);
        await updateUserVotesAndBadges(userId, canteen, next);
        return next(CreateSuccess(200, "Canteen status reported successfully"));
    } catch (error) {
        return next(CreateError(500, error.message));
        
    }
};

export const viewStatus = async (req, res, next) => {
    const { location } = req.body;

    try {
        const status = await getCanteenStatus(location, next);
        return next(CreateSuccess(200, "Canteen status retrieved successfully", status));
    } catch (error) {
        return next(CreateError(500, error.message));
    }
};
