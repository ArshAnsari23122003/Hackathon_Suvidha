import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { 
  Download, CheckCircle, AlertCircle, 
  Loader2, Flame, Zap, Droplets, Trash2, Landmark, Gavel, Layers
} from "lucide-react";

// CHANGE THIS TO YOUR LIVE URL WHEN DEPLOYING (e.g., https://your-api.onrender.com)
const API_BASE_URL = "http://localhost:5000";

const PaymentPage = () => {
  const [bills, setBills] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState(null);
  const [amount, setAmount] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userPhone = user.phoneNumber;

  const categories = [
    { name: "All", icon: <Layers size={20} />, color: "text-slate-500", bg: "bg-slate-100" },
    { name: "Electricity", icon: <Zap size={20} />, color: "text-amber-500", bg: "bg-amber-50" },
    { name: "Water", icon: <Droplets size={20} />, color: "text-blue-500", bg: "bg-blue-50" },
    { name: "Gas", icon: <Flame size={20} />, color: "text-orange-500", bg: "bg-orange-50" },
    { name: "Waste", icon: <Trash2 size={20} />, color: "text-emerald-500", bg: "bg-emerald-50" },
    { name: "Municipal", icon: <Landmark size={20} />, color: "text-violet-500", bg: "bg-violet-50" },
  ];

  useEffect(() => {
    if (userPhone) fetchData();
  }, [userPhone]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [billRes, histRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/bills/user/${userPhone}`),
        axios.get(`${API_BASE_URL}/api/history/${userPhone}`)
      ]);
      setBills(billRes.data.bills || []);
      setHistory(histRes.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBills = activeCategory === "All" 
    ? bills 
    : bills.filter(b => b.type.toLowerCase().includes(activeCategory.toLowerCase()));

  const filteredHistory = activeCategory === "All"
    ? history
    : history.filter(h => h.type.toLowerCase().includes(activeCategory.toLowerCase()));

  const activeBills = filteredBills.filter(b => b.status !== "Paid" && new Date(b.lastDate) >= new Date());
  const overdueFines = filteredBills.filter(b => b.status !== "Paid" && new Date(b.lastDate) < new Date());

  const handlePaymentSubmit = async (e) => {
    if(e) e.preventDefault();
    const baseAmount = Number(amount);
    const finalAmount = selectedBill.isFine ? Math.round(baseAmount * 1.10) : baseAmount;
    
    try {
      // 1. Create Order
      const orderRes = await axios.post(`${API_BASE_URL}/api/create-order`, {
        amount: finalAmount,
        type: selectedBill.type,
      });

      const options = {
        key: "rzp_test_SLXFIGdtnLsxmM", 
        amount: orderRes.data.amount,
        currency: "INR",
        name: "Nagar Setu",
        description: `${selectedBill.type} Payment`,
        image: "https://i.imgur.com/3g7tS8p.png", // Hosted Secure Logo
        order_id: orderRes.data.id,
        handler: async (response) => {
          try {
            // 2. Verify Payment
            await axios.post(`${API_BASE_URL}/api/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              billId: selectedBill._id,
              userPhone,
              type: selectedBill.type,
              amount: finalAmount
            });
            alert("✅ Payment Successful!");
            setSelectedBill(null);
            fetchData();
          } catch (verifyErr) {
            alert("❌ Payment recorded by Razorpay, but server verification failed. Please contact support.");
          }
        },
        prefill: { contact: userPhone },
        theme: { color: "#7c3aed" },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert("Razorpay SDK not found. Please check your internet connection.");
      }
    } catch (err) {
      alert("❌ Server Error: Could not initiate payment. Ensure your Backend is running.");
    }
  };

  const downloadReceipt = (bill) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(124, 58, 237);
    doc.text("NAGAR SETU RECEIPT", 14, 20);
    autoTable(doc, {
      startY: 35,
      head: [['Description', 'Details']],
      body: [
        ['Service', bill.type], 
        ['Transaction ID', bill.razorpay_payment_id || 'N/A'],
        ['Amount Paid', `INR ${bill.amount}`], 
        ['Status', 'SUCCESS'],
        ['Date', new Date(bill.datePaid || Date.now()).toLocaleString()]
      ],
      headStyles: { fillColor: [124, 58, 237] }
    });
    doc.save(`Receipt_${bill.type}.pdf`);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-violet-50">
      <Loader2 className="animate-spin text-violet-600 mb-4" size={40} />
      <p className="font-black text-violet-900 uppercase tracking-widest">Processing Records...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 pt-28 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">
            Billing <span className="text-violet-600">Portal</span>
          </h1>
          <p className="text-slate-500 font-bold mt-1">Manage utility bifurcations and secure transactions.</p>
        </header>

        {/* SECTION DEPARTMENTS */}
        <section className="mb-12">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Service Departments</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <div 
                key={cat.name} 
                onClick={() => setActiveCategory(cat.name)}
                className={`cursor-pointer p-6 rounded-[2rem] shadow-sm border transition-all flex flex-col items-center gap-3 
                  ${activeCategory === cat.name ? 'bg-violet-600 border-violet-600 scale-105 shadow-lg' : 'bg-white border-slate-100 hover:shadow-md'}`}
              >
                <div className={`${activeCategory === cat.name ? 'bg-white/20 text-white' : `${cat.color} ${cat.bg}`} p-4 rounded-2xl`}>
                  {cat.icon}
                </div>
                <span className={`font-black text-[10px] uppercase tracking-wider ${activeCategory === cat.name ? 'text-white' : 'text-slate-700'}`}>
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Current Dues */}
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-violet-100 h-[500px] flex flex-col">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Zap size={20}/></div>
              {activeCategory} Dues
            </h2>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {activeBills.length > 0 ? activeBills.map(bill => (
                <div key={bill._id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex justify-between items-center hover:bg-white hover:border-violet-200 transition-all">
                  <div>
                    <p className="font-black text-slate-400 uppercase text-[9px] tracking-widest">{bill.type}</p>
                    <p className="text-2xl font-black text-slate-900">₹{bill.amount}</p>
                  </div>
                  <button onClick={() => { setSelectedBill(bill); setAmount(bill.amount); }} className="bg-violet-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-violet-200 hover:bg-violet-700 transition-all">Pay Now</button>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center opacity-40">
                  <CheckCircle size={40} />
                  <p className="font-black text-xs mt-2 uppercase text-center">No pending {activeCategory === "All" ? "bills" : `${activeCategory} bills`}</p>
                </div>
              )}
            </div>
          </div>

          {/* Pending Fines */}
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-rose-100 h-[500px] flex flex-col">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <div className="p-2 bg-rose-100 text-rose-600 rounded-lg"><Gavel size={20}/></div>
              {activeCategory} Fines
            </h2>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {overdueFines.length > 0 ? overdueFines.map(bill => (
                <div key={bill._id} className="p-6 bg-rose-50/50 rounded-[2rem] border border-rose-100 flex justify-between items-center hover:bg-white hover:border-rose-300 transition-all">
                  <div>
                    <p className="font-black text-rose-600 uppercase text-[9px] tracking-widest">{bill.type} (Overdue)</p>
                    <p className="text-2xl font-black text-slate-900">₹{Math.round(bill.amount * 1.10)}</p>
                  </div>
                  <button onClick={() => { setSelectedBill({...bill, isFine: true}); setAmount(bill.amount); }} className="bg-rose-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all">Pay Fine</button>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center opacity-40">
                  <AlertCircle size={40} />
                  <p className="font-black text-xs mt-2 uppercase text-center">No {activeCategory === "All" ? "fines" : `${activeCategory} fines`}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-slate-900 rounded-[3.5rem] p-10 shadow-2xl overflow-hidden">
          <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
            <div className="p-2 bg-slate-800 text-violet-400 rounded-xl"><Landmark size={24}/></div>
            {activeCategory} Payment History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">
                  <th className="px-6 pb-4">Service</th>
                  <th className="px-6 pb-4">Transaction ID</th>
                  <th className="px-6 pb-4">Amount</th>
                  <th className="px-6 pb-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map(item => (
                  <tr key={item._id} className="bg-slate-800/40 hover:bg-slate-800 transition-colors group">
                    <td className="px-6 py-5 rounded-l-3xl font-black text-white uppercase text-xs tracking-wider">{item.type}</td>
                    <td className="px-6 py-5 text-slate-400 font-mono text-xs">{item.razorpay_payment_id || "TXN_PENDING"}</td>
                    <td className="px-6 py-5 font-black text-violet-400">₹{item.amount}</td>
                    <td className="px-6 py-5 rounded-r-3xl text-right">
                      <button onClick={() => downloadReceipt(item)} className="p-3 bg-slate-700 text-white rounded-xl hover:bg-violet-600 transition-all"><Download size={18}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredHistory.length === 0 && (
              <p className="text-center py-10 text-slate-500 font-black uppercase text-[10px] tracking-widest">No history for this category</p>
            )}
          </div>
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      {selectedBill && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl">
            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Confirm Payment</h3>
            <p className="text-slate-400 font-bold text-xs uppercase mb-8 tracking-widest">Secure Bank Gateway</p>
            <div className="p-6 bg-slate-50 rounded-[2rem] border-2 border-violet-100 mb-8">
              <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-4">
                <span className="font-black text-slate-400 text-xs uppercase">Service</span>
                <span className="font-black text-slate-800 uppercase text-xs">{selectedBill.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-black text-slate-400 text-xs uppercase">Total Pay</span>
                <span className="font-black text-violet-600 text-2xl">₹{selectedBill.isFine ? Math.round(amount * 1.10) : amount}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setSelectedBill(null)} className="flex-1 py-4 font-black text-xs uppercase text-slate-400 hover:text-slate-600 transition-colors">Go Back</button>
              <button onClick={handlePaymentSubmit} className="flex-1 py-4 bg-violet-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-violet-200 hover:bg-violet-700">Authorize</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;