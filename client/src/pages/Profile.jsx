import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import MyMap from "../components/MyMap.jsx";

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [skills, setSkills] = useState("");

  const [userLocation, setUserLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [currentLat, setCurrentLat] = useState(null);
  const [currentLng, setCurrentLng] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileData(user);
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setBio(user.bio || "");
      setLinkedin(user.linkedin || "");
      setGithub(user.github || "");
      setSkills(user.skills?.join(", ") || "");
    }
  }, [user]);

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => {
    setIsEditing(false);
    if (profileData) {
      setName(profileData.name || "");
      setEmail(profileData.email || "");
      setPhone(profileData.phone || "");
      setBio(profileData.bio || "");
      setLinkedin(profileData.linkedin || "");
      setGithub(profileData.github || "");
      setSkills(profileData.skills?.join(", ") || "");
    }
  };

  const handleSaveClick = () => {
    console.log("Saving profile:", {
      name,
      email,
      phone,
      bio,
      linkedin,
      github,
      skills: skills.split(",").map((skill) => skill.trim()), // convert string to array
    });
    setIsEditing(false);
  };

  const handleObtainLocation = async () => {
    setLoadingLocation(true);
    setLocationError("");
    setUserLocation(null);
    setWeatherData(null);
    setCurrentLat(null);
    setCurrentLng(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async ({ coords: { latitude, longitude } }) => {
          setCurrentLat(latitude);
          setCurrentLng(longitude);
          try {
            const response = await fetch(
              `${
                import.meta.env.VITE_API_URL
              }/location/track?lat=${latitude}&lng=${longitude}`
            );
            const data = await response.json();

            if (response.ok) {
              setUserLocation(data.location);
              setWeatherData(data.weather);
            } else {
              setLocationError(
                data.message || "Failed to fetch location data."
              );
            }
          } catch (error) {
            setLocationError("Network error or server unavailable.");
          } finally {
            setLoadingLocation(false);
          }
        },
        (error) => {
          setLoadingLocation(false);
          const errorMessage =
            {
              1: "Permission denied. Enable location access.",
              2: "Location unavailable.",
              3: "Location request timed out.",
            }[error.code] || "Unknown error occurred.";
          setLocationError(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setLoadingLocation(false);
      setLocationError("Geolocation not supported.");
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-lg p-8 space-y-8">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
            <p className="text-sm text-gray-600">
              Manage your personal and professional details.
            </p>
          </div>
          {!isEditing ? (
            <button
              onClick={handleEditClick}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit Profile
            </button>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Full Name", value: name, setter: setName, type: "text" },
            { label: "Email", value: email, setter: setEmail, type: "email" },
            {
              label: "Phone Number",
              value: phone,
              setter: setPhone,
              type: "tel",
            },
            {
              label: "LinkedIn",
              value: linkedin,
              setter: setLinkedin,
              type: "url",
            },
            { label: "GitHub", value: github, setter: setGithub, type: "url" },
            {
              label: "Bio",
              value: bio,
              setter: setBio,
              type: "textarea",
              full: true,
            },
          ].map((field, idx) => (
            <div key={idx} className={field.full ? "md:col-span-2" : ""}>
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              {isEditing ? (
                field.type === "textarea" ? (
                  <textarea
                    rows="3"
                    className="mt-1 w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                  ></textarea>
                ) : (
                  <input
                    type={field.type}
                    className="mt-1 w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                  />
                )
              ) : (
                <p className="mt-1 text-sm text-gray-900">
                  {field.value || "—"}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Skills (comma separated)
          </label>
          {isEditing ? (
            <input
              type="text"
              className="mt-1 w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g., JavaScript, React, Node.js"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">
              {skills
                ? skills.split(",").map((skill, i) => (
                    <span
                      key={i}
                      className="inline-block bg-blue-100 text-blue-800 px-2 py-1 m-1 rounded text-xs"
                    >
                      {skill.trim()}
                    </span>
                  ))
                : "—"}
            </p>
          )}
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3">
            <button
              onClick={handleCancelClick}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveClick}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        )}

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">Location Services</h2>
          <button
            onClick={handleObtainLocation}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            disabled={loadingLocation}
          >
            {loadingLocation ? "Fetching..." : "Obtain Location"}
          </button>
          {locationError && (
            <p className="text-red-600 mt-2">{locationError}</p>
          )}

          {userLocation && currentLat && currentLng && (
            <div className="mt-6 bg-gray-50 p-4 rounded shadow-inner">
              <p className="text-sm text-gray-800">
                <strong>Location:</strong> {userLocation.city},{" "}
                {userLocation.state}, {userLocation.country}
              </p>

              {weatherData && (
                <div className="mt-4 flex items-center gap-4">
                  {weatherData.icon && (
                    <img
                      src={weatherData.icon}
                      alt={weatherData.description}
                      className="w-12 h-12"
                    />
                  )}
                  <div>
                    <p className="text-lg font-semibold">
                      {weatherData.temperature}°C
                    </p>
                    <p className="text-sm text-gray-600">
                      {weatherData.description}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h3 className="font-medium text-gray-800 mb-2">Map</h3>
                <div className="h-64 border rounded overflow-hidden">
                  <MyMap latitude={currentLat} longitude={currentLng} />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Map powered by OpenStreetMap.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;