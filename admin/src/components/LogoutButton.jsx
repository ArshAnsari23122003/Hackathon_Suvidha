import React from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LogoutButton = ({ isCollapsed }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Clear your auth data here
    // localStorage.removeItem("adminToken");
    // sessionStorage.clear();

    // 2. Redirect to login page
    navigate("/login"); 
  };

  return (
    <button
      onClick={handleLogout}
      className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all text-rose-100 hover:bg-rose-500/20 hover:text-rose-400 mt-auto mb-4`}
    >
      <LogOut size={20} />
      {!isCollapsed && <span className="hidden lg:block">Logout</span>}
    </button>
  );
};

export default LogoutButton;