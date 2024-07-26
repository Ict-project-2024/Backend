import mongoose from 'mongoose';

const CanteenStatusSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
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
    }
});

export default mongoose.model('CanteenStatus', CanteenStatusSchema);
