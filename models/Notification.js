// models/Notification.js
import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', required: true

        },
        message: String,
        type: {
            type: String, enum: ['batch', 'rank', 'badge', 'news'],
            required: true
        },
        read: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" })
        
        }
    });

export default mongoose.model("Notification", NotificationSchema);
