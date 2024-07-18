import mongoose, { Schema } from 'mongoose'

const UserSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            // validate: {
            //     validator: function (v) {
            //         const emailRegex = /[a-z]+[0-9]+@fot\.sjp\.ac\.lk/;
            //         return emailRegex.test(v);
            //     },
            //     message: props => `${props.value} is not a valid email format!`
            // }
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        verificationToken: String,
        verificationTokenExpires: Date,

        TeNumber: {
            type: String,
            required: true
        },
        gender: {
            type: String,
        },
        mobileNumber:{
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        profileImage: {
            type: String,
            required: true,
            default: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        roles: {
            type: [Schema.Types.ObjectId],
            required: true,
            ref: "Role"

        }


    },
    {
        timestamps: true
    }
);

export default mongoose.model("User", UserSchema);