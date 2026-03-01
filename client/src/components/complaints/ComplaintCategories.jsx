import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { 
  Zap, Droplets, Trash2, Flame, Building2, 
  AlertTriangle, Clock, CreditCard, ChevronRight, ArrowLeft 
} from "lucide-react";

const complaintTypes = {
  electricity: ["No Supply", "Wrong Billing", "Meter Reading Issue", "Service Delay", "Emergency Reporting", "Others"],
  water: ["No Water Supply", "Leakage", "Contaminated Water", "Low Pressure", "Service Delay", "Others"],
  waste: ["Garbage Not Collected", "Overflowing Bin", "Missed Pickup", "Illegal Dumping", "Service Delay", "Others"],
  gas: ["Gas Leakage", "No Gas Supply", "Billing Issue", "Emergency Reporting", "Connection Delay", "Others"],
  municipal: ["Streetlight Issue", "Drainage Problem", "Encroachment", "Public Safety Issue", "Service Delay", "Others"]
};

// Helper to assign icons to categories
const getIcon = (type) => {
  const t = type.toLowerCase();
  if (t.includes("emergency") || t.includes("leakage") || t.includes("safety")) return <AlertTriangle className="text-rose-500" />;
  if (t.includes("billing") || t.includes("reading") || t.includes("credit")) return <CreditCard className="text-blue-500" />;
  if (t.includes("delay") || t.includes("wait")) return <Clock className="text-amber-500" />;
  return <ChevronRight className="text-purple-400" />;
};

const ComplaintCategories = () => {
  const { service } = useParams();
  const navigate = useNavigate();

  const categories = complaintTypes[service] || [];

  const createSlug = (text) => text.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="min-h-screen py-16 px-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-100 via-white to-purple-50">
      <div className="max-w-6xl mx-auto">
        
        {/* Animated Back Button */}
        <motion.button 
          whileHover={{ x: -5 }}
          onClick={() => navigate("/")} 
          className="flex items-center text-purple-600 font-bold text-sm mb-8 group"
        >
          <ArrowLeft size={18} className="mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Services
        </motion.button>

        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black text-purple-950 capitalize tracking-tight flex items-center gap-3">
              {service} <span className="text-purple-400 font-light">Complaints</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Please select the specific issue you are facing.</p>
          </motion.div>
        </header>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((type, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/complaints/${service}/${createSlug(type)}`)}
              className="group cursor-pointer bg-white/80 backdrop-blur-sm border border-purple-100 p-6 rounded-2xl shadow-xl shadow-purple-900/5 hover:shadow-purple-900/10 hover:border-purple-300 transition-all flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                  {getIcon(type)}
                </div>
                <h2 className="font-bold text-slate-800 text-lg group-hover:text-purple-900 transition-colors">
                  {type}
                </h2>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-purple-500 transition-all group-hover:translate-x-1" />
            </motion.div>
          ))}
        </div>

        {/* Support Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 p-8 bg-purple-950 rounded-3xl text-center text-white relative overflow-hidden shadow-2xl"
        >
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Can't find your issue?</h3>
            <p className="text-purple-200 mb-6 text-sm">Select "Others" above or contact our 24/7 helpline.</p>
            <button className="bg-emerald-500 hover:bg-emerald-600 px-8 py-3 rounded-full font-black transition-all">
              Call Support: 1800-2777
            </button>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-800 rounded-full opacity-50 blur-2xl"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default ComplaintCategories;