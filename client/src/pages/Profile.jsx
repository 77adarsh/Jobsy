// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // Add more state for other profile fields

  useEffect(() => {
    // In a real application, you would fetch the user's full profile data here
    // based on the user ID or token. For now, we'll use the basic user info
    // from the AuthContext.
    if (user) {
      setProfileData(user);
      setName(user.name || '');
      setEmail(user.email || '');
      // Initialize other state fields
    }
  }, [user]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    // In a real application, you would send the updated profile data
    // to your backend API to save the changes.
    console.log('Saving profile:', { name, email /*, ...otherFields */ });
    setIsEditing(false);
    // Optionally update the AuthContext user data if the backend returns
    // the updated user object.
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    // Reset form values to the current profile data
    if (profileData) {
      setName(profileData.name || '');
      setEmail(profileData.email || '');
      // Reset other state fields
    }
  };

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-100 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Your Profile
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            View and edit your personal information.
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          {isEditing ? (
            <div>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {/* Add more input fields for other profile information */}
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  type="button"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={handleCancelClick}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 active:bg-blue-800"
                  onClick={handleSaveClick}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <dt className="text-sm font-medium text-gray-500">
                  Full Name
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profileData.name}
                </dd>
              </div>
              <div className="mb-4">
                <dt className="text-sm font-medium text-gray-500">
                  Email Address
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profileData.email}
                </dd>
              </div>
              {/* Display other profile information here */}
              <div className="mt-6">
                <button
                  onClick={handleEditClick}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 active:bg-blue-800"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;