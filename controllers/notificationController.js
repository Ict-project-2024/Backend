import Notification from '../models/Notification.js';
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";
import User from '../models/User.js';

export const createNotification = async (userId, message, type) => {
    const notification = new Notification({ userId, message, type });
    await notification.save();
};

export const getUserNotifications = async (req, res, next) => {
    const { userId } = req.body;
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

export const notifyAllUsers = async (message, type) => {
    try {
        // Get all users
        const users = await User.find({}, '_id');

        // Map through users and create a notification for each
        const notifications = users.map(user => ({
            userId: user._id,
            message,
            type,
            read: false,
            createdAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" })
        }));

        // Insert all notifications at once
        await Notification.insertMany(notifications);

        console.log("Notifications sent to all users");
    } catch (error) {
        console.error("Error sending notifications to all users:", error.message);
    }
};