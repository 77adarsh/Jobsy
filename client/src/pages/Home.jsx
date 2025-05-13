// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Job Profile Application</h1>
          {user && (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="text-gray-700 hover:underline">
                {user.name}
              </Link>
              <button
                onClick={logout}
                className="px-3 py-1 bg-red-600 rounded text-sm text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome, {user ? user.name : 'Guest'}!</h2>
            <p className="text-gray-600">
              Explore opportunities.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Job Listings (Placeholder)</h2>
            <p className="text-gray-600">
              Relevant job listings will appear here based on your profile and preferences.
            </p>
            <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <p className="text-gray-500">No job listings available yet.</p>
              {/* Future: Display job cards here */}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">
            &copy; {new Date().getFullYear()} Job Profile Application. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;