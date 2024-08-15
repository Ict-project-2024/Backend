import mongoose from 'mongoose'

const McStatusSchema = new mongoose.Schema({

    currentOccupancy: {
        type: Number,
        default: 0
    },
    date: {
        type: String,
        default: new Date().toISOString().slice(0, 10)
        
    },
    lastModified: {
        type: Date,
        default: new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" })
    }
});


export default mongoose.model("McStatus", McStatusSchema); 