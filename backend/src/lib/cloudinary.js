import { v2 as cloudinary } from 'cloudinary';


// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: "dqfcupqf8",
    api_key: "569185284442197",
    api_secret: "y7znYbjR65GqOZ8tdlRaC0sIfGU",
});

// Function to upload an image to Cloudinary
export default cloudinary;