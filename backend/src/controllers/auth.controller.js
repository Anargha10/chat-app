import User from "../models/user.model.js"; // Import the User model
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing
import { generateToken } from "../lib/utils.js"; // Import generateToken function
import cloudinary from '../lib/cloudinary.js'; // Import Cloudinary configuration


export const signup = async (req, res) => {
    console.log('Request body:', req.body); // Log the incoming request body
    if (!req.body) {
        return res.status(400).json({ error: "Request body is missing" });
    }
    const { fullName, email, password } = req.body; // Changed fullname to fullName
    try {
        if (password.length < 6) {
            console.log("Password validation failed"); // Debug log
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const existingUser = await User.findOne({ email }); // Check if the user already exists
        console.log("Existing user:", existingUser); // Log if a user already exists
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists. Please login." });
        }

        const salt = await bcrypt.genSalt(10);
        console.log("Generated salt:", salt); // Log the generated salt
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with a salt round of 10
        console.log("Hashed password:", hashedPassword); // Log the hashed password

        const user = new User({ fullName, email, password: hashedPassword }); // Changed fullname to fullName
        console.log("User instance before saving:", user); // Log the user instance before saving

        if (user) {
            await user.save(); // Save the user to the database
            console.log("User saved successfully:", user); // Log the saved user

            generateToken(user._id, res); // Generate a token for the newly created user
            return res.status(201).json({
                message: "User registered successfully",
                id: user._id,
                fullName: user.fullName, // Changed fullname to fullName
                email: user.email,
                profilePicture: user.profilePicture,
            });
        } else {
            console.log("User creation failed"); // Debug log
            return res.status(400).json({ message: "User registration failed" });
        }
    } catch (error) {
        console.error("Error during signup:", error.message); // Log the error
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }); // Find user by email
        if (!user || !(await bcrypt.compare(password, user.password))) { // Check if user exists and password matches
            return res.status(400).json({ message: "Invalid credentials" });
        }

      generateToken(user._id, res); // Generate a token for the logged-in user
        res.status(200).json({ message: "Login successful", user: {_id: user._id ,fullName: user.fullName, email: user.email, profilePicture:user.profilePicture } }); // Changed fullname to fullName
    } catch (error) {
        console.log("error in login controller")
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const logout = (req, res) => {
   try {
    res.cookie("jwt", "", {maxAge:0})
    res.status(200).json({message:"logged out successfully"})
   } catch (error) {
    console.log("error in logout controller", error.message)
    res.status(500).json({ message: "Internal Server error" });
   }
}

 export const updateProfile = async (req, res) => {
    // Destructure the request body
    console.log("Update Profile Route Hit");
    try {
        const { profilePicture } = req.body;
        const userId = req.user._id; // Find the user by ID from the token
        console.log("Received profile picture:"); // Debug log for received profile picture

        if (!profilePicture) {
            console.error("Profile picture is missing"); // Error log for missing profile picture
            return res.status(404).json({ message: "Profile pic is required" });
        }

        // Update user fields
        console.log("Uploading profile picture to Cloudinary..."); // Debug log before upload
         const uploadResponse = await cloudinary.uploader.upload(profilePicture);
      
        console.log("Upload response from Cloudinary:", uploadResponse); // Debug log for upload response

        const updatedUser = await User.findByIdAndUpdate(userId, { profilePicture: uploadResponse.secure_url }, { new: true });
        console.log("User updated successfully:", updatedUser); // Debug log for updated user

        res.status(200).json({ message: "Profile updated successfully", updatedUser });
    } catch (error) {
        console.error("Error details in updateprofile controller:", error.stack); // Add this to your catch block
        // Log the error
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const checkAuth = (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(req.user);
    } catch (error) {
        console.error("Error in checkAuth controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
