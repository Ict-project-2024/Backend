import mongoose from 'mongoose'

const libraryStatusSchema = new mongoose.Schema({

    currentOccupancy: {
        type: Number,
        default: 0
    },
    date: {
        type: String,
        default: new Date().toISOString().slice(0, 10)
        
    },
});


export default mongoose.model("LibraryStatus", libraryStatusSchema); 
