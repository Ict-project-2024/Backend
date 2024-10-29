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
        default: new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" }).slice(0, 10)
        
    },
    lastModified: {
        type: Date,
        default: new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" })
    }
});


export default mongoose.model("McStatus", McStatusSchema); 