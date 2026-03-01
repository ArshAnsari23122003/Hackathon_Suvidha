import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, ChevronDown, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Profile from "../dashboard/Profile";
import StaggeredMenu from "./StaggeredMenu";

const Navbar = ({ onLogout }) => {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  // --- Scroll Effect for Pill ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Fetch Notification Count ---
  const fetchCount = async () => {
    if (location.pathname === "/dashboard/notifications") {
      setNotifCount(0);
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/notifications");
      const data = await response.json();
      if (data.success) {
        setNotifCount(data.notifications.length);
      }
    } catch (error) {
      console.error("Navbar Notif Error:", error);
    }
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  const navLinks = [
    { key: "home", path: "/" },
    { key: "complaints", path: "/complaints" },
    { key: "payments", path: "/payments" },
    { key: "contact", path: "/contact" },
  ];

  const servicesLinks = [
    { key: "Electricity", path: "/services/electricity" },
    { key: "Gas", path: "/services/gas" },
    { key: "Waste", path: "/services/waste" },
    { key: "Water", path: "/services/water" },
    { key: "Municipal", path: "/services/municipal" },
  ];

  return (
    <div className="fixed w-full top-4 z-[100] px-4 sm:px-8 flex justify-center pointer-events-none font-sans">
      <nav 
        className={`
          pointer-events-auto flex items-center justify-between 
          w-full max-w-7xl px-4 md:px-8 py-2.5 
          rounded-[2rem] border transition-all duration-500
          ${scrolled 
            ? "bg-white/80 backdrop-blur-xl border-gray-200 shadow-[0_8px_32px_rgba(0,0,0,0.08)] py-2" 
            : "bg-white border-transparent shadow-none py-3"
          }
        `}
      >
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform">
            N
          </div>
          <span className="hidden sm:block text-xl font-black text-slate-800 tracking-tighter">
            NAGAR<span className="text-indigo-600">SETU</span>
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-1 lg:gap-4 bg-gray-100/50 p-1.5 rounded-2xl border border-gray-100/50">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                location.pathname === link.path
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-500 hover:text-indigo-600 hover:bg-white/50"
              }`}
            >
              {t(link.key)}
            </Link>
          ))}

          {/* Services Dropdown */}
          <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
            <button
              className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                servicesOpen ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-indigo-600 hover:bg-white/50"
              }`}
            >
              {t("services")} <ChevronDown size={14} className={`transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {servicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 mt-2 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl border border-gray-100 p-2 flex flex-col w-56 overflow-hidden"
                >
                  {servicesLinks.map((service) => (
                    <Link
                      key={service.path}
                      to={service.path}
                      className="hover:bg-indigo-50 hover:text-indigo-600 text-gray-700 px-4 py-3 rounded-xl text-[11px] font-black tracking-wider transition-all"
                      onClick={() => setServicesOpen(false)}
                    >
                      {t(service.key)}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ACTIONS AREA */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search Box */}
          <div className="hidden lg:flex items-center bg-gray-100/80 border border-transparent focus-within:bg-white focus-within:border-indigo-200 px-3 py-2 rounded-xl transition-all">
            <input
              className="w-24 xl:w-32 bg-transparent outline-none placeholder-gray-400 font-bold text-xs"
              type="text"
              placeholder={t("search")}
            />
            <Search size={14} className="text-gray-400" />
          </div>

          {/* Notifications */}
          <Link
            to="/dashboard/notifications"
            className="relative p-2.5 bg-gray-100/80 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all group"
          >
            <Bell size={20} className="group-hover:animate-swing" />
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 text-[10px] text-white bg-rose-500 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-black border-2 border-white shadow-sm">
                {notifCount}
              </span>
            )}
          </Link>

          {/* Profile & Mobile Menu */}
          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <Profile onLogout={onLogout} />
            
            <div className="md:hidden">
              <StaggeredMenu
                accentColor="#4f46e5"
                items={[
                  { label: t("home"), link: "/" },
                  { label: t("complaints"), link: "/complaints" },
                  { label: t("payments"), link: "/payments" },
                  {
                    label: t("services"),
                    type: "services",
                    children: servicesLinks.map((s) => ({
                      label: t(s.key),
                      link: s.path,
                    })),
                  },
                  { label: t("contact"), link: "/contact" },
                ]}
              />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;