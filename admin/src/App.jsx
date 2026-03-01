import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminHome from "./pages/AdminHome";
import AdminDashboard from "./pages/AdminDashboard";
// Loader is kept if you use it inside other pages, otherwise it can be removed

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route: Login */}
        <Route path="/" element={<AdminLogin />} />
        
        {/* Main Admin Route */}
        <Route path="/dashboard" element={<AdminHome />} />
        
        {/* Secondary Admin Dashboard Route */}
        <Route path="/home" element={<AdminDashboard />} />
        
        {/* Fallback to Login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;