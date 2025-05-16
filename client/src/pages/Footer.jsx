import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-800">
              <span className="text-blue-600">J</span>obsy
            </h2>
            <p className="text-gray-600 mt-2">Find your dream job with us</p>
          </div>
          
          <div className="flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/find-job" className="text-gray-700 hover:text-blue-600">Find Job</Link>
            <Link to="/category" className="text-gray-700 hover:text-blue-600">Category</Link>
            <Link to="/blog" className="text-gray-700 hover:text-blue-600">Blog</Link>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Jobsy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;