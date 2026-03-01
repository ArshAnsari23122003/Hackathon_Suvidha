import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ComplaintStatus = () => {
  const { id } = useParams(); // Automatically get token from URL if redirected
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState(id || "");
  const [isSearching, setIsSearching] = useState(false);
  const [requestData, setRequestData] = useState(null);

  // Mock tracking steps
  const steps = [
    { label: "Complaint Registered", date: "24 Feb 2026", completed: true },
    { label: "Assigned to Zonal Officer", date: "25 Feb 2026", completed: true },
    { label: "On-site Verification", date: "Pending", completed: false },
    { label: "Resolution & Closure", date: "TBA", completed: false },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchId) return;
    setIsSearching(true);
    
    // Simulate API Fetch
    setTimeout(() => {
      setRequestData({
        id: searchId,
        status: "In Progress",
        type: "Meter Fault",
        lastUpdate: "2 hours ago"
      });
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen py-16 px-4 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-100 via-white to-purple-50">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-10 text-center">
          <motion.button 
            whileHover={{ x: -5 }}
            onClick={() => navigate("/")} 
            className="text-purple-600 font-bold text-sm mb-4 inline-flex items-center"
          >
            ← Back to Dashboard
          </motion.button>
          <h1 className="text-4xl font-black text-purple-950 tracking-tight">Track Request</h1>
          <p className="text-slate-500 mt-2">Check the real-time status of your application</p>
        </header>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-10">
          <div className="relative flex items-center bg-white shadow-xl rounded-2xl p-2 border border-purple-100">
            <input 
              type="text" 
              placeholder="Enter SRN (e.g. SRN-12345678)"
              className="w-full px-6 py-4 bg-transparent outline-none font-mono text-purple-700 font-bold"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-purple-700 transition-all disabled:opacity-50"
              disabled={isSearching}
            >
              {isSearching ? "Searching..." : "Track"}
            </button>
          </div>
        </form>

        {/* Results View */}
        {requestData && !isSearching && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-md border border-purple-200 shadow-2xl rounded-2xl p-8"
          >
            <div className="flex justify-between items-start mb-8 border-b border-purple-50 pb-6">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Request Status</p>
                <h2 className="text-2xl font-extrabold text-purple-950">{requestData.status}</h2>
              </div>
              <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-xs font-black uppercase">
                ID: {requestData.id}
              </div>
            </div>

            {/* Visual Timeline */}
            <div className="space-y-8 relative">
              <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-100" />
              {steps.map((step, index) => (
                <div key={index} className="relative flex items-start pl-10">
                  <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center z-10 border-4 border-white shadow-sm ${step.completed ? 'bg-purple-600' : 'bg-slate-200'}`}>
                    {step.completed && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <div>
                    <h4 className={`font-bold ${step.completed ? 'text-purple-950' : 'text-slate-400'}`}>{step.label}</h4>
                    <p className="text-xs text-slate-500 font-medium">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-purple-50 flex items-center justify-between">
              <p className="text-sm text-slate-500">Last update: <b>{requestData.lastUpdate}</b></p>
              <button className="text-purple-600 font-bold text-sm hover:underline">Download Receipt (PDF)</button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ComplaintStatus;