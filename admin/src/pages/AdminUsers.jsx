import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  User, ArrowLeft, Bell, CreditCard, FileText, Settings, 
  RefreshCw, Loader2, Plus, Calendar, AlertCircle, ChevronDown 
} from "lucide-react";

/* ------------------ STATUS STYLES ------------------ */
const statusStyle = (status) => {
  const map = {
    Pending: "bg-amber-100 text-amber-700",
    Approved: "bg-emerald-100 text-emerald-700",
    Resolved: "bg-emerald-100 text-emerald-700",
    Completed: "bg-emerald-100 text-emerald-700",
    "Under Review": "bg-blue-100 text-blue-700",
    Unpaid: "bg-rose-100 text-rose-700",
    Paid: "bg-emerald-100 text-emerald-700",
    Investigating: "bg-indigo-100 text-indigo-700",
    Rejected: "bg-red-100 text-red-700",
    "Fine Applied": "bg-black text-white",
  };
  return (
    <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm ${map[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("services");
  const [loading, setLoading] = useState(true);
  
  const [userDetails, setUserDetails] = useState({ 
    services: [], 
    complaints: [], 
    bills: [], 
    paymentIssues: [] 
  });

  const [showBillModal, setShowBillModal] = useState(false);
  const [newBill, setNewBill] = useState({ title: "", amount: "", lastDate: "", type: "Electricity" });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users");
      setUsers(res.data.users);
    } catch (err) { console.error("Fetch Users Error", err); }
    finally { setLoading(false); }
  };

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    setLoading(true);
    try {
      const [srv, cmp, bills] = await Promise.all([
        axios.get(`http://localhost:5000/api/user-requests/${user.phoneNumber}`),
        axios.get(`http://localhost:5000/api/complaints/user/${user.phoneNumber}`),
        axios.get(`http://localhost:5000/api/bills/user/${user.phoneNumber}`)
      ]);
      setUserDetails({
        services: srv.data.requests || [],
        complaints: cmp.data.complaints || [],
        bills: bills.data.bills || [],
        paymentIssues: [] 
      });
    } catch (err) { console.error("Detail Fetch Error", err); }
    finally { setLoading(false); }
  };

  const updateRemoteStatus = async (section, id, newStatus) => {
    try {
      let endpoint = section === "complaints" ? "complaints/update-status" : "admin/update-status";
      await axios.post(`http://localhost:5000/api/${endpoint}`, {
        srn: id,
        newStatus,
        status: newStatus,
        remarks: `Updated via Admin Panel on ${new Date().toLocaleDateString()}`
      });
      
      setUserDetails(prev => ({
        ...prev,
        [section]: prev[section].map(item => (item.srn === id || item._id === id) ? { ...item, status: newStatus } : item)
      }));

      await axios.post("http://localhost:5000/api/send-notification", {
        title: `Status Update: ${newStatus}`,
        body: `Your ${section} request (${id}) has been updated.`,
        target: selectedUser.phoneNumber
      });
    } catch (err) { alert("Failed to update status on server."); }
  };

  const handleReleaseBill = async () => {
    try {
      const billData = {
        ...newBill,
        userPhone: selectedUser.phoneNumber,
        releaseDate: new Date().toISOString(),
        status: "Unpaid"
      };
      // 1. Create Bill
      await axios.post("http://localhost:5000/api/bills/create", billData);
      
      // 2. Send Notification (FIXED)
      await axios.post("http://localhost:5000/api/send-notification", {
        title: `New Bill Released: ${newBill.type}`,
        body: `A new ${newBill.type} bill of ₹${newBill.amount} has been generated. Please pay before ${new Date(newBill.lastDate).toLocaleDateString()}.`,
        target: selectedUser.phoneNumber
      });

      setShowBillModal(false);
      handleSelectUser(selectedUser); 
      alert("Bill Released & Notification Sent!");
    } catch (err) { alert("Bill creation failed"); }
  };

  if (loading && !selectedUser) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-violet-50">
      <Loader2 className="animate-spin text-violet-600 mb-4" size={40} />
      <p className="font-black text-violet-900 uppercase tracking-widest">Accessing Citizen Database...</p>
    </div>
  );

  if (!selectedUser) {
    return (
      <div className="min-h-screen bg-violet-50 p-12 pt-32">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-black text-slate-900">Registered <span className="text-violet-500">Citizens</span></h1>
          <button onClick={fetchUsers} className="p-4 bg-white rounded-2xl shadow-lg hover:bg-violet-600 hover:text-white transition-all text-violet-600"><RefreshCw size={24}/></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.map(u => (
            <div key={u._id} onClick={() => handleSelectUser(u)} className="bg-white p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer border-2 border-transparent hover:border-violet-400 flex items-center gap-6">
              <div className="bg-violet-100 p-5 rounded-2xl text-violet-600"><User size={28}/></div>
              <div>
                <h3 className="font-black text-slate-800 text-xl">{u.name}</h3>
                <p className="text-sm font-bold text-slate-400">{u.phoneNumber}</p>
                <p className="text-[10px] font-black text-violet-400 mt-1 tracking-tighter uppercase">Aadhaar: {u.aadhaar}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-violet-50 p-12 pt-32">
      <button onClick={() => setSelectedUser(null)} className="flex items-center gap-2 text-violet-600 font-black text-xs uppercase mb-8 hover:-translate-x-1 transition-transform">
        <ArrowLeft size={18}/> Back to Citizen Directory
      </button>
      
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-violet-100">
        <div className="bg-slate-900 p-12 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-violet-600 rounded-[2rem] flex items-center justify-center shadow-lg"><User size={40}/></div>
            <div>
              <h2 className="text-3xl font-black">{selectedUser.name}</h2>
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-2">{selectedUser.phoneNumber} • {selectedUser.aadhaar}</p>
            </div>
          </div>
          <button onClick={() => setShowBillModal(true)} className="bg-violet-500 hover:bg-violet-400 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase flex items-center gap-2 transition-all shadow-lg shadow-violet-500/20">
            <Plus size={18}/> Release New Bill
          </button>
        </div>

        <div className="p-10">
          <div className="flex flex-wrap gap-4 mb-10">
            {[{id:"services", label:"Services"}, {id:"complaints", label:"Complaints"}, {id:"bills", label:"Bills & Fines"}, {id:"paymentIssues", label:"Payment Issues"}].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] transition-all ${activeTab === tab.id ? 'bg-violet-600 text-white shadow-xl translate-y-[-2px]' : 'bg-slate-50 text-slate-400 hover:bg-violet-50'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {userDetails[activeTab]?.length > 0 ? (
              userDetails[activeTab].map((item) => {
                const isOverdue = item.lastDate && new Date(item.lastDate) < new Date() && item.status === "Unpaid";
                const currentStatus = isOverdue ? "Fine Applied" : item.status;

                return (
                  <div key={item.srn || item._id} className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-violet-200 transition-all gap-6">
                    <div className="flex items-center gap-6 flex-1">
                      <div className="bg-white p-5 rounded-2xl shadow-sm text-violet-600 shrink-0">
                        {activeTab === "bills" ? <CreditCard size={24}/> : <FileText size={24}/>}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">{item.srn || "REF-"+item._id?.slice(-6)}</p>
                        <h4 className="font-black text-slate-800 text-xl truncate">{item.title || item.type || item.formType || item.category || "General Request"}</h4>
                        {item.lastDate && <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mt-1"><Calendar size={14}/> Due Date: {new Date(item.lastDate).toLocaleDateString()}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
                      <div className="shrink-0">{statusStyle(currentStatus)}</div>
                      <div className="flex items-center gap-2">
                        <select 
                          value={item.status}
                          onChange={(e) => updateRemoteStatus(activeTab, item.srn || item._id, e.target.value)}
                          className="bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-xs font-black text-slate-700 outline-none focus:border-violet-500 min-w-[160px] cursor-pointer"
                        >
                          <option value="" disabled>Change Status</option>
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Paid">Mark Paid</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                        <button className="p-3 bg-violet-100 text-violet-600 rounded-xl hover:bg-violet-600 hover:text-white transition-all"><Bell size={20}/></button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <AlertCircle className="mx-auto text-slate-300 mb-4" size={48} />
                <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No Active Records in this Category</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Release Bill Modal */}
      {showBillModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-12 shadow-2xl scale-in-center">
            <h3 className="text-3xl font-black mb-8 text-slate-900">Release Bill</h3>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Service Type</label>
                <select 
                  className="w-full mt-2 p-5 bg-slate-50 rounded-2xl outline-none font-bold text-slate-700 border-2 border-transparent focus:border-violet-500 transition-all" 
                  value={newBill.type} 
                  onChange={e => setNewBill({...newBill, type: e.target.value})}
                >
                  <option value="Electricity">Electricity</option>
                  <option value="Water">Water</option>
                  <option value="Gas">Gas</option>
                  <option value="Waste">Waste Collection</option>
                  <option value="Municipal">Municipal Tax</option>
                  <option value="Property Tax">Property Tax</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Amount (₹)</label>
                <input type="number" className="w-full mt-2 p-5 bg-slate-50 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-violet-500 transition-all" placeholder="Enter amount" onChange={e => setNewBill({...newBill, amount: e.target.value})}/>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Payment Deadline</label>
                <input type="date" className="w-full mt-2 p-5 bg-slate-50 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-violet-500 transition-all" onChange={e => setNewBill({...newBill, lastDate: e.target.value})}/>
              </div>
              <div className="flex gap-4 pt-6">
                <button onClick={() => setShowBillModal(false)} className="flex-1 p-5 font-black text-xs uppercase text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
                <button onClick={handleReleaseBill} className="flex-1 p-5 bg-violet-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-violet-200 hover:bg-violet-700 transition-all">Generate Bill</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;