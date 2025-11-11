import React, { useEffect, useState } from "react";
import useFriendStore from "../store/useFriendStore";
import { Search, UserPlus } from "lucide-react";
import { AiOutlineClose } from "react-icons/ai";
const FindFriends = ({ onClose }) => {
  // IMPORTANT: This component no longer expects isOpen; Navbar controls rendering.
  const { searchUsers, searchResults, sendRequest, isLoading } =
    useFriendStore();
  const [query, setQuery] = useState("");
  const modalRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    await searchUsers(query.trim());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md border border-base-300 transform transition-all duration-300 ease-in-out hover:shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Connect with Friends
          </h2>
          <button
            className="btn btn-sm btn-ghost hover:bg-error hover:text-white transition-colors duration-200"
            onClick={onClose}
          >
            <AiOutlineClose size={20} />
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search by email or name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input input-bordered flex-1 focus:input-primary transition-all duration-200"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button
            onClick={handleSearch}
            className="btn btn-primary hover:scale-105 transition-transform duration-200"
            disabled={isLoading}
          >
            <Search size={16} />
          </button>
        </div>

        <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-100">
          {isLoading ? (
            <div className="text-center py-4 animate-pulse">
              <div className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((user) => (
              <div
                key={user._id}
                className="flex justify-between items-center p-3 border-b border-base-200 hover:bg-base-200 transition-colors duration-200 rounded-md mb-1"
              >
                <div>
                  <p className="font-medium text-base-content">
                    {user.fullName || "No name"}
                  </p>
                  <p className="text-sm text-base-content/70">{user.email}</p>
                </div>
                <button
                  onClick={() => sendRequest(user._id)}
                  className="btn btn-sm btn-secondary hover:btn-accent hover:scale-105 transition-all duration-200 flex items-center gap-1"
                >
                  <UserPlus size={14} /> Send Request
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-base-content/50 py-4">
              No users found. Try a different email or name.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindFriends;
