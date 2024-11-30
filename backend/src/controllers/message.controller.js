import { getReceiverSocketId, io } from '../lib/socket.js';
import Message from '../models/message.model.js';
import User from '../models/user.model.js'; // Import User model
import cloudinary from 'cloudinary'; // Import Cloudinary

export const getUsersForSidebar = async (req, res) => {
    try {
        const currentUserId = req.user._id; // Assuming user ID is stored in req.user
        const filteredUsers = await User.find({ _id: { $ne: currentUserId } }).select("-password"); // Find all users except the current user
        res.status(200).json(filteredUsers); // Send the list of users as a response
    } catch (error) {
        console.error("Error fetching users for sidebar:", error); // Add error debugging log
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id } = req.params; // Get the user ID from the request parameters
        const myId = req.user._id; // Get the current user's ID from the request

        // Log the current user's ID and the ID of the user they are chatting with
        console.log(`Current User ID: ${myId}, Chatting with User ID: ${id}`);

        // Find messages where the sender or receiver is the current user and the other user is the selected user
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: id },
                { senderId: id, receiverId: myId }
            ]
        }).sort({ createdAt: 1 }); // Sort messages by creation date

        if (!messages.length) {
            console.warn(`No messages found between User ID: ${myId} and User ID: ${id}`); // Log if no messages are found
        }

        res.status(200).json(messages); // Send the list of messages as a response
    } catch (error) {
        console.error("Error fetching messages:", error); // Add error debugging log
        res.status(500).json({ message: 'Error fetching messages', error: error.message });
    }
}



export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body; // Extract text and image from the request body
        const { id: receiverId } = req.params; // Get the receiver ID from the request parameters
        const senderId = req.user._id; // Get the sender ID from the authenticated user

        let imageUrl = null;
        // If an image is provided, upload it to Cloudinary
        if (image) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(image, {
                    folder: 'chat-app' // Specify the folder in Cloudinary
                });
                imageUrl = uploadResponse.secure_url; // Get the secure URL of the uploaded image
            } catch (uploadError) {
                console.error("Error uploading image to Cloudinary:", uploadError); // Log the upload error
                return res.status(500).json({ message: 'Error uploading image', error: uploadError.message });
            }
        }

        // Create a new message object
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl // Use the uploaded image URL
        });

        // Save the message to the database
        try {
            await newMessage.save();
        } catch (saveError) {
            console.error("Error saving message to the database:", saveError); // Log the save error
            return res.status(500).json({ message: 'Error saving message', error: saveError.message });
        }

     //  realtime chatting functionality goes here=> socket.io
     const receiverSocketId = getReceiverSocketId(receiverId);
     if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage", newMessage);
     }   

     // Send a success response with the new message
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sendMessage controller:", error); // Log the error for debugging
        res.status(500).json({ message: 'Error sending message', error: error.message });
    }
}