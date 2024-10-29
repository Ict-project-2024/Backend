import mongoose, { Schema } from 'mongoose'

const DoctorSchema = mongoose.Schema(
    {

        isAvailable: {
            type: String,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Doctor", DoctorSchema);