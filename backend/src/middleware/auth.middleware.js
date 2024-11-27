import jwt from "jsonwebtoken"; // Import jwt for token handling
import User from "../models/user.model.js"; // Import User model for user-related operations

export const protectRoute = async (req, res, next) => {
    
    const token = req.cookies?.jwt; // Get the token from cookies
    console.log("Token extracted:", req.cookies.jwt);

    console.log("Cookies:", req.cookies); // Log all cookies
   
    if (!token) {
        return res.status(401).json({ message: "Unauthorized access- No token Provided" }); // No token, unauthorized
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        console.log("Decoded token:", decoded);
        if(!decoded){
            return res.status(401).json({message:"Unauthorized-invalid token"})
        }
        const user = await User.findById(decoded.id).select("-password"); // Find the user by ID from the token
        console.log("User ID being queried:", decoded.id);
        console.log("User found:", user);
        if (!user) {
            return res.status(404).json({ message: "User not found" }); // User not found, unauthorized
        }
        req.user= user
        console.log("Token:", token); // Check if token is being extracted
console.log("Decoded Token:", decoded); // Verify decoding process
console.log("User:", user); // Ensure the user is being fetched correctly

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.log("error in protected route");
        return res.status(401).json({ message: "Invalid token", error: error.message }); // Token verification failed
    }
};