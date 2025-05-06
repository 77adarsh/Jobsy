import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Home from './pages/Home.jsx';
// Import other pages as needed

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* Add other routes as needed */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;