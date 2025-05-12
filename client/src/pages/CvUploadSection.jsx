import React, { useState } from 'react';
import managerImage from "../assets/manager.png";

const CvUploadSection = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log("Uploading:", selectedFile.name);
      // Your upload logic goes here
    }
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
              />
              <label
                htmlFor="cv-upload"
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
              </label>

              <button
                onClick={handleUpload}
                className="bg-green-500 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
                disabled={!selectedFile}
              >
                Submit
              </button>
            </div>

            {selectedFile && (
              <p className="mt-2 text-sm text-gray-200">
                Selected File: {selectedFile.name}
              </p>
            )}
          </div>
        </div>

        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500 rounded-full opacity-50"></div>
      </div>
    </div>
  );
};

export default CvUploadSection;