import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/search/user-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      if (data.success) {
        setResults(data.data);
        setUserData(data.userData);
        toast.success("Records Loaded");
      } else {
        setResults([]);
        setUserData(null);
        toast.error("No records found");
      }
    } catch (err) {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (srn, newStatus) => {
    const remarks = prompt("Enter remarks for user SMS:");
    if (remarks === null) return;
    try {
      const res = await fetch('http://localhost:5000/api/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ srn, newStatus, remarks }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Updated & SMS Sent!");
        handleSearch(); 
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <Toaster />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900 mb-2">Resolution Center</h1>
        <p className="text-slate-500 mb-8">Search registered users to manage their utility services.</p>
        
        <form onSubmit={handleSearch} className="flex gap-4 mb-10">
          <input 
            className="flex-1 h-16 px-6 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 outline-none text-lg shadow-sm"
            placeholder="Search Phone, Aadhaar, or SRN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="px-10 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg">
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {userData && (
          <div className="bg-indigo-900 text-white p-8 rounded-3xl mb-8 shadow-xl animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-black italic">
                {userData.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{userData.name}</h2>
                <div className="flex gap-4 mt-1 opacity-70 text-sm font-medium">
                  <span>📞 {userData.phoneNumber}</span>
                  <span>🆔 Aadhaar: {userData.aadhaar}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6">
          {results.map((req) => (
            <div key={req.srn} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 px-2 py-1 rounded-md">{req.formType}</span>
                  <p className="text-sm font-mono font-bold text-slate-500 mt-1">{req.srn}</p>
                </div>
                <span className={`px-4 py-1 rounded-full text-xs font-black uppercase ${
                  req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                }`}>{req.status}</span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {Object.entries(req.details).map(([k, v]) => (
                    <div key={k} className="border-b border-slate-50 pb-2">
                      <p className="text-[10px] uppercase font-bold text-slate-400">{k.replace('_', ' ')}</p>
                      <p className="text-sm font-semibold text-slate-700">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => updateStatus(req.srn, 'Approved')} className="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all">Approve</button>
                  <button onClick={() => updateStatus(req.srn, 'Rejected')} className="flex-1 py-3 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-all">Reject</button>
                  {req.pdfPath && (
                    <button onClick={() => window.open(`http://localhost:5000/${req.pdfPath}`)} className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl">PDF</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;