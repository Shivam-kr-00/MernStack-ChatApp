// routes/friend.route.js
import express from 'express';
import {
    searchUsers,
    sendFriendRequest,
    getFriendRequests,
    handleFriendRequest,
    getFriends
} from '../controllers/friend.controller.js'; // Adjust path to your controllers folder
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET /api/friends/search?email=example
router.get('/search', protectRoute, searchUsers);

// POST /api/friends/request
router.post('/request', protectRoute, sendFriendRequest);

// GET /api/friends/requests
router.get('/requests', protectRoute, getFriendRequests);

// PUT /api/friends/request/:id
router.put('/request/:id', protectRoute, handleFriendRequest);

// GET /api/friends
router.get('/', protectRoute, getFriends);

export default router;
