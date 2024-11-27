import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js"; // Import protectRoute middleware

const router = express.Router();

router.post("/signup", signup)



// Example route for user login
router.post("/login",login)

router.post("/logout",logout)

router.put("/update-profile",protectRoute,updateProfile)

router.get("/check", protectRoute, checkAuth)

// Export the router
export default router;
