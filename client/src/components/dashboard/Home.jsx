import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Map, ShieldCheck, Droplets, Zap, Trash2, Flame, Building2, Shield, CheckCircle } from "lucide-react";
import NewsSection from "./NewsSection";
import FAQSection from "./FAQSection";
import HomeSections from "./HomeSections";
import Footer from "./Footer";

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1541830826-550fe4174e42?q=80&w=1200", 
      label: "Water Dept",
      icon: <Droplets size={16} />,
      desc: "Leakage reporting and bill management."
    },
    {
      url: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1200", 
      label: "Electricity",
      icon: <Zap size={16} />,
      desc: "Power outage and smart grid updates."
    },
    {
      url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1200", 
      label: "Waste Mgmt",
      icon: <Trash2 size={16} />,
      desc: "Garbage collection and recycling tracking."
    },
    {
      url: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=1200", 
      label: "Gas Utility",
      icon: <Flame size={16} />,
      desc: "Pipeline safety and connection requests."
    },
    {
      url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200", 
      label: "Municipal",
      icon: <Building2 size={16} />,
      desc: "Property tax and trade license services."
    },
    {
      url: "https://images.unsplash.com/photo-1557597774-9d2739f8f0ec?q=80&w=1200", 
      label: "Public Safety",
      icon: <Shield size={16} />,
      desc: "Emergency response and 24/7 monitoring."
    }
  ];

  return (
    <div className="bg-white selection:bg-indigo-100 selection:text-indigo-900">
      {/* Hero Section */}
      <section className="relative pt-48 pb-16 flex flex-col items-center text-center px-6 overflow-hidden">
        
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-indigo-50/40 to-transparent rounded-full blur-[100px] -z-10" />

        {/* Floating Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 border border-slate-200 bg-white/80 backdrop-blur-md text-slate-600 rounded-full px-5 py-2 text-[10px] font-black tracking-[0.2em] uppercase shadow-sm mb-8"
        >
          <ShieldCheck size={14} className="text-indigo-600" />
          <span>{t("heroBadge") || "Official Citizen Portal"}</span>
        </motion.div>

        {/* Heading */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-6xl md:text-7xl lg:text-8xl font-[900] text-slate-900 leading-[0.95] max-w-5xl tracking-[-0.04em]"
        >
          {t("heroTitle") || "Empowering Every Citizen."}
        </motion.h1>

        {/* Subheading */}
        <motion.p className="mt-8 text-slate-500 max-w-2xl text-lg md:text-xl font-medium leading-relaxed">
          {t("heroDesc") || "Seamlessly report issues, track utility payments, and stay updated with your city's progress through our AI-driven governance platform."}
        </motion.p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <button 
            onClick={() => navigate("/complaints")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 h-14 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all duration-300 shadow-xl shadow-indigo-100 group"
          >
            File a Report <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button className="bg-white border border-slate-200 hover:border-indigo-100 hover:bg-slate-50 text-slate-700 px-10 h-14 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all duration-300">
            <Map size={18} className="text-indigo-600" /> Explore City Map
          </button>
        </div>

        {/* Live Stats Bar - Bridges the gap to the grid */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 border-y border-slate-100 py-6 w-full max-w-4xl">
           <div className="text-center">
              <p className="text-2xl font-black text-slate-900">12k+</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reports Solved</p>
           </div>
           <div className="text-center border-x border-slate-100 px-8 md:px-16">
              <p className="text-2xl font-black text-indigo-600">24/7</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Assistance</p>
           </div>
           <div className="text-center">
              <p className="text-2xl font-black text-slate-900">100%</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transparency</p>
           </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mt-20 px-4">
          {galleryImages.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group h-[380px] rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
            >
              <div className="absolute top-4 left-4 z-20 bg-white/10 backdrop-blur-lg border border-white/20 px-3 py-1.5 rounded-xl flex items-center gap-2 text-white shadow-sm">
                {img.icon}
                <span className="text-[9px] font-black uppercase tracking-widest">{img.label}</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent z-10 opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
              <img src={img.url} alt={img.label} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute bottom-6 left-6 right-6 z-20 text-left">
                <p className="text-white font-black text-xl tracking-tight leading-none mb-2">{img.label}</p>
                <p className="text-slate-200 text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">{img.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TIGHTENED SPACING: Reduced space-y-40 to space-y-20 */}
      <div className="flex flex-col gap-20 pb-20">
        <HomeSections />
        <NewsSection />
        <FAQSection />
        <Footer/>
      </div>
    </div>
  );
};

export default Home;