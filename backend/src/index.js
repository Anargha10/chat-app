 import dotenv from "dotenv"
import express from "express"
import cookieParser from "cookie-parser"; // Import cookie-parser
import cors from "cors"; // Import cors
import authroutes from "./routes/auth.routes.js";
import messageroutes from "./routes/message.route.js"; // Import messageroutes
import connectDB from "./lib/db.js";
import { app, server } from "./lib/socket.js";

import path from "path"
// Start Generation Here
dotenv.config()



console.log('Cloudinary Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('Cloudinary API Key:', process.env.CLOUDINARY_API_KEY);
console.log('Cloudinary API Secret:', process.env.CLOUDINARY_API_SECRET);

 // Set up CORS
app.use(cookieParser()); 

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

app.use((req, res, next) => {
    console.log("Cookies:", req.cookies);
    next();
});// Set up cookie parser
app.use(express.json({limit: '10mb'}))
app.use(express.urlencoded({ limit:'10mb' ,extended: true }));
app.use("/api/auth", authroutes)
app.use("/api/messages", messageroutes) // Use messageroutes for message-related routes
const PORT = process.env.PORT ;

const __dirname = path.resolve();

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get('*', (req,res)=>{
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}


connectDB()
app.get('/', (req, res) => {
    res.send('Hello World!');
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    
});
