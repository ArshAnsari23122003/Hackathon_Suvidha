import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Settings,
  Bell,
  LayoutDashboard,
  ArrowLeft,
  Droplets,
  Zap,
  Trash2,
  Flame,
  Building2,
  Sparkles,
  LogOut,
  Users, // Added this for the Citizens/Users tab
  User   // Added this to fix your ReferenceError
} from "lucide-react";

// Components
import AdminComplaint from "./AdminComplaint";
import AdminServices from "./AdminServices";
import AdminNotification from "./AdminNotification";
import AdminUsers from "./AdminUsers";

const AdminHome = () => {
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState("home");
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    sessionStorage.clear();
    navigate("/login"); 
  };

  const handleBack = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    } else if (selectedDept) {
      setSelectedDept(null);
    }
  };

  const getTitle = () => {
    if (mainTab === "home") return "Dashboard";
    if (mainTab === "services") return "Services Management";
    if (mainTab === "notifications") return "Notifications Center";
    if (mainTab === "users") return "Citizen Directory";
    if (mainTab !== "complaints") return mainTab;
    if (selectedCategory) return selectedCategory;
    if (selectedDept) return selectedDept;
    return "Complaints";
  };

  const renderHome = () => {
    return (
      <div className="p-12 bg-gradient-to-br from-violet-50 via-white to-purple-50 min-h-screen">
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <Sparkles className="text-violet-500" size={40} />
            <h1 className="text-5xl font-black text-black">
              Welcome to Nagar-Setu Admin
            </h1>
          </div>
          <p className="text-slate-600 text-lg max-w-3xl font-medium">
            Manage citizen services, complaints, and notifications efficiently
            through a centralized administrative dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            onClick={() => setMainTab("complaints")}
            className="cursor-pointer bg-white border border-violet-200 rounded-3xl p-8 shadow-xl hover:shadow-violet-200 hover:border-violet-400 transition-all"
          >
            <MessageSquare className="text-violet-500 mb-4" size={32} />
            <h3 className="text-xl font-bold text-violet-600">Complaints</h3>
            <p className="text-slate-500 mt-2 text-sm">Review citizen grievances.</p>
          </div>

          <div
            onClick={() => setMainTab("users")}
            className="cursor-pointer bg-white border border-indigo-200 rounded-3xl p-8 shadow-xl hover:shadow-indigo-200 hover:border-indigo-400 transition-all"
          >
            <Users className="text-indigo-500 mb-4" size={32} />
            <h3 className="text-xl font-bold text-indigo-600">Citizens</h3>
            <p className="text-slate-500 mt-2 text-sm">Manage registered users.</p>
          </div>

          <div
            onClick={() => setMainTab("services")}
            className="cursor-pointer bg-white border border-blue-200 rounded-3xl p-8 shadow-xl hover:shadow-blue-200 hover:border-blue-400 transition-all"
          >
            <Settings className="text-blue-500 mb-4" size={32} />
            <h3 className="text-xl font-bold text-blue-600">Services</h3>
            <p className="text-slate-500 mt-2 text-sm">Handle service requests.</p>
          </div>

          <div
            onClick={() => setMainTab("notifications")}
            className="cursor-pointer bg-white border border-emerald-200 rounded-3xl p-8 shadow-xl hover:shadow-emerald-200 hover:border-emerald-400 transition-all"
          >
            <Bell className="text-emerald-500 mb-4" size={32} />
            <h3 className="text-xl font-bold text-emerald-600">Alerts</h3>
            <p className="text-slate-500 mt-2 text-sm">Send broadcast messages.</p>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-2">
            <Building2 className="text-violet-600" /> Departments Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { name: "Water", icon: <Droplets />, color: "text-blue-500" },
              { name: "Electricity", icon: <Zap />, color: "text-amber-500" },
              { name: "Waste", icon: <Trash2 />, color: "text-emerald-500" },
              { name: "Gas", icon: <Flame />, color: "text-rose-500" },
              { name: "Municipal", icon: <Building2 />, color: "text-violet-500" },
            ].map((dept, index) => (
              <div
                key={index}
                className="bg-white border border-slate-100 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all flex flex-col items-center"
              >
                <div className={`mb-3 ${dept.color}`}>
                  {React.cloneElement(dept.icon, { size: 28 })}
                </div>
                <h4 className="font-bold text-slate-700">{dept.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (mainTab) {
      case "home": return renderHome();
      case "complaints":
        return (
          <AdminComplaint
            selectedDept={selectedDept}
            setSelectedDept={setSelectedDept}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        );
      case "services": return <AdminServices />;
      case "notifications": return <AdminNotification />;
      case "users": return <AdminUsers />;
      default: return renderHome();
    }
  };

  return (
    <div className="flex h-screen bg-violet-50 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-24 lg:w-72 bg-violet-800 text-white flex flex-col shrink-0">
        <div className="p-8">
          <h1 className="text-xl font-black hidden lg:flex items-center gap-2 tracking-tighter">
            <LayoutDashboard className="text-violet-300" /> NAGAR-SETU <span className="text-violet-400 font-light">ADMIN</span>
          </h1>
          <div className="lg:hidden text-2xl font-black text-center">N</div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: "home", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
            { id: "users", label: "Citizens", icon: <Users size={20} /> },
            { id: "complaints", label: "Complaints", icon: <MessageSquare size={20} /> },
            { id: "services", label: "Services", icon: <Settings size={20} /> },
            { id: "notifications", label: "Notifications", icon: <Bell size={20} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setMainTab(item.id);
                setSelectedDept(null);
                setSelectedCategory(null);
              }}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all ${
                mainTab === item.id ? "bg-violet-600 shadow-xl border-l-4 border-white" : "hover:bg-white/10 text-violet-100"
              }`}
            >
              {item.icon}
              <span className="hidden lg:block">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-violet-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all text-rose-300 hover:bg-rose-600 hover:text-white"
          >
            <LogOut size={20} />
            <span className="hidden lg:block">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto">
        {mainTab !== "home" && (
          <header className="bg-white border-b border-violet-100 px-10 py-6 flex items-center gap-4 sticky top-0 z-20 shadow-sm">
            {((selectedDept || selectedCategory) && mainTab === "complaints") && (
              <button
                onClick={handleBack}
                className="p-2 rounded-full hover:bg-violet-100 transition text-violet-600"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-2xl font-black text-slate-800 capitalize tracking-tight">
              {getTitle()}
            </h2>
          </header>
        )}
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminHome;