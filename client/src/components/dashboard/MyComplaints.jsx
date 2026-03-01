import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ArrowLeft, MessageSquare, Clock, RefreshCw, AlertCircle, ShieldCheck, MapPin, Navigation, CheckCircle2 } from "lucide-react";

const MyComplaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshingId, setRefreshingId] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }

    const loadData = async () => {
      // Get user phone from your Auth state or LocalStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.phoneNumber) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/complaints/user/${user.phoneNumber}`);
        setComplaints(res.data.complaints);
      } catch (err) {
        console.error("Error fetching user complaints");
      }
      setLoading(false);
    };
    
    loadData();
  }, []);

  const trackStatus = async (id) => {
    setRefreshingId(id);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    try {
      const res = await axios.get(`http://localhost:5000/api/complaints/user/${user.phoneNumber}`);
      setComplaints(res.data.complaints);
    } catch (err) {
      console.error(err);
    }
    setTimeout(() => setRefreshingId(null), 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-emerald-500";
      case "Pending": return "bg-amber-500";
      case "Rejected": return "bg-rose-500";
      default: return "bg-purple-600";
    }
  };

  return (
    <div className="min-h-screen py-16 px-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-100 via-white to-purple-50">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <motion.button whileHover={{ x: -5 }} onClick={() => navigate("/")} className="flex items-center text-purple-600 font-bold text-sm mb-6 group">
            <ArrowLeft size={18} className="mr-2 transition-transform group-hover:-translate-x-1" /> Back to Dashboard
          </motion.button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl font-black text-purple-950 tracking-tight flex items-center gap-3">
                My <span className="text-purple-400 font-light">Complaints</span>
                <MessageSquare className="text-purple-600 hidden md:block" size={32} />
              </h1>
              <p className="text-slate-500 mt-2 font-medium">Track the real-time progress of your reported issues.</p>
            </motion.div>

            {currentLocation && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl border border-emerald-100 text-xs font-black">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
                GPS ACTIVE: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
              </motion.div>
            )}
          </div>
        </header>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {["Pending", "Under Consideration", "Completed"].map((s) => (
            <div key={s} className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-purple-100 shadow-sm text-[10px] font-black uppercase text-slate-500 whitespace-nowrap">
              <span className={`w-2 h-2 rounded-full ${getStatusColor(s)}`}></span> {s}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw className="animate-spin text-purple-600 mb-4" size={40} />
              <p className="text-purple-900/50 font-bold">Fetching your records...</p>
            </div>
          ) : complaints.length > 0 ? (
            <AnimatePresence>
              {complaints.map((item, index) => (
                <motion.div key={item.srn} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="group bg-white/80 backdrop-blur-md border border-purple-100 rounded-3xl p-6 md:p-8 shadow-xl shadow-purple-900/5 hover:shadow-purple-900/10 hover:border-purple-300 transition-all">
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-[10px] font-black uppercase tracking-wider border border-purple-100">{item.dept}</span>
                        <span className="text-slate-400 font-mono text-xs">{item.srn}</span>
                        {item.status === "Completed" && <CheckCircle2 size={16} className="text-emerald-500" />}
                      </div>
                      <h2 className="text-2xl font-black text-slate-800 mb-2 group-hover:text-purple-900 transition-colors">{item.category}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium"><MapPin size={16} className="text-purple-400" /> {item.location}</div>
                        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium"><Clock size={16} className="text-purple-400" /> Filed on {item.date}</div>
                      </div>
                      <div className="p-4 bg-purple-50/50 rounded-2xl border border-dashed border-purple-200">
                        <p className="text-xs text-purple-900/70 font-bold uppercase mb-1 flex items-center gap-1"><ShieldCheck size={12}/> Latest Update</p>
                        <p className="text-sm text-slate-600 font-medium italic">"{item.remarks}"</p>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-center lg:items-end gap-4 lg:min-w-[200px]">
                      <div className="text-center lg:text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Status</p>
                        <div className={`px-4 py-1.5 rounded-full text-white text-xs font-black shadow-lg ${getStatusColor(item.status)}`}>{item.status}</div>
                      </div>
                      <div className="w-full space-y-2">
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => trackStatus(item.srn)} disabled={refreshingId === item.srn} className="w-full flex items-center justify-center gap-2 bg-purple-950 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-purple-800 transition-all disabled:opacity-50">
                          <RefreshCw size={18} className={refreshingId === item.srn ? "animate-spin" : ""} />
                          {refreshingId === item.srn ? "Syncing Tracking..." : "Refresh Tracking"}
                        </motion.button>
                        <button onClick={() => item.coordinates && window.open(`https://www.google.com/maps?q=${item.coordinates.lat},${item.coordinates.lng}`)} className="w-full flex items-center justify-center gap-2 text-purple-600 bg-purple-50 py-3 rounded-2xl text-xs font-black hover:bg-purple-100 transition-colors">
                           <Navigation size={14} /> View Location on Map
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-purple-200">
              <div className="bg-purple-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"><AlertCircle size={40} className="text-purple-300" /></div>
              <h3 className="text-2xl font-bold text-purple-900">No Active Complaints</h3>
              <p className="text-slate-500 max-w-sm mx-auto mt-2 font-medium">Everything looks good! If you find a new issue, you can file it through the services menu.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyComplaints;