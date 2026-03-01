import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ShieldCheck, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: "Home", path: "/" },
      { name: "Complaints", path: "/complaints" },
      { name: "Payments", path: "/payments" },
      { name: "Status Tracking", path: "/complaints/status" },
    ],
    services: [
      { name: "Water Supply", path: "/services/water" },
      { name: "Electricity", path: "/services/electricity" },
      { name: "Waste Management", path: "/services/waste" },
      { name: "Municipal", path: "/services/municipal" },
    ],
    support: [
      { name: "Contact Us", path: "/contact" },
      { name: "Notifications", path: "/dashboard/notifications" },
      { name: "Profile", path: "/dashboard/profile" },
      { name: "FAQs", path: "/faq" },
    ],
  };

  return (
    <footer className="relative mt-20 px-6 pb-12 font-sans overflow-hidden">
      {/* Decorative Blur Background */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-t from-indigo-50/50 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Brand Column */}
            <div className="space-y-6">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                  N
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase">
                  NAGAR<span className="text-indigo-400">-SETU</span>
                </span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-medium">
                The official AI-driven citizen portal for smarter, faster, and more transparent urban governance.
              </p>
              <div className="flex gap-4">
                {[Facebook, Twitter, Instagram].map((Icon, i) => (
                  <motion.a 
                    key={i} 
                    href="#" 
                    whileHover={{ y: -3, color: "#818cf8" }}
                    className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 transition-colors"
                  >
                    <Icon size={18} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                  {title}
                </h4>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        to={link.path} 
                        className="text-slate-400 hover:text-white text-sm font-bold flex items-center gap-1 group transition-colors"
                      >
                        {link.name}
                        <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-white/10 my-12" />

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-widest text-slate-500">
              <span className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-green-500" /> Secure SSL Encrypted
              </span>
              <span>© {currentYear} Nagar-Setu</span>
            </div>
            
            <div className="flex gap-8 text-[11px] font-black uppercase tracking-widest text-slate-500">
              <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>

        {/* Small "Made with" note */}
        <p className="text-center mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Engineered for Smart Cities • Built with React & AI
        </p>
      </div>
    </footer>
  );
};

export default Footer;