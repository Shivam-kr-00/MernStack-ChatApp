import React, { useEffect, useState } from "react";
import useFriendStore from "../store/useFriendStore";

const FriendRequests = ({ isOpen, onClose }) => {
  const { getRequests, requests, handleRequest } = useFriendStore();
  const [loadingRequests, setLoadingRequests] = useState({});

  // Load requests when modal opens
  useEffect(() => {
    if (isOpen) {
      getRequests();
    }
  }, [isOpen, getRequests]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleRequestAction = async (id, action) => {
    setLoadingRequests((prev) => ({ ...prev, [id]: true }));
    try {
      await handleRequest(id, action);
    } catch (error) {
      console.error("Error handling request:", error);
    } finally {
      setLoadingRequests((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] transition-opacity duration-300 ease-in-out shadow-md"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-lg w-full mx-4 transform transition-all duration-300 ease-in-out scale-100 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Friend Requests
        </h2>

        <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {requests.length > 0 ? (
            requests.map((req) => (
              <div
                key={req._id}
                className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <span className="font-medium text-gray-900 dark:text-white">
                  {req.senderId.fullName}
                </span>
                <div className="space-x-3">
                  <button
                    onClick={() => handleRequestAction(req._id, "accept")}
                    disabled={loadingRequests[req._id]}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      loadingRequests[req._id]
                        ? "bg-gray-400 cursor-not-allowed text-gray-700"
                        : "bg-green-500 hover:bg-green-600 text-white hover:shadow-lg"
                    }`}
                  >
                    {loadingRequests[req._id] ? "Accepting..." : "Accept"}
                  </button>
                  <button
                    onClick={() => handleRequestAction(req._id, "reject")}
                    disabled={loadingRequests[req._id]}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      loadingRequests[req._id]
                        ? "bg-gray-400 cursor-not-allowed text-gray-700"
                        : "bg-red-500 hover:bg-red-600 text-white hover:shadow-lg"
                    }`}
                  >
                    {loadingRequests[req._id] ? "Rejecting..." : "Reject"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No requests found.
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full hover:scale-105 bg-red-400 hover:bg-red-600 dark:bg-red-400 dark:hover:bg-red-600 text-gray-800 dark:text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default FriendRequests;
