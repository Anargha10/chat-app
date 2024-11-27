import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,
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

    login: async(data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");
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
}))