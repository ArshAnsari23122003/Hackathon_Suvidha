import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { 
  AlertTriangle, Clock, CreditCard, ChevronRight, Droplets, Zap, 
  Trash2, Flame, Building2, ArrowLeft, User, Filter, Search, RefreshCw, MapPin, Navigation
} from "lucide-react";

const complaintTypes = {
  electricity: ["No Supply", "Wrong Billing", "Meter Reading Issue", "Service Delay", "Emergency Reporting", "Others"],
  water: ["No Water Supply", "Leakage", "Contaminated Water", "Low Pressure", "Service Delay", "Others"],
  waste: ["Garbage Not Collected", "Overflowing Bin", "Missed Pickup", "Illegal Dumping", "Service Delay", "Others"],
  gas: ["Gas Leakage", "No Gas Supply", "Billing Issue", "Emergency Reporting", "Connection Delay", "Others"],
  municipal: ["Streetlight Issue", "Drainage Problem", "Encroachment", "Public Safety Issue", "Service Delay", "Others"],
};

const STATUS_OPTIONS = ["Pending", "Under Consideration", "Assigned to Department", "Completed", "Rejected"];

const getIcon = (type) => {
  const t = type.toLowerCase();
  if (t.includes("emergency") || t.includes("leakage") || t.includes("safety")) return <AlertTriangle className="text-red-500" size={18} />;
  if (t.includes("billing") || t.includes("reading")) return <CreditCard className="text-blue-500" size={18} />;
  if (t.includes("delay")) return <Clock className="text-amber-500" size={18} />;
  return <ChevronRight className="text-violet-400" size={18} />;
};

const getStatusBadge = (status) => {
  switch (status) {
    case "Completed": return "bg-emerald-100 text-emerald-600 border border-emerald-200";
    case "Rejected": return "bg-red-100 text-red-600 border border-red-200";
    case "Assigned to Department": return "bg-blue-100 text-blue-600 border border-blue-200";
    case "Under Consideration": return "bg-amber-100 text-amber-600 border border-amber-200";
    default: return "bg-violet-100 text-violet-600 border border-violet-200";
  }
};

const AdminComplaint = ({ selectedDept, setSelectedDept, selectedCategory, setSelectedCategory }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/complaints/admin/all");
      setComplaints(res.data.complaints || res.data); 
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const updateStatus = async (srn, newStatus) => {
    try {
      await axios.patch("http://localhost:5000/api/complaints/update-status", {
        srn,
        status: newStatus,
        remarks: `Update: Internal Departmental Status changed to ${newStatus}`
      });
      fetchComplaints(); 
    } catch (err) {
      alert("Update failed. Check server connection.");
    }
  };

  const handleOpenMap = (c) => {
    // Priority: 1. GPS Coordinates, 2. Text Location
    const mapUrl = (c.coordinates && c.coordinates.lat) 
      ? `https://www.google.com/maps?q=${c.coordinates.lat},${c.coordinates.lng}`
      : `https://www.google.com/maps/search/${encodeURIComponent(c.location)}`;
    window.open(mapUrl, "_blank");
  };

  // 1. SELECT DEPARTMENT VIEW
  if (!selectedDept) {
    const departmentConfig = {
      electricity: { icon: <Zap className="text-amber-500" size={28} /> },
      water: { icon: <Droplets className="text-blue-500" size={28} /> },
      waste: { icon: <Trash2 className="text-emerald-500" size={28} /> },
      gas: { icon: <Flame className="text-rose-500" size={28} /> },
      municipal: { icon: <Building2 className="text-violet-500" size={28} /> },
    };

    return (
      <div className="p-10 bg-slate-50 min-h-screen pt-32">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">Admin <span className="text-violet-600">Portal</span></h1>
            <p className="text-slate-500 mt-4 text-lg font-medium">Select a department to manage citizen requests.</p>
          </div>
          <button onClick={fetchComplaints} className="p-4 bg-white rounded-2xl shadow-lg hover:shadow-violet-200 transition-all active:scale-95">
            <RefreshCw size={24} className={`${loading ? 'animate-spin' : ''} text-violet-600`} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.keys(complaintTypes).map((dept) => (
            <div key={dept} onClick={() => setSelectedDept(dept)} className="group cursor-pointer bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 hover:border-violet-400 hover:shadow-violet-200 transition-all flex flex-col items-center text-center gap-6">
              <div className="p-6 bg-violet-50 rounded-3xl group-hover:bg-violet-600 group-hover:text-white transition-all duration-500">
                {departmentConfig[dept]?.icon || <Building2/>}
              </div>
              <h3 className="font-black text-slate-800 text-2xl capitalize tracking-tight group-hover:text-violet-600 transition-colors">{dept}</h3>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. SELECT CATEGORY VIEW
  if (selectedDept && !selectedCategory) {
    return (
      <div className="p-10 bg-slate-50 min-h-screen pt-32">
        <button onClick={() => setSelectedDept(null)} className="flex items-center gap-2 text-violet-600 font-black text-sm uppercase tracking-widest mb-8 hover:-translate-x-1 transition-transform">
          <ArrowLeft size={20} /> Back to Departments
        </button>
        <div className="mb-12">
            <h1 className="text-5xl font-black text-slate-900 capitalize tracking-tight">{selectedDept} <span className="text-violet-400 font-light underline decoration-violet-200">Issues</span></h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {complaintTypes[selectedDept].map((type, index) => (
            <div key={index} onClick={() => setSelectedCategory(type)} className="group cursor-pointer bg-white border border-slate-100 p-8 rounded-[2rem] shadow-xl hover:border-violet-400 hover:shadow-violet-200 transition-all flex justify-between items-center">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-violet-50 rounded-2xl group-hover:bg-violet-100 transition-colors">{getIcon(type)}</div>
                <h3 className="font-bold text-slate-800 text-lg">{type}</h3>
              </div>
              <ChevronRight className="text-violet-200 group-hover:text-violet-600 group-hover:translate-x-2 transition-all" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. TABLE VIEW (Filtered Data)
  const filtered = complaints.filter((c) => {
    const deptMatch = c.dept?.toLowerCase() === selectedDept.toLowerCase();
    const catMatch = c.category?.toLowerCase() === selectedCategory.toLowerCase();
    const statusMatch = filter === "All" || c.status === filter;
    const searchMatch = c.srn?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       c.citizen?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return deptMatch && catMatch && statusMatch && searchMatch;
  });

  return (
    <div className="p-10 bg-slate-50 min-h-screen pt-32">
      <button onClick={() => setSelectedCategory(null)} className="flex items-center gap-2 text-violet-600 font-black text-sm uppercase tracking-widest mb-8 hover:-translate-x-1 transition-transform">
        <ArrowLeft size={20} /> Back to Categories
      </button>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">{selectedCategory}</h2>
            <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">{selectedDept} Management Console</p>
            </div>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
          <div className="flex flex-1 items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200 focus-within:border-violet-400 transition-all">
            <Search size={18} className="text-slate-400" />
            <input type="text" placeholder="Search SRN or Citizen..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent focus:outline-none text-sm font-bold w-full" />
          </div>

          <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-sm border border-slate-200">
            <Filter size={18} className="text-violet-400" />
            <select onChange={(e) => setFilter(e.target.value)} className="bg-transparent pr-4 text-slate-700 font-black text-xs uppercase tracking-wider focus:outline-none cursor-pointer">
              <option value="All">All Statuses</option>
              {STATUS_OPTIONS.map((status, i) => <option key={i} value={status}>{status}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-violet-900/5 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-white">
                <tr>
                    <th className="px-8 py-6 font-black text-[10px] uppercase tracking-[0.2em]">Reference No</th>
                    <th className="px-8 py-6 font-black text-[10px] uppercase tracking-[0.2em]">Citizen Details</th>
                    <th className="px-8 py-6 font-black text-[10px] uppercase tracking-[0.2em]">Live Location</th>
                    <th className="px-8 py-6 font-black text-[10px] uppercase tracking-[0.2em]">Current Status</th>
                    <th className="px-8 py-6 font-black text-[10px] uppercase tracking-[0.2em] text-center">Admin Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length > 0 ? (
                  filtered.map((c) => (
                    <tr key={c.srn} className="hover:bg-violet-50/30 transition-colors group">
                      <td className="px-8 py-6 font-mono font-black text-violet-600 text-sm">{c.srn}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3 font-black text-slate-700">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-violet-100 group-hover:text-violet-600 transition-colors">
                                <User size={14} /> 
                            </div>
                            {c.citizen}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <button 
                            onClick={() => handleOpenMap(c)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all shadow-sm"
                        >
                            <Navigation size={12} />
                            {c.coordinates ? "GPS Pinned" : "Open Map"}
                        </button>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusBadge(c.status)}`}>
                            {c.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center">
                          <select 
                            value={c.status} 
                            onChange={(e) => updateStatus(c.srn, e.target.value)} 
                            className="px-4 py-2 bg-white border-2 border-slate-100 rounded-xl text-[11px] font-black text-slate-700 outline-none cursor-pointer focus:border-violet-400 transition-all shadow-sm"
                          >
                            {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-32 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                <AlertTriangle size={32} />
                            </div>
                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No records found for this criteria.</p>
                        </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default AdminComplaint;