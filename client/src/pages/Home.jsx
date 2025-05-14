// src/pages/LandingPage.jsx
import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from './Footer.jsx';
import JobCategories from './JobCategories.jsx';
import JobInfoCard from './InfoCard.jsx';
import CvUploadSection from './CVUploadSection.jsx';

import teamImage from '../assets/team.png';
import adobeImage from '../assets/adobe.png';
import amazonImage from '../assets/amazon.png';
import googleImage from '../assets/google.png';
import walmartImage from '../assets/walmart.png';
import visaImage from '../assets/visa.png';
import paypalLogo from "../assets/paypal.png";
import metaLogo from "../assets/meta.png";
import youtubeLogo from "../assets/youtube.png";
import chatgptLogo from "../assets/chatgpt.png";
import nvidiaLogo from "../assets/nvidia.png";
import xLogo from "../assets/x.png";
import zomatoLogo from "../assets/zomato.png";
import linkedinLogo from "../assets/linkedin.png";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Navigation Bar */}
      <Navbar transparent={true} />

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left side content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Let's find your <br/>
              dream <span className="text-blue-600">job</span> with <span className="text-blue-600">Jobsy</span>
            </h2>
            
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-md p-2 mt-8 flex flex-col md:flex-row">
              <div className="flex items-center border-b md:border-b-0 md:border-r border-gray-200 p-2 md:w-1/3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Job title or keywords" 
                  className="w-full focus:outline-none text-sm"
                />
              </div>
              <div className="flex items-center border-b md:border-b-0 md:border-r border-gray-200 p-2 md:w-1/3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="City or zip code" 
                  className="w-full focus:outline-none text-sm"
                />
              </div>
              <div className="flex items-center p-2 md:w-1/3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Salary you want" 
                  className="w-full focus:outline-none text-sm"
                />
              </div>
              <button className="mt-4 md:mt-0 ml-0 md:ml-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
                Find Job
              </button>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="w-full lg:w-1/2">
            <img 
              src={teamImage}
              alt="Team working in office" 
              className="w-full object-cover"
            />
          </div>
        </div>
      </div>
      
      {/* Partner Logos */}
      <div className="container mx-auto px-4 py-8 flex flex-wrap justify-around items-center">
        <div className="p-4">
          <img src={adobeImage} alt="Adobe" className="h-6 opacity-70" />
        </div>
        <div className="p-4">
          <img src={visaImage} alt="Visa" className="h-6 opacity-70" />
        </div>
        <div className="p-4">
          <img src={amazonImage} alt="Amazon" className="h-6 opacity-70" />
        </div>
        <div className="p-4">
          <img src={googleImage} alt="Google" className="h-6 opacity-70" />
        </div>
        <div className="p-4">
          <img src={walmartImage} alt="Walmart" className="h-6 opacity-70" />
        </div>
      </div>
      
      {/* Job Categories */}
      <JobCategories />

      {/* Featured Jobs Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Feature Job Circular</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Job 1 */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="bg-blue-100 rounded-lg h-16 w-16 flex items-center justify-center mb-4">
              <img src={metaLogo} alt="Meta" />
            </div>
            <h3 className="font-semibold">Meta</h3>
            <p className="text-sm text-gray-500">Product designer</p>
          </div>
          
          {/* Job 2 */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="rounded-lg h-16 w-16 flex items-center justify-center mb-4">
              <img src={chatgptLogo} alt="Chatgpt" />
            </div>
            <h3 className="font-semibold">ChatGPT</h3>
            <p className="text-sm text-gray-500">Photographer</p>
          </div>
          
          {/* Job 3 */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="bg-blue-100 rounded-lg h-16 w-16 flex items-center justify-center mb-4">
              <img src={xLogo} alt="X" />
            </div>
            <h3 className="font-semibold">X</h3>
            <p className="text-sm text-gray-500">Desktop software</p>
          </div>
          
          {/* Job 4 */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="rounded-lg h-16 w-16 flex items-center justify-center mb-4">
              <img src={youtubeLogo} alt="YouTube" />
            </div>
            <h3 className="font-semibold">YouTube</h3>
            <p className="text-sm text-gray-500">Video editor</p>
          </div>
          
          {/* Job 5 */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="bg-blue-100 rounded-lg h-16 w-16 flex items-center justify-center mb-4">
              <img src={paypalLogo} alt="PayPal" />
            </div>
            <h3 className="font-semibold">PayPal</h3>
            <p className="text-sm text-gray-500">Accounting manager</p>
          </div>
          
          {/* Job 6 */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="bg-blue-100 rounded-lg h-16 w-16 flex items-center justify-center mb-4">
              <img src={linkedinLogo} alt="LinkedIn" />
            </div>
            <h3 className="font-semibold">LinkedIn</h3>
            <p className="text-sm text-gray-500">Web writer</p>
          </div>

          {/* Job 7 */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="bg-blue-100 rounded-lg h-16 w-16 flex items-center justify-center mb-4">
              <img src={zomatoLogo} alt="Zomato" />
            </div>
            <h3 className="font-semibold">Zomato</h3>
            <p className="text-sm text-gray-500">Web writer</p>
          </div>

          {/* Job 8 */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="bg-blue-100 rounded-lg h-16 w-16 flex items-center justify-center mb-4">
              <img src={nvidiaLogo} alt="Flipkart" />
            </div>
            <h3 className="font-semibold">Nvidia</h3>
            <p className="text-sm text-gray-500">Web writer</p>
          </div>
        </div>
      </div>
      
      {/* Job Info Card */}
      <JobInfoCard />
      
      <CvUploadSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;