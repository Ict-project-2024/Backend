import Notification from '../models/Notification.js';
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";

export const getUserNotifications = async (req, res, next) => {
    const userId = req.body.userId;
    try {
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
        return next(CreateSuccess(200, "Notifications retrieved successfully", notifications));
    } catch (error) {
        return next(CreateError(500, error.message)); 
    }
};

export const markNotificationAsRead = async (req, res, next) => {
    const { notificationId } = req.params;

    try {
        const notification = await Notification.findById(notificationId);

        if (!notification) {
            return next(CreateError(404, "Notification not found"));
        }

        notification.read = true;
        await notification.save();

        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        next(CreateError(500, error.message));
    }
};

