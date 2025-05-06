// src/pages/Home.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// You can create these components later
// import FeatureSection from '../components/FeatureSection';
// import Dashboard from '../components/Dashboard';
// import NotificationCenter from '../components/NotificationCenter';

const Home = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // This useEffect can be expanded to fetch additional data for future features
  useEffect(() => {
    // Simulate fetching user data
    const fetchUserData = async () => {
      try {
        // Replace with actual API call when ready
        // const res = await axios.get('/api/users/me');
        // setUser(res.data);
        
        // Placeholder data
        setTimeout(() => {
          setUser({
            name: 'Adarsh Chaudhary',
            email: 'adarsh@gmail.com',
            // Add more user fields as needed for future features
          });
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  // This section will make it easy to add feature flags later
  const features = {
    dashboard: true,
    notifications: false,
    analytics: false,
    // Add more feature flags here as you develop new features
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - can be expanded with navigation, search, etc. */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Application Dashboard</h1>
          
          {/* User menu - can be expanded with dropdown, notifications, etc. */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-gray-700">{user.name}</span>
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user.name.charAt(0)}
                </div>
                {/* Placeholder for future user menu dropdown */}
                {/* <UserMenu user={user} /> */}
              </div>
            ) : (
              <div className="space-x-2">
                <Link 
                  to="/login" 
                  className="px-3 py-1 bg-white border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
                >
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  className="px-3 py-1 bg-blue-600 rounded text-sm text-white hover:bg-blue-700"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Main content - structured for easy addition of new sections/features */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome section */}
        <section className="mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome to your account</h2>
            <p className="text-gray-600">
              This is your home page where future features will be accessible. As new functionality is added,
              this dashboard will be updated to provide easy access to all features.
            </p>
            
            {/* Quick actions - can be expanded with more actions */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link 
                  to="/profile" 
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="rounded-full bg-blue-100 p-3 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Update Profile</h4>
                    <p className="text-sm text-gray-500">Manage your account information</p>
                  </div>
                </Link>
                
                <Link 
                  to="/settings" 
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="rounded-full bg-blue-100 p-3 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Settings</h4>
                    <p className="text-sm text-gray-500">Configure application preferences</p>
                  </div>
                </Link>
                
                <Link 
                  to="/forgot-password" 
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="rounded-full bg-blue-100 p-3 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Security</h4>
                    <p className="text-sm text-gray-500">Manage passwords and security settings</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Feature placeholders - these sections can be populated as features are developed */}
        {features.dashboard && (
          <section className="mb-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Dashboard Overview</h2>
              
              {/* Dashboard placeholder - will be replaced with actual component */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-500">Dashboard features will be displayed here</p>
                {/* <Dashboard /> */}
              </div>
            </div>
          </section>
        )}
        
        {features.notifications && (
          <section className="mb-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h2>
              
              {/* Notifications placeholder - will be replaced with actual component */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-500">Notifications will appear here when this feature is enabled</p>
                {/* <NotificationCenter /> */}
              </div>
            </div>
          </section>
        )}
        
        {features.analytics && (
          <section className="mb-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Analytics</h2>
              
              {/* Analytics placeholder - will be replaced with actual component */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-500">Analytics will be displayed here when this feature is enabled</p>
                {/* <Analytics /> */}
              </div>
            </div>
          </section>
        )}
        
        {/* Extension point - for future features */}
        <section className="mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Coming Soon</h2>
            <p className="text-gray-600 mb-4">
              New features are being developed and will appear here when ready.
            </p>
            
            {/* Placeholder for upcoming features list */}
            <ul className="space-y-2 ml-5 list-disc text-gray-600">
              <li>Advanced user management</li>
              <li>Analytics dashboard</li>
              <li>Integration with third-party services</li>
              <li>Enhanced security features</li>
            </ul>
          </div>
        </section>
      </main>
      
      {/* Footer - can be expanded with more links, information */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start space-x-6">
              <Link to="/about" className="text-gray-500 hover:text-gray-900">About</Link>
              <Link to="/contact" className="text-gray-500 hover:text-gray-900">Contact</Link>
              <Link to="/privacy" className="text-gray-500 hover:text-gray-900">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-500 hover:text-gray-900">Terms of Service</Link>
            </div>
            <div className="mt-8 md:mt-0">
              <p className="text-center md:text-right text-gray-500">
                &copy; {new Date().getFullYear()} All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;