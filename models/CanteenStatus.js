import mongoose from 'mongoose';

const CanteenStatusSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
        default: new Date().toISOString().slice(0, 10)
    },
    canteen: {
        type: String,
        required: true
    }, // "staff" or "student"
    votes: {
        '0-15': { type: Number, default: 0 },
        '15-25': { type: Number, default: 0 },
        '25-35': { type: Number, default: 0 },
        '35+': { type: Number, default: 0 }
    },
    lastModified: {
        type: Date,
        default: new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" })
    }
}, {
    timestamps: true
}
);

export default mongoose.model('CanteenStatus', CanteenStatusSchema);
