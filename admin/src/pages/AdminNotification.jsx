import React, { useState, useEffect } from 'react';
import { Send, Bell, Megaphone, Trash2, Edit3, RefreshCcw } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AdminNotification = () => {
  const [msg, setMsg] = useState({ title: '', body: '', target: 'all' });
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // --- Fetch Notifications History ---
  const fetchHistory = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/notifications');
      const data = await res.json();
      if (data.success) {
        setList(data.notifications);
      }
    } catch (err) {
      toast.error("Failed to load history from server");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // --- Handle Create OR Update ---
  const handleSend = async (e) => {
    e.preventDefault();
    if (!msg.title || !msg.body) return toast.error("Please fill all fields");

    setLoading(true);

    // If editingId exists, we use the PUT route for that specific ID
    const url = editingId 
      ? `http://localhost:5000/api/notifications/${editingId}`
      : 'http://localhost:5000/api/send-notification';
    
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg),
      });

      const result = await res.json();

      if (result.success) {
        toast.success(editingId ? "Notification Updated!" : "Notification Broadcasted!");
        setMsg({ title: '', body: '', target: 'all' });
        setEditingId(null);
        fetchHistory(); // Refresh the table
      } else {
        toast.error(result.message || "Operation failed");
      }
    } catch (err) {
      toast.error("Server connection error");
    } finally {
      setLoading(false);
    }
  };

  // --- Delete Notification ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/${id}`, {
        method: 'DELETE',
      });
      const result = await res.json();

      if (result.success) {
        toast.success("Notification deleted");
        fetchHistory(); // Refresh the table
      } else {
        toast.error("Could not delete");
      }
    } catch (err) {
      toast.error("Delete failed - server error");
    }
  };

  // --- Enter Edit Mode ---
  const startEdit = (item) => {
    setEditingId(item._id);
    setMsg({ title: item.title, body: item.body, target: item.target });
    // Scroll smoothly to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      {/* THIS IS REQUIRED FOR TOASTS TO WORK */}
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
              <Megaphone size={28} />
            </div>
            <div>
                <h2 className="text-3xl font-black text-slate-800">Broadcast Center</h2>
                <p className="text-slate-500 text-sm">Send real-time alerts or manage past updates.</p>
            </div>
        </div>
        <button 
          onClick={fetchHistory} 
          className="p-2 hover:rotate-180 transition-all duration-500 text-slate-400"
          title="Refresh History"
        >
            <RefreshCcw size={20}/>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <form onSubmit={handleSend} className="lg:col-span-2 space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          {editingId && (
            <div className="bg-amber-50 text-amber-700 p-3 rounded-xl text-xs font-bold flex justify-between items-center border border-amber-200">
              <span>⚠️ Currently Editing Notification</span>
              <button 
                type="button"
                onClick={() => {setEditingId(null); setMsg({title:'', body:'', target:'all'})}} 
                className="underline uppercase tracking-tighter"
              >
                Cancel Edit
              </button>
            </div>
          )}
          
          <div>
            <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Recipient Group</label>
            <div className="flex gap-3">
              {['all', 'water', 'electricity'].map((t) => (
                <button 
                  key={t} 
                  type="button" 
                  onClick={() => setMsg({ ...msg, target: t })}
                  className={`px-6 py-2 rounded-xl text-xs font-bold capitalize border transition-all ${
                    msg.target === t ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Message Title</label>
            <input 
              type="text" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-semibold transition-all"
              placeholder="Enter a catchy headline..."
              value={msg.title} 
              onChange={(e) => setMsg({ ...msg, title: e.target.value })} 
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Message Content</label>
            <textarea 
              rows="4" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium transition-all"
              placeholder="Describe the update in detail..."
              value={msg.body} 
              onChange={(e) => setMsg({ ...msg, body: e.target.value })} 
            />
          </div>

          <button 
            disabled={loading} 
            className={`w-full py-4 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg ${
              editingId ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-100' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'
            }`}
          >
            {loading ? "Processing..." : editingId ? <><Edit3 size={20} /> Update Notification</> : <><Send size={20} /> Send Notification</>}
          </button>
        </form>

        {/* Live Preview Section */}
        <div className="space-y-4">
          <label className="block text-xs font-black uppercase text-slate-400 tracking-widest">Live Preview</label>
          <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-2xl relative overflow-hidden border-4 border-slate-800 ring-1 ring-slate-700">
             <div className="flex items-center gap-2 mb-4 opacity-50">
                <Bell size={14} />
                <span className="text-[10px] font-bold tracking-widest uppercase">Citizen App Alert</span>
             </div>
             <h4 className="text-lg font-bold mb-1 leading-tight">{msg.title || "Headline Here"}</h4>
             <p className="text-sm text-slate-400 leading-relaxed break-words">{msg.body || "Your message preview will appear here..."}</p>
             <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] font-black opacity-40">
                <span>NAGAR-SETU OFFICIAL</span>
                <span>{editingId ? "EDITING" : "NOW"}</span>
             </div>
          </div>
        </div>
      </div>

      {/* --- Management List Section --- */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-black text-slate-700 uppercase text-sm tracking-wider">Sent History</h3>
            <span className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-full text-[10px] font-black">{list.length} ITEMS</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Message Details</th>
                <th className="px-6 py-4">Group</th>
                <th className="px-6 py-4">Sent Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {list.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800 text-sm">{item.title}</p>
                    <p className="text-xs text-slate-400 truncate max-w-[250px]">{item.body}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                      item.target === 'all' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {item.target}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => startEdit(item)} 
                          className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                          title="Edit"
                        >
                            <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item._id)} 
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Delete"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && (
            <div className="p-20 text-center">
              <p className="text-slate-400 font-medium">No broadcast history found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotification;