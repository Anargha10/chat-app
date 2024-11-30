import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";



export const useChatstorage =create((set,get)=>({
    messages: [],
    users:[],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            // Make the Axios request
            const res = await axiosInstance.get("/messages/users");
    
            // Axios already parses JSON, so use res.data directly
            console.log("checking users data:", res.data);
    
            // Update the state with the users data
            set({ users: res.data });
        } catch (error) {
            // Handle errors and display a toast notification
            const errorMessage = error.response?.data?.message || "An error occurred";
            toast.error(errorMessage);
        } finally {
            // Ensure loading state is reset
            set({ isUsersLoading: false });
        }
    },
    
    getMessages: async(userId) =>{
        set({isMessagesLoading: true})
        try {
            const res = await axiosInstance.get(`/messages/${userId}`)
            set({messages: res.data})
        } catch (error) {
            toast.error(error.response.data.message)
        } finally{
            set({isMessagesLoading:false})
        }
    },

    sendMessage: async(messageData) => {
        const { selectedUser, messages } = get();
        console.log("Selected User:", selectedUser); // Debugging log for selected user
        console.log("Message Data:", messageData); // Debugging log for message data

        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            console.log("Response from sendMessage:", res.data); // Debugging log for response
            set({ messages: [...messages, res.data] });
        } catch (error) {
            console.error("Error sending message:", error); // Debugging log for error
            toast.error(error.response?.data?.message || "An error occurred while sending the message");
        }
    },

    subscribeToMessages:()=>{
        const{ selectedUser} = get()
        const socket= useAuthStore.getState().socket
       
    if (!selectedUser) {
        console.log("No selected user.");
        return;
    }
        
        

        // Log the socket object and its connection status
    console.log("Socket object in subscribeToMessages:", socket);
    console.log("Socket connected status:", socket?.connected);
        //todo:optimise this one later
        if (!socket || !socket.connected) {
            console.log("Socket is not connected.");
            
            return;
        }

        socket.on("newMessage",(newMessage)=>{

            if(newMessage.senderId!== selectedUser._id)
                return;
            set({
                messages:[...get().messages, newMessage]
            })
        })
    },

    unsubscribeFromMessages:()=>{
        const socket= useAuthStore.getState().socket;
        if (socket && socket.off) {
            socket.off('newMessage'); // Unsubscribe if socket is valid
          } else {
            console.log('Socket is not available or not connected');
          }
        

    },
    // todo: optimize this one later=> done
    setSelectedUser: (selectedUser)=> set({selectedUser }),
}))