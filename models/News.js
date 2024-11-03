import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
    title:
    {
        type: String,
        required: true
    },
    subtitle:
    {
        type: String

    },
    content:
    {
        type: String,
        required: true
    },
    image:
    {
        type: String
    },  // URL or base64 encoded
    link:
    {
        type: String
    },
    date:
    {
        type: Date,
        default: new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" })
    }
});

export default mongoose.model('News', NewsSchema);
