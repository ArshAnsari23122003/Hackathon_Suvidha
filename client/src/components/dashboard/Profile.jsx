import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  User, ChevronDown, LogOut, Folder, Clock, AlertTriangle,
  CreditCard, Loader2, Search, RefreshCw, ArrowLeft,
  Filter, MessageSquare, ChevronRight
} from "lucide-react";

const Profile = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [userRequests, setUserRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trackingItem, setTrackingItem] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");

  const dropdownRef = useRef(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchUserHistory = async () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const phone = userData?.phoneNumber || localStorage.getItem("userPhone");
    
    if (!phone) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/user-requests/${phone}`);
      const data = await response.json();
      
      if (data.success) {
        setUserRequests(data.requests);
      } else {
        setUserRequests([]); // Clear if no success
      }
    } catch (err) {
      console.error("API Error:", err);
      setUserRequests([]); // Don't use demo data, show empty state instead
    } finally {
      setLoading(false);
    }
  };

  const refreshStatus = async (srn) => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`http://localhost:5000/api/track/${srn}`);
      const result = await response.json();
      
      if (result.success) {
        setTrackingItem({
          id: srn,
          status: result.status,
          update: result.remarks || "Your application is under process."
        });
        // Update the list as well
        setUserRequests(prev => prev.map(r => 
            r.srn === srn ? { ...r, status: result.status, remarks: result.remarks } : r
        ));
      }
    } catch (err) {
      console.error("Track error:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (openSection === "services") {
      fetchUserHistory();
    }
  }, [openSection]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setOpenSection(null);
        setTrackingItem(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredRequests = userRequests.filter(req => 
    filterStatus === "All" ? true : req.status === filterStatus
  );

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center shadow-sm hover:bg-gray-50 transition"
      >
        <User className="w-5 h-5 text-gray-500" />
      </button>

      <div className={`absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl py-3 transition-all duration-300 ease-out transform origin-top z-50 ${
          isOpen ? "scale-100 opacity-100 visible" : "scale-95 opacity-0 invisible"
        }`}
      >
        {trackingItem ? (
          <div className="px-4 py-2">
            <button 
              onClick={() => setTrackingItem(null)}
              className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 mb-3 hover:bg-indigo-50 p-1 rounded"
            >
              <ArrowLeft size={12}/> {t("Back to History")}
            </button>
            
            <div className="bg-indigo-600 rounded-xl p-4 text-white shadow-lg relative overflow-hidden">
               <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-[9px] font-black opacity-70 uppercase">Current Status</p>
                    <h4 className="text-lg font-black">{trackingItem.status}</h4>
                  </div>
                  <button 
                    onClick={() => refreshStatus(trackingItem.id)}
                    className={`p-2 bg-white/20 rounded-lg transition ${isRefreshing ? 'animate-spin' : 'hover:bg-white/30'}`}
                  >
                    <RefreshCw size={14} />
                  </button>
               </div>
               <p className="text-[10px] font-mono opacity-80">{trackingItem.id}</p>
            </div>

            <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
               <p className="text-[9px] font-bold text-amber-600 uppercase mb-1">Remarks / Next Steps</p>
               <p className="text-xs text-slate-700 leading-tight">{trackingItem.update}</p>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={() => setOpenSection(openSection === "services" ? null : "services")}
              className="w-full flex justify-between items-center px-4 py-3 text-sm font-bold text-gray-700 hover:bg-slate-50 transition-all"
            >
              <div className="flex items-center gap-3">
                <Folder size={18} className="text-indigo-500" />
                {t("Services History")}
              </div>
              <ChevronDown size={16} className={`transition-transform ${openSection === "services" ? "rotate-180" : ""}`} />
            </button>

            {openSection === "services" && (
              <div className="mx-2 bg-slate-50/50 rounded-xl border border-slate-100 overflow-hidden mb-2">
                <div className="flex gap-1 p-2 bg-white border-b border-slate-100">
                    {["All", "Pending", "Approved", "Rejected"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`flex-1 py-1 text-[9px] font-black rounded-md transition-all ${
                                filterStatus === s ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-500'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <div className="max-h-48 overflow-y-auto">
                    {loading ? (
                      <div className="flex justify-center py-6"><Loader2 className="animate-spin text-indigo-500" size={20} /></div>
                    ) : filteredRequests.length > 0 ? (
                      filteredRequests.map((req) => (
                        <div key={req.srn} className="p-3 border-b border-slate-100 last:border-0 hover:bg-white transition group">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-mono font-bold text-indigo-600">{req.srn}</span>
                            <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase ${
                              req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                              req.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {req.status}
                            </span>
                          </div>
                          <div className="text-[11px] font-bold text-slate-800 truncate mb-2">{req.formType}</div>
                          <button 
                            onClick={() => {
                                setTrackingItem({ id: req.srn, status: req.status, update: req.remarks });
                                refreshStatus(req.srn);
                            }}
                            className="w-full py-1.5 bg-indigo-50 rounded-lg text-[9px] font-black text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-1 shadow-sm"
                          >
                            <Search size={10} /> {t("Track Status")}
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <p className="text-[10px] text-slate-400 font-bold italic">No service history found.</p>
                      </div>
                    )}
                </div>
              </div>
            )}

            {/* ... rest of your UI (Complaints and Fines buttons) ... */}
            <button
              onClick={() => navigate("/my-complaints")}
              className="w-full flex justify-between items-center px-4 py-3 text-sm font-bold text-gray-700 hover:bg-slate-50 transition-all"
            >
              <div className="flex items-center gap-3">
                <MessageSquare size={18} className="text-purple-500" />
                {t("My Complaints")}
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </button>

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut size={18} />
              {t("Logout")}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;