// friendRequestModel.js (create a new file)
import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending"
        }
    },
    { timestamps: true }
);

// Ensure no duplicate pending requests between the same users
friendRequestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

export default FriendRequest;