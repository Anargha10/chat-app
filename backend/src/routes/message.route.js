import express from 'express'; // Import express for routing
import Message from '../models/message.model.js'; // Import Message model
import { protectRoute } from '../middleware/auth.middleware.js'; // Import protectRoute middleware
import { getMessages, getUsersForSidebar, sendMessage } from '../controllers/message.controller.js';

const router = express.Router(); // Create a new router
router.get("/users", protectRoute,getUsersForSidebar)
router.get("/:id", protectRoute, getMessages)

router.post("/send/:id",protectRoute, sendMessage)


export default router; // Export the router
