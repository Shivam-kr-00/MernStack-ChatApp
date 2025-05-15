import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";
export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isSigningIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,


  checkAuth: async () => {
    try {
      console.log("Checking auth status...");
      const res = await axiosInstance.get("/auth/check");
      console.log("Auth check response:", res.data);
      set({ authUser: res.data.user });
      get().connectSocket(); // if we are authenticated then we should connect to socket
    } catch (error) {
      // Check if this is a 401 error, which is expected for non-authenticated users
      if (error.response && error.response.status === 401) {
        console.log("Not authenticated (normal for logged out users)");
        set({ authUser: null });
      } else {
        console.log("Error in checkAuth: ", error);
        set({ authUser: null });
      }
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", formData);
      if (res?.data?.user) {
        set({ authUser: res.data.user });
        toast.success("Signup successful");
        get().connectSocket();
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.log("Error in signup:", error);
      const message =
        error?.response?.data?.message || error.message || "Signup failed";
      toast.error(message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      get().disconnectSocket(); // disconnect socket befor logout
      const res = await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logout successful");
    } catch (error) {
      toast.error("Logout failed" + error.response.data.message);
    }
  },

  login: async (formData) => {
    set({ isSigningIn: true });
    try {
      const res = await axiosInstance.post('/auth/login', formData);
      set({ authUser: res.data.user });
      toast.success("Login successful");
      get().connectSocket(); //When one method in the store needs to read state or call another method in the same store uses get method
    } catch (error) {
      console.log("Error in login :", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isSigningIn: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      // Only include profilePic if it's being updated
      const updateData = { ...data };
      if (!updateData.profilePic) {
        delete updateData.profilePic;
      }

      const res = await axiosInstance.put("/auth/update-profile", updateData);
      set({ authUser: res.data.user });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile", error)
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
    finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    // connect to socket
    const { authUser } = get(); // it wiil check uaer is authorizaion or connected already
    if (!authUser || get().socket?.connected)
      return;
    const socket = io(BASE_URL, {
      query: {   //This is an options object passed to the io function.
        userId: authUser._id//, in this example, userId is being sent as a query parameter to the server with the value authUser._id.
      },
    });
    socket.connect();
    set({ socket: socket }); // set some value in socket 
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.off(); // Clean all event listeners
      socket.disconnect();
    }
    set({ socket: null }); // Important: Reset socket to null
  },

  connectSocket: () => {
    // connect to socket
    const { authUser } = get(); // it wiil check uaer is authorizaion or connected already
    if (!authUser || get().socket?.connected)
      return;
    const socket = io(BASE_URL, {
      query: {   //This is an options object passed to the io function.
        userId: authUser._id//, in this example, userId is being sent as a query parameter to the server with the value authUser._id.
      },
    });
    socket.connect();
    set({ socket: socket }); // set some value in socket 
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.off(); // Clean all event listeners
      socket.disconnect();
    }
    set({ socket: null }); // Important: Reset socket to null
  },

}));