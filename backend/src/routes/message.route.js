import express from "express";
import multer from "multer";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
    getMessages,
    getUsersForSidebar,
    sendMessage,
    detectEmotionController
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.post("/detect", protectRoute, detectEmotionController);

// Optional: Add a comment or error handler for clarity
router.post("/send/:id", protectRoute, sendMessage, (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        return res.status(400).json({ message: "File upload error: " + error.message });
    } else if (error) {
        return res.status(400).json({ message: error.message });
    }
    next();
});

router.get("/:id", protectRoute, getMessages); // ✅ More specific

export default router;
