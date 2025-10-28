import express from "express";
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
router.post("/send/:id", protectRoute, sendMessage);
router.get("/:id", protectRoute, getMessages);     // ✅ more specific

export default router;
