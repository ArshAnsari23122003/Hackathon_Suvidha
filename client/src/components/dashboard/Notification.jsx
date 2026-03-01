import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Add this for redirection
import { 
  Bell, Volume2, VolumeX, Loader2, RefreshCcw, Info, 
  Calendar, ChevronRight, CreditCard, ExternalLink 
} from "lucide-react";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [silent, setSilent] = useState(false);
  
  // NEW: State for the unread badge count
  const [unreadCount, setUnreadCount] = useState(0);
  
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/notifications');
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
        // Reset unread count to 0 when we fetch/view them
        setUnreadCount(0); 
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Simulate receiving 3 new notifications on load for the badge demo
    setUnreadCount(3);
  }, []);

  // Function to check if notification is bill-related
  const isBillNotification = (title, body) => {
    const keywords = ['bill', 'payment', 'invoice', 'due', 'fine'];
    return keywords.some(k => title.toLowerCase().includes(k) || body.toLowerCase().includes(k));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 md:px-8 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="relative p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
              <Bell size={28} />
              {/* NEW: Notification Badge */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 border-4 border-gray-50 text-[10px] font-black flex items-center justify-center rounded-full animate-bounce">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Notification Hub</h2>
              <p className="text-slate-500 text-sm font-medium">Official updates and community alerts.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-center">
            <button 
              onClick={fetchNotifications}
              className="p-2.5 bg-white border border-slate-200 rounded-xl hover:rotate-180 transition-all duration-500 text-slate-400 hover:text-indigo-600 shadow-sm"
              title="Refresh and Mark as Read"
            >
              <RefreshCcw size={20}/>
            </button>
            
            <button
              onClick={() => setSilent(!silent)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                silent 
                  ? "bg-slate-200 text-slate-600 border border-slate-300" 
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100"
              }`}
            >
              {silent ? <VolumeX size={18} /> : <Volume2 size={18} />}
              {silent ? "Notifications Muted" : "Alerts Active"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Notifications List */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Live Feed</h3>
              <button 
                onClick={() => setUnreadCount(0)}
                className="text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-widest"
              >
                Mark all as seen
              </button>
            </div>

            {loading ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-24 flex flex-col items-center justify-center shadow-sm">
                <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
                <p className="text-slate-500 font-bold tracking-tight">Synchronizing alerts...</p>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((item) => {
                const isBill = isBillNotification(item.title, item.body);
                
                return (
                  <div
                    key={item._id}
                    className={`group bg-white rounded-3xl border p-6 md:p-8 transition-all hover:shadow-xl ${
                      isBill ? "border-amber-200 bg-amber-50/30" : "border-slate-200 hover:border-indigo-400"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                      <div className="flex items-start gap-3">
                        <div className={`mt-1.5 w-2.5 h-2.5 rounded-full ${isBill ? 'bg-amber-500 animate-pulse' : 'bg-indigo-500'}`}></div>
                        <h4 className="text-xl font-bold text-slate-800 leading-snug">
                          {item.title}
                        </h4>
                      </div>
                      <span className="whitespace-nowrap flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-100">
                        <Calendar size={12} className="text-slate-300" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-slate-600 text-[15px] leading-relaxed mb-6">
                      {expanded === item._id ? item.body : (item.body.substring(0, 160) + "...")}
                    </p>

                    <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                       <div className="flex gap-2">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                            isBill ? 'bg-amber-100 text-amber-700' : 'bg-indigo-50 text-indigo-600'
                          }`}>
                            {item.target || (isBill ? 'ACTION REQUIRED' : 'Public')}
                          </span>
                       </div>

                       <div className="flex items-center gap-4">
                        {/* NEW: Conditional Bill Payment Button */}
                        {isBill && (
                          <button
                            onClick={() => navigate("/payments")}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-600 transition-all shadow-md shadow-amber-200"
                          >
                            <CreditCard size={14} />
                            Pay Bill Now
                          </button>
                        )}

                        <button
                          onClick={() => setExpanded(expanded === item._id ? null : item._id)}
                          className="flex items-center gap-1 text-slate-400 font-black text-xs hover:text-indigo-600 transition-all"
                        >
                          {expanded === item._id ? "LESS" : "VIEW"}
                          <ChevronRight size={16} />
                        </button>
                       </div>
                    </div>
                  </div>
                );
              })
            ) : (
              /* No notification state remains the same */
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-20 text-center">
                <Bell className="mx-auto text-slate-200 mb-6" size={32} />
                <h5 className="text-slate-800 font-bold mb-1">No announcements yet</h5>
              </div>
            )}
          </div>

          {/* Right Column: Information Cards */}
          <div className="space-y-6 lg:sticky lg:top-32">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-8 opacity-50">
                    <Info size={16} />
                    <span className="text-[10px] font-black tracking-[0.25em] uppercase">Quick Actions</span>
                  </div>
                  
                  <h4 className="text-2xl font-bold mb-4 tracking-tight">Pending Dues?</h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8">
                    Check your service-wise bifurcations and settle outstanding municipal taxes instantly.
                  </p>

                  <button 
                    onClick={() => navigate("/payments")}
                    className="w-full group flex items-center justify-between p-4 bg-indigo-600 rounded-2xl border border-indigo-400 hover:bg-indigo-700 transition-all mb-4"
                  >
                    <span className="text-xs font-bold text-white uppercase">Go to Payment Portal</span>
                    <ExternalLink size={18} className="text-white/50 group-hover:text-white" />
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full blur-[80px]"></div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
               <h5 className="text-slate-800 font-black text-sm mb-3 uppercase tracking-wider">Preferences</h5>
               <p className="text-slate-500 text-xs leading-relaxed mb-6">Manage how you receive real-time alerts.</p>
               <button className="w-full py-3.5 bg-indigo-50 text-indigo-600 font-black text-[10px] tracking-widest uppercase rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                 Notification Settings
               </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Notification;