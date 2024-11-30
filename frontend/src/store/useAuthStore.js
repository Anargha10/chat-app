import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client"
const BASE_URL = import.meta.env.MODE === "development"? "http://localhost:5001" :"/"

export const useAuthStore = create((set,get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,

     onlineUsers : [],

    socket: null,

    checkAuth: async () => {
        console.log("Starting authentication check...");
        try {
            const res = await axiosInstance.get("/auth/check");
            console.log("Authentication check successful:", res.data);
            set({ authUser: res.data });
        } catch (error) {
            console.error("Error during authentication check:", error);
            set({ authUser: null });
        } finally {
            console.log("Finished authentication check.");
            set({ isCheckingAuth: false });
        }
    },
    signup: async(data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account Created Successfully");
        } catch (error) {
            console.error("Error during signup:", error); // Debugging log
            if (error.response) {
                console.error("Response data:", error.response.data); // Debugging log
                toast.error(error.response.data.message);
            } else {
                console.error("Error message:", error.message); // Debugging log
                toast.error("An unexpected error occurred.");
            }
        } finally {
            set({ isSigningUp: false });
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            // Set authUser as res.data.user, which contains the user information
            set({ authUser: res.data.user }); 
            toast.success("Logged in successfully");
            console.log("authUser after login:", get().authUser); // Debugging log
            get().connectSocket();
        } catch (error) {
            console.error("Error during login:", error); // Debugging log
            if (error.response) {
                console.error("Response data:", error.response.data); // Debugging log
                toast.error(error.response.data.message);
            } else {
                console.error("Error message:", error.message); // Debugging log
                toast.error("An unexpected error occurred.");
            }
        } finally {
            set({ isLoggingIn: false });
        }
    },
    

    logout: async() => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket()
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    updateProfile: async(data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Error during profile update:", error); // Debugging log
            if (error.response) {
                console.error("Response data:", error.response.data); // Debugging log
                toast.error(error.response.data.message);
            } else {
                console.error("Error message:", error.message); // Debugging log
                toast.error("An unexpected error occurred.");
            }
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        console.log("Attempting to connect socket. Auth user:", authUser);
    
        if (!authUser || !authUser._id || get().socket?.connected) {
            console.log("Socket connection aborted. Missing auth user or socket already connected.");
            return;
        }
    
        try {
            console.log("Creating socket connection with userId:", authUser._id);
            const socket = io(BASE_URL, {
                query: { userId: authUser._id },
            });
    
            // Store the socket in the state
            set({ socket });
    
            // Listen for successful connection
            socket.on("connect", () => {
                console.log("Socket connected successfully.");
                // Once connected, you can safely access socket.connected
                console.log("Socket connected status:", socket.connected);
            });
    
            // Handle connection errors
            socket.on("connect_error", (error) => {
                console.error("Socket connection error:", error);
                toast.error("Real-time connection failed, reconnecting...");
                 // Try reconnecting
            socket.connect();
            });
    
            // Handle disconnection
            socket.on("disconnect", () => {
                console.log("Socket disconnected.");
            });
    
            // Listen for online users
            socket.on("getOnlineUsers", (userIds) => {
                console.log("Received online users:", userIds);
                set({ onlineUsers: userIds });
            });
        } catch (error) {
            console.error("Error connecting to socket:", error);
        }
    },
        

    disconnectSocket: () => {
        try {
            console.log("Attempting to disconnect socket.");
            const socket = get().socket;
            if (socket?.connected) {
                console.log("Socket is connected. Disconnecting...");
                socket.disconnect();
                console.log("Socket disconnected successfully.");
            } else {
                console.log("Socket is not connected. No action taken.");
            }
        } catch (error) {
            console.error("Error disconnecting from socket:", error);
            toast.error("Failed to disconnect from socket.");
        }
    },
    
}))