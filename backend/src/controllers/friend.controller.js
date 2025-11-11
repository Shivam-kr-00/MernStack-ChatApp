// controllers/friend.controller.js
import User from "../models/user.model.js"; // Adjust path if needed (e.g., based on your project structure)
import FriendRequest from "../models/friendRequest.model.js"; // Adjust path
import mongoose from "mongoose";

/*
  Controller for searching users by email
*/
export const searchUsers = async (req, res) => {
    try {
        const searchValue = req.query.email; // 👈 get ?email= from frontend
        if (!searchValue) {
            return res.status(400).json({ message: "Search query missing" });
        }

        // Find users whose name or email partially matches the input
        const users = await User.find({
            $or: [
                { fullName: { $regex: searchValue, $options: "i" } },
                { email: { $regex: searchValue, $options: "i" } },
            ],
        }).select("-password"); // don’t send passwords

        res.status(200).json(users);
    } catch (error) {
        console.error("searchUsers error:", error);
        res.status(500).json({ message: "Server error while searching users" });
    }
};


/*
  Controller for sending a friend request
*/
export const sendFriendRequest = async (req, res) => {
    try {
        const { receiverId } = req.body;
        if (!receiverId) return res.status(400).json({ message: 'Receiver ID required' });

        // Validate receiverId format
        if (!mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ message: 'Invalid receiverId' });
        }

        // Prevent sending request to self
        if (receiverId.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: "You can't send a friend request to yourself" });
        }

        // Ensure receiver exists
        const receiver = await User.findById(receiverId);
        if (!receiver) return res.status(404).json({ message: 'Receiver user not found' });

        // Check if already friends
        const alreadyFriends = (req.user.friends || []).some(f => f.toString() === receiverId.toString());
        if (alreadyFriends) return res.status(400).json({ message: 'You are already friends with this user' });

        // Check if there's any pending request between these two users (either direction)
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { senderId: req.user._id, receiverId },
                { senderId: receiverId, receiverId: req.user._id }
            ],
            status: 'pending'
        });
        if (existingRequest) return res.status(400).json({ message: 'A pending friend request already exists between these users' });

        // Create request
        const request = new FriendRequest({ senderId: req.user._id, receiverId });
        try {
            await request.save();
        } catch (err) {
            // Handle duplicate index error (11000) gracefully
            if (err.code === 11000) {
                return res.status(400).json({ message: 'Friend request already exists' });
            }
            throw err;
        }

        // Populate sender info for response
        const populated = await FriendRequest.findById(request._id).populate('senderId', 'fullName email profilePic');

        res.status(201).json({ message: 'Friend request sent', request: populated });
    } catch (error) {
        console.error("sendFriendRequest error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

/*
  Controller for getting pending friend requests (for the logged-in user)
*/
export const getFriendRequests = async (req, res) => {
    try {
        const requests = await FriendRequest.find({
            receiverId: req.user._id,
            status: 'pending'
        }).populate('senderId', 'fullName email profilePic').sort({ createdAt: -1 }); // Get sender details

        res.json(requests);
    } catch (error) {
        console.error("getFriendRequests error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

/*
  Controller for accepting or rejecting a friend request
  Endpoint: PUT /api/friends/request/:id
  Body: { action: 'accept' | 'reject' }
*/
export const handleFriendRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body; // 'accept' or 'reject'

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid request id' });

        const request = await FriendRequest.findById(id);
        if (!request) return res.status(404).json({ message: 'Friend request not found' });

        // Only receiver can accept/reject
        if (request.receiverId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized - only the receiver can perform this action' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'This request is not pending' });
        }

        if (action === 'accept') {
            // Add each other to friends arrays (avoid duplicates)
            await User.findByIdAndUpdate(request.senderId, { $addToSet: { friends: request.receiverId } });
            await User.findByIdAndUpdate(request.receiverId, { $addToSet: { friends: request.senderId } });

            // Option 1: update status and keep the request in DB (audit trail)
            // request.status = 'accepted';
            // await request.save();

            // Option 2: delete the request since it's handled (clean DB). We'll delete and return info.
            await FriendRequest.findByIdAndDelete(id);

            // Return the updated friends list for the receiver (so frontend can refresh UI)
            const updatedReceiver = await User.findById(request.receiverId).populate('friends', 'fullName email profilePic');
            return res.json({ message: 'Request accepted', friends: updatedReceiver.friends });
        } else if (action === 'reject') {
            // Mark as rejected OR delete. We'll delete to keep pending-only table.
            await FriendRequest.findByIdAndDelete(id);
            return res.json({ message: 'Request rejected' });
        } else {
            return res.status(400).json({ message: 'Invalid action. Use "accept" or "reject"' });
        }
    } catch (error) {
        console.error("handleFriendRequest error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

/*
  Controller for getting the user's friends list
*/
export const getFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('friends', 'fullName email profilePic');
        res.json(user.friends || []);
    } catch (error) {
        console.error("getFriends error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
