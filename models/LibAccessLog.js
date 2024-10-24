import mongoose from 'mongoose'

const accessLogSchema = new mongoose.Schema({
    teNumber: {
        type: String,
        required: true
    },
    entryTime: {
        type: Date,
        default: Date.now
    }, 
    exitTime: {
        type: Date,
        default: null
    },
    phoneNumber: {
        type: String,
        required: true
    },
});


export default mongoose.model("LibAccessLog", accessLogSchema); 
