import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTrash, FaWater, FaFire, FaBuilding, FaLightbulb, FaArrowRight } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const ComplaintService = () => {
  const { t } = useTranslation();

  const services = [
    { key: "electricity", path: "/complaints/electricity", icon: <FaLightbulb size={32} />, color: "text-amber-500", bg: "bg-amber-50" },
    { key: "water", path: "/complaints/water", icon: <FaWater size={32} />, color: "text-blue-500", bg: "bg-blue-50" },
    { key: "waste", path: "/complaints/waste", icon: <FaTrash size={32} />, color: "text-emerald-500", bg: "bg-emerald-50" },
    { key: "gas", path: "/complaints/gas", icon: <FaFire size={32} />, color: "text-rose-500", bg: "bg-rose-50" },
    { key: "municipal", path: "/complaints/municipal", icon: <FaBuilding size={32} />, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  // Animation variants for the grid
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen py-24 px-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-100 via-white to-purple-50">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <header className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-5xl font-black text-purple-950 mb-4 tracking-tight"
          >
            {t("Select Service")}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg font-medium"
          >
            {t("Choose a category to file your complaint")}
          </motion.p>
        </header>

        {/* Services Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Link
                to={service.path}
                className="group relative bg-white/80 backdrop-blur-sm border border-purple-100 rounded-3xl p-8 flex flex-col items-center gap-4 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-200 hover:border-purple-400 hover:-translate-y-2 overflow-hidden"
              >
                {/* Decorative Background Blob */}
                <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full opacity-10 transition-transform group-hover:scale-150 ${service.bg}`} />

                {/* Icon Container */}
                <div className={`p-5 rounded-2xl transition-all duration-300 group-hover:bg-purple-600 group-hover:text-white ${service.bg} ${service.color}`}>
                  {service.icon}
                </div>

                {/* Text */}
                <h2 className="text-xl font-bold text-slate-800 group-hover:text-purple-900 transition-colors">
                  {t(service.key)}
                </h2>

                <div className="flex items-center gap-2 text-sm font-bold text-purple-600 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {t("complaintSubmit")} <FaArrowRight size={12} />
                </div>

                {/* Bottom Border Accent */}
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Support Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest">
            {t("Available 24/7 for citizen support")}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ComplaintService;