import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Camera } from 'lucide-react';

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    fullName: authUser?.fullName || '',
    email: authUser?.email || '',
    phoneNumber: authUser?.phoneNumber || '',
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await updateProfile(editedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div className="h-screen pt-20 font-sans bg-base-100 text-base-content">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-200 rounded-xl p-6 space-y-8 shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary">Profile</h1>
          </div>

          <div className="flex flex-col items-center gap-6">
            {/* Profile Image */}
            <div className="h-24 w-24 border-4 border-primary rounded-full relative overflow-hidden">
              <img
                src={selectedImg || authUser?.profilePic || "/avatar.png"}
                alt="Profile"
                className="h-full w-full object-cover"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-primary hover:bg-primary-focus p-2 rounded-full cursor-pointer"
              >
                <Camera size={20} className="text-white" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>

            {/* User Details */}
            <div className="w-full space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm text-base-content/60 mb-1">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={editedUser.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-md bg-base-100 text-base-content border border-base-content/20 focus:ring-2 focus:ring-primary outline-none"
                  />
                ) : (
                  <p className="text-lg font-medium text-base-content">{authUser?.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-base-content/60 mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editedUser.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-md bg-base-100 text-base-content border border-base-content/20 focus:ring-2 focus:ring-primary outline-none"
                  />
                ) : (
                  <p className="text-lg font-medium text-base-content">{authUser?.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm text-base-content/60 mb-1">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={editedUser.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-md bg-base-100 text-base-content border border-base-content/20 focus:ring-2 focus:ring-primary outline-none"
                  />
                ) : (
                  <p className="text-lg font-medium text-base-content">{authUser?.phoneNumber || 'Not provided'}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-sm font-medium text-base-content bg-base-300 hover:bg-base-300/80 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-focus rounded-md"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-focus rounded-md"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
