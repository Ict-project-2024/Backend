import Notification from '../models/Notification.js';
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";

export const getUserNotifications = async (req, res, next) => {
    const userId = req.body.userId;
    try {
        console.log(userId);
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
        return next(CreateSuccess(200, "Notifications retrieved successfully", notifications));
    } catch (error) {
        return next(CreateError(500, error.message)); 
    }
};
