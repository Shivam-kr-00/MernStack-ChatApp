
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        fullName: {
            type: String,
            required: true,
            minlength: 3,
        },
        profilePic: {
            type: String,
            default: ""
        },
        phoneNumber: {
            type: String,
            default: ""
        },
        friends: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }]
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;