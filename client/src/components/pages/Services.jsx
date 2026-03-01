import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { formConfigs } from '../../data/formConfigs';
import toast, { Toaster } from 'react-hot-toast';
import { ChevronLeft, UploadCloud, Send, FileText, CheckCircle2, Search, ArrowRight, Loader2 } from 'lucide-react';

const FormView = ({ formKey, onBack }) => {
  const { t } = useTranslation();
  const config = formConfigs[formKey];
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [trackingResult, setTrackingResult] = useState(null);

  useEffect(() => {
    if (isSubmitted && referenceId) {
      const timer = setTimeout(() => {
        handleTrackById(referenceId);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, referenceId]);

  const handleTrackById = async (id) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/track/${id}`);
      const result = await response.json();
      if (result.success) {
        setTrackingResult({
          id: id,
          status: result.status,
          update: result.remarks || "Your application is currently under verification."
        });
      } else {
        toast.error(t("SRN Not Found"));
      }
    } catch (err) {
      toast.error(t("Tracking Failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formKey === "Track Request") {
      await handleTrackById(formData.request_id);
      return;
    }

    const data = new FormData();
    data.append("formType", formKey);
    const textDetails = { ...formData, phone: localStorage.getItem("userPhone") };
    
    let fileToUpload = null;
    config.fields.forEach(field => {
      if (field.type === 'file') {
        fileToUpload = formData[field.name];
        delete textDetails[field.name];
      }
    });

    const srn = `SRN-${Math.floor(10000000 + Math.random() * 90000000)}`;
    data.append("srn", srn);
    data.append("details", JSON.stringify(textDetails));
    if (fileToUpload) data.append("pdfFile", fileToUpload);

    toast.promise(
      fetch('http://localhost:5000/api/submit', {
        method: 'POST',
        body: data,
      }).then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error();
        setReferenceId(result.srn);
        setIsSubmitted(true);
        return result;
      }),
      {
        loading: t('Uploading documents...'),
        success: t('Application Submitted!'),
        error: t('Submission failed.'),
      }
    ).finally(() => setIsSubmitting(false));
  };

  if (trackingResult) {
    return (
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-2xl mx-auto shadow-2xl border border-slate-100 animate-in zoom-in-95 fade-in duration-500">
        <div className="flex justify-between items-center mb-10">
           <div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t("Application Status")}</h2>
             <p className="text-slate-500 font-medium text-sm mt-1">{t("Real-time tracking enabled")}</p>
           </div>
           <div className="p-3 bg-emerald-50 rounded-2xl">
             <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
           </div>
        </div>
        
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t("Reference ID")}</p>
            <p className="text-2xl font-mono font-bold text-indigo-600 select-all">{trackingResult.id}</p>
          </div>
          
          <div className="p-8 bg-indigo-600 rounded-[2rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">{t("Current Phase")}</p>
              <p className="text-3xl font-black mt-2 tracking-tight">{t(trackingResult.status)}</p>
              
              <div className="mt-8">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">
                  <span>{t("Progress")}</span>
                  <span>{trackingResult.status === 'Approved' ? '100%' : '50%'}</span>
                </div>
                <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden">
                    <div className={`h-full bg-white transition-all duration-1000 ease-out ${
                        trackingResult.status === 'Approved' ? 'w-full' : 
                        trackingResult.status === 'Rejected' ? 'w-full bg-rose-400' : 'w-1/2'
                    }`}></div>
                </div>
              </div>
            </div>
            <CheckCircle2 className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 rotate-12" />
          </div>

          <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
             <div className="flex items-center gap-2 mb-3">
                <FileText size={16} className="text-amber-600" />
                <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">{t("Official Remarks")}</p>
             </div>
             <p className="text-slate-700 text-sm font-semibold leading-relaxed">{t(trackingResult.update)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-10">
            <button onClick={() => { setTrackingResult(null); setIsSubmitted(false); }} className="py-4 bg-slate-100 text-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95">
              {t("New Request")}
            </button>
            <button onClick={onBack} className="py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95">
              {t("Dashboard")}
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-2xl border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[3rem] p-8 md:p-12 max-w-2xl mx-auto animate-in slide-in-from-bottom-12 duration-700">
      <button onClick={onBack} className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest mb-8 group transition-all">
        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        {t("Return to Portal")}
      </button>
      
      <div className="mb-10">
        <h2 className="text-4xl font-black text-slate-900 leading-[1.1] tracking-tight">{t(config.title)}</h2>
        <div className="h-1.5 w-20 bg-indigo-600 rounded-full mt-4"></div>
        <p className="text-slate-500 mt-6 font-medium text-lg leading-relaxed">{t(config.description)}</p>
      </div>
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        {config.fields.map((field, index) => (
          <div key={index} className="flex flex-col group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1 transition-colors group-focus-within:text-indigo-600">
              {t(field.label)}
            </label>
            
            {field.type === 'textarea' ? (
              <textarea 
                className="w-full border-2 border-slate-50 rounded-2xl p-5 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none min-h-[140px] font-medium transition-all" 
                placeholder={t("Provide Detailed Information")}
                onChange={(e) => handleInputChange(field.name, e.target.value)} 
                required 
              />
            ) : field.type === 'file' ? (
              <div className="relative group/file">
                <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 bg-slate-50/50 group-hover/file:bg-indigo-50/30 group-hover/file:border-indigo-200 transition-all text-center">
                  <UploadCloud className="mx-auto mb-4 text-slate-300 group-hover/file:text-indigo-500 transition-colors" size={40} />
                  <p className="text-sm font-bold text-slate-600">
                    {formData[field.name] ? formData[field.name].name : t("Upload PDF Documentation")}
                  </p>
                  <p className="text-[10px] text-slate-400 font-black uppercase mt-2">{t("Max Size 5MB")}</p>
                  <input type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleInputChange(field.name, e.target.files[0])} required />
                </div>
              </div>
            ) : field.type === 'select' ? (
              <div className="relative">
                <select 
                  className="w-full h-16 border-2 border-slate-50 rounded-2xl px-6 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none appearance-none font-bold text-slate-700 transition-all"
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                >
                  {field.options.map((option) => (
                    <option key={option} value={option}>{t(option)}</option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
              </div>
            ) : (
              <input 
                type={field.type} 
                className="w-full h-16 border-2 border-slate-50 rounded-2xl px-6 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-slate-700 transition-all placeholder:text-slate-300" 
                placeholder={t(field.placeholder || "Enter Details")} 
                onChange={(e) => handleInputChange(field.name, e.target.value)} 
                required 
              />
            )}
          </div>
        ))}
        
        <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:bg-slate-300 disabled:shadow-none">
          {isSubmitting ? (
            <><Loader2 className="animate-spin" size={20} /> {t("Processing...")}</>
          ) : (
            <><Send size={18} /> {t("Submit Request")}</>
          )}
        </button>
      </form>
    </div>
  );
};

const ServiceCard = ({ title, status, description, links, onLinkClick }) => {
  const { t } = useTranslation();
  return (
    <div className="group bg-white rounded-[2rem] border border-slate-100 hover:border-indigo-200 hover:shadow-[0_24px_48px_-12px_rgba(79,70,229,0.1)] transition-all duration-500 p-8 mb-4 relative overflow-hidden">
      <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
               {title.charAt(0)}
             </div>
             <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{t(title)}</h3>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-100">{t(status)}</span>
      </div>
      <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium pr-4">{t(description)}</p>
      
      <div className="flex flex-wrap gap-3 relative z-10">
        {links.map((link, idx) => (
          <button 
            key={idx} 
            onClick={() => onLinkClick(link)} 
            className="group/btn px-5 py-2.5 bg-slate-50 hover:bg-indigo-600 text-slate-700 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 border border-slate-100 flex items-center gap-2"
          >
            {t(link)}
            <ArrowRight size={14} className="opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all" />
          </button>
        ))}
      </div>
      
      {/* Decorative background circle */}
      <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-indigo-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    </div>
  );
};

const Services = () => {
  const { serviceId } = useParams();
  const { t } = useTranslation();
  const [activeForm, setActiveForm] = useState(null);

  useEffect(() => {
    setActiveForm(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [serviceId]);

  const allServices = {
    electricity: [
      { title: "Account Management", status: "Active", description: "Apply for a fresh connection or manage existing profiles.", links: ["Apply New", "Link Existing", "Profile Settings"] },
      { title: "Billing and Name Change", status: "Online", description: "Update your name or premises address.", links: ["Update Name", "Change Address", "Track Request"] },
      { title: "Tariff Category", status: "Open", description: "Modify your tariff plan based on property usage.", links: ["Check Tariff", "Modify Category", "Rate Calculator"] },
      { title: "Meter Support", status: "Support", description: "Schedule technician visits for meter setup or closure.", links: ["Request Install", "Deactivation Form", "Technical Support"] }
    ],
    water: [
      { title: "New Connection", status: "Active", description: "Request for water or sewage lines.", links: ["Apply New", "Link Existing", "Track Request"] },
      { title: "Water Support", status: "Available", description: "Report leakage or meter faults.", links: ["Technical Support"] }
    ],
    gas: [
      { title: "PNG Registration", status: "Active", description: "Get a piped gas connection for your home.", links: ["Apply New", "Profile Settings", "Track Request"] },
      { title: "Gas Support", status: "24/7", description: "Technical help for gas lines.", links: ["Technical Support", "Deactivation Form"] }
    ],
    waste: [
      { title: "Waste Management", status: "Scheduled", description: "Collection and disposal services.", links: ["Apply New", "Track Request"] }
    ],
    municipal: [
      { title: "Municipal Services", status: "Public", description: "Property tax and official records.", links: ["Update Name", "Change Address", "Track Request"] }
    ]
  };

  const currentServices = allServices[serviceId] || [];

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24 px-4 relative overflow-hidden">
      {/* Animated Background blobs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-100 rounded-full blur-[100px] opacity-50 animate-pulse"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-emerald-50 rounded-full blur-[100px] opacity-50"></div>

      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-16 text-center animate-in fade-in slide-in-from-top-6 duration-1000">
            <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full mb-6 border border-indigo-100">
               <Search size={14} className="text-indigo-600" />
               <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">{t("Citizen Service Portal")}</span>
            </div>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter capitalize leading-tight">
              {serviceId} <span className="text-indigo-600">{t("Services")}</span>
            </h1>
            <p className="text-slate-500 mt-6 text-xl font-medium max-w-xl mx-auto">{t("Access official municipal utilities and digital certificates instantly.")}</p>
        </header>
        
        {activeForm ? (
          <FormView formKey={activeForm} onBack={() => setActiveForm(null)} />
        ) : (
          <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {currentServices.length > 0 ? (
                currentServices.map((s, i) => <ServiceCard key={i} {...s} onLinkClick={setActiveForm} />)
            ) : (
                <div className="text-center p-24 bg-white/50 backdrop-blur-sm rounded-[3rem] border-4 border-dashed border-slate-200">
                    <p className="text-slate-400 font-black uppercase tracking-widest text-sm">{t("Select Category from Menu")}</p>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;