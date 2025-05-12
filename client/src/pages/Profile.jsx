// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import MyMap from '../components/MyMap.jsx'; // Assuming MyMap.jsx is in a 'components' folder

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // Add more state for other profile fields

  // State for location tracking feature
  const [userLocation, setUserLocation] = useState(null); // Stores city, state, country from backend
  const [weatherData, setWeatherData] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  // New states to store raw latitude and longitude for the map
  const [currentLat, setCurrentLat] = useState(null);
  const [currentLng, setCurrentLng] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileData(user);
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    console.log('Saving profile:', { name, email /*, ...otherFields */ });
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    if (profileData) {
      setName(profileData.name || '');
      setEmail(profileData.email || '');
    }
  };

  const handleObtainLocation = async () => {
    setLoadingLocation(true);
    setLocationError('');
    setUserLocation(null);
    setWeatherData(null);
    setCurrentLat(null); // Clear previous lat/lng
    setCurrentLng(null); // Clear previous lat/lng

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLat(latitude); // Store raw latitude
          setCurrentLng(longitude); // Store raw longitude

          try {
            // Call your backend API with latitude and longitude
            const response = await fetch(
              `${import.meta.env.VITE_BACKEND_API_URL}/api/location/track?lat=${latitude}&lng=${longitude}`
            );
            const data = await response.json();

            if (response.ok) {
              setUserLocation(data.location);
              setWeatherData(data.weather);
              // NOTE: We are no longer using data.mapUrl here as we use Leaflet.js
            } else {
              setLocationError(data.message || 'Failed to obtain location data from server.');
            }
          } catch (error) {
            console.error('Error fetching location data from backend:', error);
            setLocationError('Network error or server unavailable. Please try again.');
          } finally {
            setLoadingLocation(false);
          }
        },
        (error) => {
          setLoadingLocation(false);
          let errorMessage = 'Unable to retrieve your location.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location services in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'The request to get user location timed out.';
              break;
            default:
              break;
          }
          setLocationError(errorMessage);
          console.error('Geolocation error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setLoadingLocation(false);
      setLocationError('Geolocation is not supported by your browser.');
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
              <div className="mt-6">
                <button
                  onClick={handleEditClick}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 active:bg-blue-800"
                >
                  Edit Profile
                </button>
              </div>

              {/* Location Tracking Section */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Location Services
                </h3>
                <button
                  onClick={handleObtainLocation}
                  className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 active:bg-green-800 disabled:opacity-50"
                  disabled={loadingLocation}
                >
                  {loadingLocation ? 'Obtaining Location...' : 'Obtain Location'}
                </button>

                {locationError && (
                  <p className="mt-4 text-sm text-red-600">{locationError}</p>
                )}

                {userLocation && (currentLat !== null && currentLng !== null) && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-md shadow-inner">
                    <h4 className="text-md font-semibold text-gray-800 mb-2">Your Current Location:</h4>
                    <p className="text-sm text-gray-700">
                      <strong className="font-medium">Location:</strong> {userLocation.city}, {userLocation.state}, {userLocation.country}
                    </p>

                    {weatherData && (
                      <div className="mt-4">
                        <h4 className="text-md font-semibold text-gray-800 mb-2">Current Weather:</h4>
                        <div className="flex items-center space-x-4">
                          {/* Ensure weatherData.icon is valid before rendering */}
                          {weatherData.icon && (
                            <img src={weatherData.icon} alt={weatherData.description} className="w-12 h-12" />
                          )}
                          <div>
                            <p className="text-lg font-bold text-gray-900">{weatherData.temperature}°C</p>
                            <p className="text-sm text-gray-600 capitalize">{weatherData.description}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Render the MyMap component */}
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-gray-800 mb-2">Location on Map:</h4>
                      <div className="border border-gray-300 rounded-md overflow-hidden">
                        <MyMap latitude={currentLat} longitude={currentLng} />
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Map powered by OpenStreetMap. Weather conditions displayed separately.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;