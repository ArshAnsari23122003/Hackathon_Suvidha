import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, Building, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Contacts = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const departments = [
    { name: t("customerSupport"), phone: "+91 98765 43210", email: "support@company.com" },
    { name: t("electricityDepartment"), phone: "+91 98765 43211", email: "electricity@company.com" },
    { name: t("waterDepartment"), phone: "+91 98765 43212", email: "water@company.com" },
    { name: t("municipalCorporation"), phone: "+91 98765 43213", email: "admin@company.com" },
    { name: t("wasteManagement"), phone: "+91 98765 43214", email: "waste@company.com" },
  ];

  // Animation variants for the container and items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    hover: { 
      y: -5, 
      scale: 1.02,
      transition: { duration: 0.2, ease: "easeOut" } 
    }
  };

  return (
    <div className="relative min-h-screen pt-28 px-6 md:px-10 bg-gradient-to-br from-indigo-50 to-blue-100 overflow-hidden">
      {/* Decorative Background Elements for Glassmorphism depth */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="group mb-8 flex items-center gap-2 px-5 py-2.5 bg-white/40 backdrop-blur-md border border-white/50 rounded-full shadow-sm text-gray-700 hover:bg-indigo-600 hover:text-white transition-all duration-300"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">{t("back")}</span>
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-10 tracking-tight">
          {t("departmentContacts")}
        </h1>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {departments.map((dept, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              className="group relative bg-white/30 backdrop-blur-lg border border-white/40 p-8 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] transition-shadow"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-600/10 rounded-lg text-indigo-600">
                  <Building size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">{dept.name}</h2>
              </div>

              <div className="space-y-4">
                {/* Phone Link */}
                <a
                  href={`tel:${dept.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/50 transition-colors group/link"
                >
                  <div className="p-2 bg-white/50 rounded-full text-gray-500 group-hover/link:text-indigo-600 transition-colors">
                    <Phone size={18} />
                  </div>
                  <span className="text-gray-600 font-medium group-hover/link:text-indigo-700">
                    {dept.phone}
                  </span>
                </a>

                {/* Email Link */}
                <a
                  href={`mailto:${dept.email}`}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/50 transition-colors group/link"
                >
                  <div className="p-2 bg-white/50 rounded-full text-gray-500 group-hover/link:text-indigo-600 transition-colors">
                    <Mail size={18} />
                  </div>
                  <span className="text-gray-600 font-medium group-hover/link:text-indigo-700 truncate">
                    {dept.email}
                  </span>
                </a>
              </div>
              
              {/* Bottom accent bar */}
              <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-indigo-500 rounded-b-2xl group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Contacts;