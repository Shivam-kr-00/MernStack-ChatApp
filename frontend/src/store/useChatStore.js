import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [], // Note: This will now hold friends instead of all users
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    // Updated: Renamed to getFriends and changed API endpoint to /api/friends
    getFriends: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/friends"); // Updated: Calls the friends list endpoint
            set({ users: res.data }); // Still uses 'users' state for consistency (now holds friends)
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    // Updated: Now supports text, images, videos, audio (e.g., MP3), and files via FormData
    sendMessages: async (messageData) => { // First, it takes messageData as a parameter from MessageInput.jsx
        const { selectedUser, messages } = get(); // Then, it gets selectedUser and messages from the store
        try {
            // Prepare FormData for multipart upload (handles text + media)
            const formData = new FormData();
            if (messageData.text) formData.append('text', messageData.text);
            if (messageData.mediaFile) {
                // Basic client-side validation (matches backend)
                const allowedTypes = [
                    'image/jpeg', 'image/png', 'image/gif',
                    'video/mp4', 'video/avi',
                    'audio/mpeg', // Corrected: MP3 is 'audio/mpeg', not 'audio/mp3'
                    'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip'
                ];
                if (!allowedTypes.includes(messageData.mediaFile.type)) {
                    toast.error("Invalid file type. Only images, videos, audio, and common files are allowed.");
                    return;
                }
                if (messageData.mediaFile.size > 50 * 1024 * 1024) { // 50MB limit (sync with backend if possible)
                    toast.error("File too large. Max size is 50MB.");
                    return;
                }
                formData.append('media', messageData.mediaFile); // 'media' matches backend Multer field
            }

            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' } // Explicitly set for FormData
            });
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send message");
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;

            set({
                messages: [...get().messages, newMessage],
            });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));