import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { detectEmotion } from "../lib/aiService.js";
import multer from "multer";
import path from "path";
import stream from "stream";

// Configure Multer for temporary storage before Cloudinary upload
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'image/',
            'video/',
            'audio/',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/zip',
            'text/plain'
        ];

        if (allowedTypes.some(type => file.mimetype.startsWith(type))) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images, videos, audio, and common files are allowed.'));
        }
    }
});

/* Updated: Get a list of friends for the sidebar (instead of all users).
Where used: Frontend sidebar — to show who the user can chat with.
What it returns: Basic info of friends. */
export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        // Updated: Fetch and populate friends only
        const user = await User.findById(loggedInUserId).populate('friends', '-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user.friends);
    } catch (error) {
        console.log("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/* Updated: Get messages, but only if users are friends.
Where used: In the chat window when a friend is clicked.
What it returns: All messages between the two friends. */
export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        // Updated: Check if they are friends before fetching messages
        const user = await User.findById(myId);
        if (!user || !user.friends.includes(userToChatId)) {
            return res.status(403).json({ message: "You can only view messages with friends." });
        }

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
};

/* Updated: Send a message, with better error handling for friendship issues.
Use Case: When sending a message, the pre-save hook ensures only friends can send. */
export const sendMessage = [
    upload.single('media'),
    async (req, res) => {
        try {
            const { text } = req.body;
            const { id: receiverId } = req.params;
            const senderId = req.user._id;

            let media = null;
            if (req.file) {
                const readableStream = new stream.Readable();
                readableStream.push(req.file.buffer);
                readableStream.push(null);

                let resourceType = 'auto';
                if (req.file.mimetype === 'application/pdf' ||
                    req.file.mimetype === 'application/msword' ||
                    req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                    req.file.mimetype === 'application/zip' ||
                    req.file.mimetype === 'text/plain') {
                    resourceType = 'raw';
                }

                const uploadResponse = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            resource_type: resourceType,
                            public_id: `${Date.now()}_${path.parse(req.file.originalname).name}`,
                            timeout: 120000,
                        },
                        (error, result) => {
                            if (error) {
                                console.error("Cloudinary upload error:", error);
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    );

                    readableStream.pipe(uploadStream);
                    readableStream.on('error', (err) => {
                        console.error("Stream error:", err);
                        reject(err);
                    });
                });

                let type = 'file';
                if (req.file.mimetype.startsWith('image/')) type = 'image';
                else if (req.file.mimetype.startsWith('video/')) type = 'video';
                else if (req.file.mimetype.startsWith('audio/')) type = 'audio';

                media = {
                    type,
                    url: uploadResponse.secure_url,
                    filename: req.file.originalname,
                    size: req.file.size,
                    mimetype: req.file.mimetype
                };
            }

            const newMessage = new Message({
                senderId,
                receiverId,
                text,
                media
            });

            await newMessage.save();

            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('newMessage', newMessage);
            }

            res.status(201).json(newMessage);
        } catch (error) {
            console.log("Error in sendMessage controller:", error.message);
            // Updated: Check for friendship-related errors from the pre-save hook
            if (error.message.includes('friends')) {
                return res.status(403).json({ message: "You can only send messages to friends." });
            }
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
];

export const detectEmotionController = (req, res) => {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message text is required" });
    }

    const emotion = detectEmotion(message);
    res.json({ emotion });
};