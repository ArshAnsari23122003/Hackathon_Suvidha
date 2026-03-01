import React, { useState, useEffect } from "react";
import {
  Droplets, Zap, Trash2, Flame, Building2, CheckCircle2,
  XCircle, Eye, Search, Loader2, ArrowLeft, RefreshCw
} from "lucide-react";

const getParentCategory = (formKey, dept) => {
  if (!formKey || !dept) return "Other";
  const key = formKey.trim();

  const mapping = {
    "Apply New": { electricity: "Account Management", water: "New Connection", gas: "PNG Registration" },
    "New Connection": { electricity: "Account Management", water: "New Connection", gas: "PNG Registration" },
    "Link Existing": { electricity: "Account Management", water: "New Connection" },
    "Profile Settings": { electricity: "Account Management", gas: "PNG Registration" },
    "Update Name": { electricity: "Billing and Name Change", municipal: "Municipal Services" },
    "Change Name": { electricity: "Billing and Name Change", municipal: "Municipal Services" },
    "Change Address": { electricity: "Billing and Name Change", municipal: "Municipal Services" },
    "Update Address": { electricity: "Billing and Name Change", municipal: "Municipal Services" },
    "Track Request": { electricity: "Billing and Name Change", municipal: "Municipal Services" },
    "Check Tariff": { electricity: "Tariff Category" },
    "Modify Category": { electricity: "Tariff Category" },
    "Rate Calculator": { electricity: "Tariff Category" },
    "Request Install": { electricity: "Meter Support" },
    "Meter Installation": { electricity: "Meter Support" },
    "Deactivation Form": { electricity: "Meter Support", gas: "Gas Support" },
    "Technical Support": { electricity: "Meter Support", water: "Water Support", gas: "Gas Support" },
    "Waste Collection": { waste: "Waste Management" },
    "Garbage Pickup": { waste: "Waste Management" }
  };
  
  return mapping[key]?.[dept] || "Other";
};

const getStatusBadge = (status) => {
  const map = {
    Approved: "bg-emerald-100 text-emerald-700",
    Pending: "bg-amber-100 text-amber-700",
    Rejected: "bg-rose-100 text-rose-700",
  };
  return (
    <span className={`px-3 py-1 text-xs font-bold rounded-full ${map[status] || "bg-slate-100 text-slate-600"}`}>
      {status || "Pending"}
    </span>
  );
};

