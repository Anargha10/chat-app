import mongoose from 'mongoose'; // Import mongoose for schema creation

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    text: {
        type: String,
       
    },
    image: {
        type: String,
         // Optional image field
    },
    
}, {timestamps:true}
);

const Message = mongoose.model('Message', messageSchema); // Create the Message model

export default Message; // Export the Message model
