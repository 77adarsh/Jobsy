import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import managerImage from "../assets/manager.png";
import { useAuth } from "../context/AuthContext"; // Adjust this path as needed

const CvUploadSection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { user, token } = useAuth(); // Get user and token from AuthContext
  const navigate = useNavigate();
  
  // Check if user is logged in
  const isLoggedIn = !!user;

  // Reset popup if user logs in
  useEffect(() => {
    if (isLoggedIn && showPopup) {
      setShowPopup(false);
    }
  }, [isLoggedIn, showPopup]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    // Double-check auth status before processing
    if (!isLoggedIn) {
      setShowPopup(true);
      return;
    }

    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    try {
      setUploading(true);
      
      // Create FormData object to send file
      const formData = new FormData();
      formData.append("cv", selectedFile);
      formData.append("userId", user._id); // Assuming user object has _id field
      
      // Send file to your backend API
      const response = await axios.post("/api/uploads/cv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Upload successful:", response.data);
      alert("CV uploaded successfully!");
      setSelectedFile(null); // Reset the file after upload
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload CV. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleLoginClick = () => {
    setShowPopup(false);
    navigate("/login"); // Use navigate for React Router navigation
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-blue-600 rounded-lg text-white p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Image */}
          <div className="w-full md:w-1/3 flex justify-center md:justify-start mb-6 md:mb-0">
            <img
              src={managerImage}
              alt="Manager"
              className="w-40 md:w-52 lg:w-64 object-contain"
            />
          </div>

          {/* Text + Upload */}
          <div className="w-full md:w-2/3 text-center md:text-right">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2">
              Just drop your CV
            </h3>
            <h4 className="text-xl sm:text-2xl md:text-3xl font-medium mb-6">
              and get the job
            </h4>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end gap-4">
              <input
                type="file"
                id="cv-upload"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx"
                disabled={!isLoggedIn || uploading}
              />
              {isLoggedIn ? (
                <label
                  htmlFor="cv-upload"
                  className={`bg-white text-blue-600 hover:bg-gray-100 font-medium py-2 px-4 rounded-lg cursor-pointer flex items-center ${
                    uploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  {uploading ? "Uploading..." : "Upload CV"}
                </label>
              ) : (
                <button
                  onClick={() => setShowPopup(true)}
                  className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-2 px-4 rounded-lg cursor-pointer flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Upload CV
                </button>
              )}

              <button
                onClick={handleUpload}
                disabled={!isLoggedIn || !selectedFile || uploading}
                className={`bg-green-500 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg ${
                  (!isLoggedIn || !selectedFile || uploading) ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {uploading ? "Uploading..." : "Submit"}
              </button>
            </div>

            {selectedFile && isLoggedIn && (
              <p className="mt-2 text-sm text-gray-200">
                Selected File: {selectedFile.name}
              </p>
            )}
          </div>
        </div>

        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500 rounded-full opacity-50"></div>
      </div>

      {/* Popup - Modified to show without dark background */}
      {showPopup && !isLoggedIn && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white text-black p-6 rounded-lg w-80 shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Login Required</h2>
            <p className="mb-4">Please log in or register to upload your CV.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleLoginClick}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CvUploadSection;