const AdminServices = () => {
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [requests, setRequests] = useState([]);
  const [searchSRN, setSearchSRN] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/admin/all-requests");
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: Make sure the route /api/admin/all-requests exists.`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Backend returned HTML instead of JSON. Check your API route path.");
      }

      const data = await response.json();
      if (data.success) {
        setRequests(data.requests);
      }
    } catch (err) {
      console.error("Fetch error details:", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleUpdateStatus = async (srn, newStatus) => {
    const remarks = prompt(`Enter remarks for ${newStatus}:`);
    if (remarks === null) return;
    try {
      const res = await fetch("http://localhost:5000/api/admin/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ srn, newStatus, remarks }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Status Updated Successfully!");
        fetchRequests(true);
      }
    } catch (err) { 
        alert("Update failed. Check console."); 
    }
  };

  const filtered = requests.filter((r) => {
    const rCategory = getParentCategory(r.formType, selectedDept);
    const matchesDept = selectedDept ? (rCategory !== "Other" || r.department === selectedDept) : true;
    const matchesService = selectedService ? rCategory === selectedService : true;
    const matchesSearch = r.srn?.toLowerCase().includes(searchSRN.toLowerCase());
    return matchesDept && matchesService && matchesSearch;
  });

  if (!selectedDept) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-black text-slate-900">Admin <span className="font-light">Dashboard</span></h1>
          <div className="flex gap-4 items-center">
            <button onClick={() => fetchRequests(true)} className={`p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition ${refreshing ? 'animate-spin' : ''}`}>
                <RefreshCw size={20} className="text-indigo-600" />
            </button>
            <div className="relative w-80">
                <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input 
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-indigo-500"
                  placeholder="Search by SRN..."
                  value={searchSRN}
                  onChange={(e) => setSearchSRN(e.target.value)}
                />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { id: "electricity", icon: <Zap />, color: "text-amber-500" },
              { id: "water", icon: <Droplets />, color: "text-blue-500" },
              { id: "gas", icon: <Flame />, color: "text-rose-500" },
              { id: "waste", icon: <Trash2 />, color: "text-emerald-500" },
              { id: "municipal", icon: <Building2 />, color: "text-violet-500" }
            ].map(d => (
              <div key={d.id} onClick={() => setSelectedDept(d.id)} className="group bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl cursor-pointer transition-all flex items-center gap-6 border border-transparent hover:border-indigo-100">
                <div className={`p-4 rounded-2xl bg-slate-50 group-hover:scale-110 transition-transform ${d.color}`}>{d.icon}</div>
                <div><h3 className="text-xl font-bold capitalize">{d.id}</h3><p className="text-xs text-slate-400 font-bold">Manage Requests</p></div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (selectedDept && !selectedService) {
    const deptServices = {
      electricity: ["Account Management", "Billing and Name Change", "Tariff Category", "Meter Support"],
      water: ["New Connection", "Water Support"],
      gas: ["PNG Registration", "Gas Support"],
      waste: ["Waste Management"],
      municipal: ["Municipal Services"]
    };
    return (
      <div className="min-h-screen bg-[#f8fafc] p-12">
        <div className="flex justify-between items-start mb-8">
            <button onClick={() => setSelectedDept(null)} className="flex items-center gap-2 text-indigo-600 font-bold hover:opacity-70 transition"><ArrowLeft size={20}/> Back</button>
            <button onClick={() => fetchRequests(true)} className={`flex items-center gap-2 text-xs font-black text-slate-400 hover:text-indigo-600 transition ${refreshing ? 'animate-spin' : ''}`}><RefreshCw size={14}/> REFRESH</button>
        </div>
        <h1 className="text-5xl font-black capitalize mb-12 text-slate-900">{selectedDept}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deptServices[selectedDept]?.map(title => {
            const count = requests.filter(r => getParentCategory(r.formType, selectedDept) === title).length;
            return (
                <div key={title} onClick={() => setSelectedService(title)} className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-md cursor-pointer transition-all flex justify-between items-center border-2 border-transparent hover:border-indigo-500">
                    <span className="font-bold text-xl text-slate-800">{title}</span>
                    <div className={`px-4 py-2 rounded-xl text-sm font-black uppercase ${count > 0 ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400'}`}>{count} Requests</div>
                </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-12">
      <div className="flex justify-between items-start mb-8">
        <button onClick={() => setSelectedService(null)} className="flex items-center gap-2 text-indigo-600 font-bold hover:opacity-70"><ArrowLeft size={20}/> Back</button>
        <button onClick={() => fetchRequests(true)} className={`p-2 bg-indigo-600 text-white rounded-full shadow-lg transition-all ${refreshing ? 'animate-spin' : ''}`}><RefreshCw size={18}/></button>
      </div>
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-4xl font-black text-slate-900">{selectedService}</h2>
        <p className="text-slate-400 font-bold bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">{filtered.length} Applications</p>
      </div>
      <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-6 font-black text-slate-500 text-xs tracking-widest uppercase">SRN & Form</th>
              <th className="p-6 font-black text-slate-500 text-xs tracking-widest uppercase">Citizen Details</th>
              <th className="p-6 font-black text-slate-500 text-xs tracking-widest uppercase">Status</th>
              <th className="p-6 font-black text-slate-500 text-xs tracking-widest uppercase text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(r => (
              <tr key={r.srn} className="hover:bg-indigo-50/30 transition-colors">
                <td className="p-6">
                  <div className="font-mono font-bold text-indigo-600 mb-1">{r.srn}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase">{r.formType}</div>
                </td>
                <td className="p-6">
                  <div className="font-bold text-slate-800">{r.details?.full_name || r.details?.name || "N/A"}</div>
                  <div className="text-sm text-slate-500 font-medium">{r.details?.phone || r.details?.contact_number || "No Contact"}</div>
                </td>
                <td className="p-6">{getStatusBadge(r.status)}</td>
                <td className="p-6">
                   <div className="flex justify-center gap-2">
                    {r.pdfPath && (
                        <button onClick={() => window.open(`http://localhost:5000/${r.pdfPath}`, '_blank')} className="p-3 bg-slate-100 rounded-2xl hover:bg-indigo-600 hover:text-white text-indigo-600 transition-all"><Eye size={20}/></button>
                    )}
                    <button onClick={() => handleUpdateStatus(r.srn, "Approved")} className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all"><CheckCircle2 size={20}/></button>
                    <button onClick={() => handleUpdateStatus(r.srn, "Rejected")} className="p-3 bg-rose-50 rounded-2xl text-rose-600 hover:bg-rose-600 hover:text-white transition-all"><XCircle size={20}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
            <div className="p-24 text-center">
                <Search className="text-slate-300 mx-auto mb-4" size={32} />
                <p className="text-slate-400 font-bold text-lg">No records found.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminServices;