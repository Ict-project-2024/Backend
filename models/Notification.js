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
            type: String, enum: ['batch', 'rank', 'badge'],
            required: true
        },
        read: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    });

export default mongoose.model("Notification", NotificationSchema);
