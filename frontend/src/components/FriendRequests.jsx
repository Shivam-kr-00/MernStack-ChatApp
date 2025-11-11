import React, { useEffect } from "react";
import useFriendStore from "../store/useFriendStore";
import { X, UserPlus, Check, X as RejectIcon } from "lucide-react";

const FriendRequests = ({ onClose }) => {
  const { getRequests, requests, handleRequest, isLoading } = useFriendStore();

  useEffect(() => {
    getRequests();
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-scale">
      {/* Backdrop - Click to close */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Content - Enhanced with Tailwind Gradients and Effects */}
      <div className="bg-gradient-to-br from-base-100/90 to-base-200/90 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-2xl w-full max-w-md mx-4 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Friend Requests
          </h2>
          <button
            className="btn btn-sm btn-ghost hover:bg-base-content/10 hover:rotate-90 transition-transform duration-300"
            onClick={onClose}
            aria-label="Close friend requests"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-8 animate-pulse-subtle">
            <div className="loading loading-spinner loading-lg text-primary"></div>
            <p className="mt-2 text-base-content/70">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8">
            <UserPlus className="mx-auto text-base-content/50 mb-2 w-12 h-12" />
            <p className="text-base-content/70">No pending requests.</p>
            <p className="text-sm text-base-content/50 mt-1">
              Check back later or send some invites!
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {requests.map((req, index) => (
              <div
                key={req._id}
                className="flex justify-between items-center p-4 bg-gradient-to-r from-base-200/50 to-base-300/50 rounded-xl border border-base-content/10 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-in opacity-0"
                style={{ animationDelay: `${index * 0.1}s` }} // Staggered delay (minimal inline for timing)
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      req.senderId?.profilePic ||
                      "https://res.cloudinary.com/dahpi68b7/image/upload/v1761576531/avatar_boeayu.png"
                    }
                    alt={req.senderId?.fullName || "User"}
                    className="w-10 h-10 rounded-full border-2 border-base-content/20 shadow-sm"
                  />
                  <div>
                    <div className="font-medium text-base-content">
                      {req.senderId?.fullName || "Unknown"}
                    </div>
                    <div className="text-sm text-base-content/70">
                      {req.senderId?.email}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRequest(req._id, "accept")}
                    className="btn btn-sm bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:scale-105 hover:shadow-lg transition-all duration-300 shadow-md"
                    aria-label={`Accept request from ${req.senderId?.fullName}`}
                  >
                    <Check size={16} />
                    Accept
                  </button>
                  <button
                    onClick={() => handleRequest(req._id, "reject")}
                    className="btn btn-sm bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 hover:shadow-lg transition-all duration-300 shadow-md"
                    aria-label={`Reject request from ${req.senderId?.fullName}`}
                  >
                    <RejectIcon size={16} />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendRequests;
