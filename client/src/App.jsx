import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

// Common Components
import Navbar from "./components/common/Navbar.jsx";
import LanguageGate from "./components/common/LanguageGate.jsx";
import Loader from "./components/common/Loader.jsx";
import Chatbot from "./components/common/Chatbot.jsx";
import BlobCursor from "./components/common/BlobCursor.jsx"; 

// Dashboard & Pages
import Login from "./components/dashboard/Login.jsx";
import Services from "./components/pages/Services.jsx";
import Notification from "./components/dashboard/Notification.jsx";
import Home from "./components/dashboard/Home.jsx";
import Profile from "./components/dashboard/Profile.jsx";
import Contacts from "./components/dashboard/Contacts.jsx";
import ServiceHistory from "./components/dashboard/ServiceHistory.jsx";
import MyComplaints from "./components/dashboard/MyComplaints.jsx";

// Complaints & Payment
import ComplaintService from "./components/complaints/ComplaintService";
import ComplaintForm from "./components/complaints/ComplaintForm";
import ComplaintStatus from "./components/complaints/ComplaintStatus";
import ComplaintCategories from "./components/complaints/ComplaintCategories";
import PaymentPage from "./components/payment/PaymentPage.jsx";

const App = () => {
  const [languageSelected, setLanguageSelected] = useState(
    !!localStorage.getItem("lang")
  );

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setLanguageSelected(false);
  };

  const handleLanguageSelect = (langCode = "en") => {
    setLoading(true);
    localStorage.setItem("lang", langCode);

    setTimeout(() => {
      setLoading(false);
      setLanguageSelected(true);
    }, 1500);
  };

  const handleLoginSuccess = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setIsAuthenticated(true);
  };

  return (
    <Router>
      {/* 1. Global Visual Elements (Outside logic gates) */}
      <Toaster position="top-center" />
      <BlobCursor /> 

      {/* 2. Initial Selection: Language Gate */}
      {!languageSelected && !loading && (
        <LanguageGate onSelect={handleLanguageSelect} />
      )}

      {/* 3. Global Transitions: Loader */}
      {loading && <Loader />}

      {/* 4. Auth Gate: Login Screen */}
      {languageSelected && !isAuthenticated && !loading && (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}

      {/* 5. Main App: Restricted Content */}
      {languageSelected && isAuthenticated && (
        <div className="relative min-h-screen">
          <Navbar onLogout={handleLogout} />

          {/* Page Routing */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/payments" element={<PaymentPage />} />
            <Route path="/dashboard/notifications" element={<Notification />} />
            <Route
              path="/dashboard/profile"
              element={<Profile onLogout={handleLogout} />}
            />
            <Route path="/dashboard/services" element={<ServiceHistory />} />

            {/* Complaints Flow */}
            <Route path="/complaints" element={<ComplaintService />} />
            <Route
              path="/complaints/:service"
              element={<ComplaintCategories />}
            />
            <Route
              path="/complaints/:service/:type"
              element={<ComplaintForm />}
            />
            <Route
              path="/complaints/status"
              element={<ComplaintStatus />}
            />

            {/* Service & Misc */}
            <Route path="/services/:serviceId" element={<Services />} />
            <Route path="/my-complaints" element={<MyComplaints />} />
            <Route path="/contact" element={<Contacts />} />
          </Routes>

          {/* Persistent AI Assistant */}
          <Chatbot />
        </div>
      )}
    </Router>
  );
};

export default App;