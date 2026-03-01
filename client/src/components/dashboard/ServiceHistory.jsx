import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { Clock, CheckCircle2, XCircle, RefreshCcw } from "lucide-react";

const ServiceHistory = () => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Retrieve user data safely
  const userData = JSON.parse(localStorage.getItem("user"));
  const userPhone = userData?.phoneNumber || localStorage.getItem("userPhone");

  const fetchRequests = useCallback(async () => {
    if (!userPhone) {
      toast.error("User phone not found. Please login again.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/user-requests/${encodeURIComponent(userPhone)}`
      );
      const data = await res.json();

      if (data.success) {
        setRequests(data.requests);
      } else {
        toast.error("Failed to load services");
      }
    } catch (error) {
      toast.error("Server error connecting to history");
    } finally {
      setLoading(false);
    }
  }, [userPhone]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const refreshStatus = async (srn) => {
    try {
      const res = await fetch(`http://localhost:5000/api/track/${srn}`);
      const data = await res.json();

      if (data.success) {
        setRequests((prev) =>
          prev.map((req) =>
            req.srn === srn
              ? { ...req, status: data.status, remarks: data.remarks }
              : req
          )
        );
        toast.success("Status Synchronized");
      }
    } catch (error) {
      toast.error("Refresh failed");
    }
  };

  return (
    <div className="min-h-screen pt-28 px-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-slate-900">{t("Previous Services")}</h1>
          <button 
            onClick={fetchRequests} 
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
            title="Refresh List"
          >
            <RefreshCcw size={20} className={`${loading ? 'animate-spin' : ''} text-slate-600`} />
          </button>
        </div>

        {loading && requests.length === 0 && (
          <div className="flex flex-col items-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
             <p className="mt-4 text-slate-500 font-medium">Loading your history...</p>
          </div>
        )}

        {!loading && requests.length === 0 && (
          <div className="bg-white p-16 rounded-[2.5rem] shadow-sm border border-slate-100 text-center">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
               <Clock className="text-slate-300" size={32} />
            </div>
            <p className="text-slate-500 text-lg font-bold">No service history found.</p>
            <p className="text-slate-400 text-sm mt-1">Applications you submit will appear here.</p>
          </div>
        )}

        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req._id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Reference Number</p>
                  <p className="font-mono font-bold text-indigo-600 text-xl">{req.srn}</p>
                </div>
                <div className="flex flex-col items-end">
                    <span
                        className={`px-4 py-1.5 text-xs font-black rounded-full uppercase tracking-tight ${
                        req.status === "Approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : req.status === "Rejected"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                    >
                        {req.status || "Pending"}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-2 font-medium">
                        {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                <p className="text-slate-900 font-bold mb-1">{t(req.formType)}</p>
                <div className="flex items-start gap-2 mt-3">
                    <div className="mt-1">
                        {req.status === 'Approved' ? <CheckCircle2 size={14} className="text-emerald-500"/> : 
                         req.status === 'Rejected' ? <XCircle size={14} className="text-rose-500"/> : 
                         <Clock size={14} className="text-amber-500"/>}
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Remarks</p>
                        <p className="text-sm text-slate-600 leading-relaxed italic">
                            "{req.remarks || "Your application is currently under review by the department."}"
                        </p>
                    </div>
                </div>
              </div>

              <button
                onClick={() => refreshStatus(req.srn)}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <RefreshCcw size={14} />
                Check for Updates
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceHistory;