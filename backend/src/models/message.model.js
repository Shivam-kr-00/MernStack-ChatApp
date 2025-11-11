// messageModel.js (add this to your existing Message schema)
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
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
    text: {
        type: String,
    },
    media: {
        type: {
            type: String,
            enum: ['image', 'video', 'audio', 'file', null],
            default: null
        },
        url: {
            type: String,
            required: function () { return this.media && this.media.type; }
        },
        filename: {
            type: String,
            required: function () { return this.media && this.media.type; }
        },
        size: {
            type: Number,
            required: function () { return this.media && this.media.type; }
        },
        mimetype: {
            type: String,
            required: function () { return this.media && this.media.type; }
        }
    }
}, { timestamps: true });

// Pre-save hook: Check if sender and receiver are friends before saving the message
messageSchema.pre('save', async function (next) {
    const sender = await mongoose.model('User').findById(this.senderId);
    if (!sender || !sender.friends.includes(this.receiverId)) {
        return next(new Error('You can only send messages to friends.'));
    }
    next();
});

const Message = mongoose.model("Message", messageSchema);

export default Message;