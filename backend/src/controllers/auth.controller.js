import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password)
            return res.status(400).json({ message: "Please fill in all fields" });

        if (password.length < 6) {
            return res.status(400).json({ msg: "Password must be at least 6 characters" });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "Email already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            // Updated: Populate friends in response for frontend convenience (optional but recommended)
            const populatedUser = await User.findById(newUser._id).populate('friends', 'fullName email profilePic');
            return res.status(201).json({
                user: {
                    _id: populatedUser._id,
                    fullName: populatedUser.fullName,
                    email: populatedUser.email,
                    profilePic: populatedUser.profilePic,
                    friends: populatedUser.friends // New: Include friends list
                }
            });
        }
    } catch (error) {
        console.log("Error in signup controller", error);
        if (error.name === 'ValidationError') {
            const validationErrors = Object.keys(error.errors).map(key => ({
                field: key,
                message: error.errors[key].message
            }));
            return res.status(400).json({
                msg: validationErrors[0].message,
                errors: validationErrors
            });
        }
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        generateToken(user._id, res);
        // Updated: Populate friends in response for frontend convenience
        const populatedUser = await User.findById(user._id).populate('friends', 'fullName email profilePic');
        return res.status(200).json({
            user: {
                _id: populatedUser._id,
                fullName: populatedUser.fullName,
                email: populatedUser.email,
                profilePic: populatedUser.profilePic,
                friends: populatedUser.friends // New: Include friends list
            }
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        return res.status(200).json({ msg: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        console.log("Update profile request received", req.user);
        const { profilePic, fullName, email, phoneNumber } = req.body;

        if (!req.user || !req.user._id) {
            console.log("User not found in request object", req.user);
            return res.status(404).json({ message: "User not found" });
        }

        const userId = req.user._id;
        const updateData = {};

        if (profilePic) {
            try {
                console.log("Uploading image to cloudinary");
                const uploadResponse = await cloudinary.uploader.upload(profilePic);
                console.log("Image uploaded successfully", uploadResponse.secure_url);
                updateData.profilePic = uploadResponse.secure_url;
            } catch (cloudinaryError) {
                console.log("Cloudinary upload error:", cloudinaryError);
                return res.status(400).json({ message: "Failed to upload profile picture" });
            }
        }

        if (fullName) updateData.fullName = fullName;
        if (email) updateData.email = email;
        if (phoneNumber) updateData.phoneNumber = phoneNumber;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            console.log("User not found in database when updating", userId);
            return res.status(404).json({ message: "User not found in database" });
        }

        console.log("User profile updated successfully");
        // Updated: Populate friends in response
        const populatedUser = await User.findById(updatedUser._id).populate('friends', 'fullName email profilePic');
        return res.status(200).json({
            user: populatedUser
        });
    } catch (error) {
        console.log("Error in update profile:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const checkAuth = (req, res) => {
    try {
        // Updated: Populate friends in response
        res.status(200).json({
            user: req.user // Assuming req.user is already populated via middleware; if not, populate here
        });
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        return res.status(500).json({ msg: "Internal server error" });
    }
};