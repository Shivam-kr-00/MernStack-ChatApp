
import User from "../models/user.model.js"
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js";
/* Purpose: Get a list of all users except the logged-in user.

Where used: Frontend sidebar — to show who the user can chat with.

What it returns: Basic info like: */



export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


/* Purpose: Get the actual chat messages between the logged-in user and a selected user.

Where used: In the chat window when a user is clicked on the sidebar.

What it returns: All messages between the two */
export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ],
        });
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessageController: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}



/* Purpose:
➡️ type and Send a new message (text/image) from the current user to another user
Use Case:
✅ When you type a message and hit send, save it and (soon) send it via WebSocket

*/
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }

        // ✅ Return the saved message object (not just a message string)
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
