// controllers/canteenController.js
import { reportCanteenStatus, getCanteenStatus } from "../utils/canteenUtils.js";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";

export const reportStatus = async (req, res, next) => {
    const { canteen, peopleRange } = req.body;

    try {
        await reportCanteenStatus(canteen, peopleRange, next);
        return next(CreateSuccess(200, "Canteen status reported successfully"));
    } catch (error) {
        return next(CreateError(500, error.message));
    }
};

export const viewStatus = async (req, res, next) => {
    const { canteen } = req.query;

    try {
        const status = await getCanteenStatus(canteen, next);
        return next(CreateSuccess(200, "Canteen status retrieved successfully", status));
    } catch (error) {
        return next(CreateError(500, error.message));
    }
};
