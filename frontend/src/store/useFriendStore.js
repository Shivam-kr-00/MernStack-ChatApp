import { create } from "zustand";
import toast from "react-hot-toast";
import { useChatStore } from "./useChatStore";

const useFriendStore = create((set, get) => ({
    searchResults: [],
    requests: [],
    isLoading: false,

    // Search users by email or name (matches backend: req.query.email)
    searchUsers: async (query) => {
        if (!query || !query.trim()) {
            set({ searchResults: [] });
            return;
        }
        set({ isLoading: true });
        try {
            // NOTE: backend expects `email` param (per your controller)
            const res = await fetch(
                `/api/friends/search?email=${encodeURIComponent(query)}`,
                { credentials: "include" } // send cookie JWT
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Search failed");
            set({ searchResults: data });
        } catch (error) {
            toast.error(error.message || "Search failed");
            set({ searchResults: [] });
        } finally {
            set({ isLoading: false });
        }
    },

    // Send friend request using backend route POST /api/friends/request (body: { receiverId })
    sendRequest: async (receiverId) => {
        try {
            const res = await fetch("/api/friends/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ receiverId }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Request failed");
            toast.success(data.message || "Friend request sent");

            // Refresh friends list (so sidebar can update if you auto add on accept)
            const { getFriends } = useChatStore.getState();
            if (getFriends) getFriends();
        } catch (error) {
            toast.error(error.message || "Failed to send request");
        }
    },

    // Get pending requests (GET /api/friends/requests)
    getRequests: async () => {
        try {
            const res = await fetch("/api/friends/requests", {
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to fetch requests");
            set({ requests: data });
        } catch (error) {
            toast.error(error.message || "Failed to fetch requests");
            set({ requests: [] });
        }
    },

    // Accept / Reject friend request (PUT /api/friends/request/:id { action })
    handleRequest: async (requestId, action) => {
        try {
            const res = await fetch(`/api/friends/request/${requestId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ action }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Action failed");
            toast.success(data.message || `Request ${action}ed`);

            // Refresh friends list and requests
            const { getFriends } = useChatStore.getState();
            if (getFriends) getFriends();
            get().getRequests();
        } catch (error) {
            toast.error(error.message || "Failed to handle request");
        }
    },
}));

export default useFriendStore;
