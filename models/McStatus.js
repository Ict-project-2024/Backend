import mongoose from 'mongoose'

const McStatusSchema = new mongoose.Schema({
    entrances: {
        type: Number,
        default: 0
    },
    currentOccupancy: {
        type: Number,
        default: 0
    },
    date: {
        type: String,
        default: new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" }).split(",")[0]

    },
    isAvailable: {
        type: Boolean,
        default: false
    },
    lastModified: {
        type: Date,
        default: new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" })
    }
},

    {
        timestamps: true
    });


export default mongoose.model("McStatus", McStatusSchema); 