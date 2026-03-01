import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Navigation, CheckCircle2, Send } from "lucide-react";
import L from "leaflet";
import axios from "axios"; // Added axios
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ setUserLocation, userLocation }) {
  useMapEvents({
    click(e) {
      setUserLocation([e.latlng.lat, e.latlng.lng]);
    },
  });
  return userLocation ? <Marker position={userLocation} icon={defaultIcon} /> : null;
}

const ComplaintForm = () => {
  const { service, type } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [locationMode, setLocationMode] = useState("manual");
  const [userLocation, setUserLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    description: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useState("");

  const formatType = (text) => text?.replace(/-/g, " ");

  const handleGetLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported.");
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => alert("Please allow location access.")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const generatedToken = `SRN-${Math.floor(10000000 + Math.random() * 90000000)}`;
    
    const newComplaint = {
      srn: generatedToken,
      citizen: formData.name,
      phone: formData.phone,
      dept: service,
      category: formatType(type),
      status: "Pending",
      location: locationMode === "manual" ? formData.address : "Pinned on Map",
      coordinates: userLocation ? { lat: userLocation[0], lng: userLocation[1] } : null,
      remarks: "Technician will be assigned shortly.",
      description: formData.description
    };

    try {
      // POST TO YOUR BACKEND
      const response = await axios.post("http://localhost:5000/api/complaints/submit", newComplaint);
      if (response.data.success) {
        setToken(generatedToken);
        setSubmitted(true);
      }
    } catch (err) {
      alert("Error submitting complaint. Please check if server is running.");
      console.error(err);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen py-16 px-4 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-100 via-white to-purple-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/90 backdrop-blur-md border border-emerald-100 shadow-2xl rounded-3xl p-10 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-emerald-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">{t("complaintLogged")}</h2>
          <p className="text-slate-500 mb-8 font-medium">{t("successDesc")}</p>
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6 mb-8">
            <p className="text-xs text-purple-400 font-black mb-1 uppercase tracking-widest">{t("refNumber")}</p>
            <p className="text-3xl font-mono text-purple-700 font-bold">{token}</p>
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate(`/my-complaints`)} className="w-full px-6 py-4 rounded-xl font-black text-white bg-purple-600 shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all active:scale-95">
              Track Status Now
            </button>
            <button onClick={() => navigate("/")} className="w-full px-6 py-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all">
              {t("backToDashboard")}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-100 via-white to-purple-50">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-2xl mx-auto bg-white/80 backdrop-blur-xl border border-purple-100 shadow-2xl rounded-3xl p-8 md:p-12">
        <header className="mb-10">
          <motion.button whileHover={{ x: -5 }} onClick={() => navigate(-1)} className="flex items-center text-purple-600 font-bold text-sm mb-6 group">
            <ArrowLeft size={18} className="mr-2" /> {t("backToServices")}
          </motion.button>
          <div className="flex items-baseline gap-3 flex-wrap">
            <h2 className="text-4xl font-black text-purple-950 capitalize">{t(service)}</h2>
            <span className="text-emerald-600 font-black text-xs uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              {t(type) || formatType(type)}
            </span>
          </div>
          <p className="text-slate-400 mt-2 font-medium">{t("fillDetailsDesc") || "Fill the details below to log your issue."}</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">{t("fullName")}</label>
              <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border border-purple-100 rounded-xl p-4 bg-purple-50/30 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">{t("phone")}</label>
              <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full border border-purple-100 rounded-xl p-4 bg-purple-50/30 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all" placeholder="+91 XXXXX XXXXX" />
            </div>
          </div>

          <div className="bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
            <div className="flex gap-2 mb-4">
              <button type="button" onClick={() => setLocationMode("manual")} className={`flex-1 py-3 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${locationMode === "manual" ? "bg-white text-purple-600 shadow-md" : "text-slate-400 hover:text-slate-600"}`}>
                <MapPin size={16} /> {t("manualAddress")}
              </button>
              <button type="button" onClick={() => setLocationMode("map")} className={`flex-1 py-3 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${locationMode === "map" ? "bg-white text-purple-600 shadow-md" : "text-slate-400 hover:text-slate-600"}`}>
                <Navigation size={16} /> {t("useMap")}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {locationMode === "manual" ? (
                <motion.div key="manual" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                  <textarea required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder={t("enterFullAddress") || "H.No, Street, Landmark, Pincode..."} className="w-full border border-purple-50 rounded-xl p-4 bg-white min-h-[100px] outline-none focus:ring-2 focus:ring-purple-500" />
                </motion.div>
              ) : (
                <motion.div key="map" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <button type="button" onClick={handleGetLocation} className="w-full mb-3 py-3 bg-emerald-500 text-white rounded-xl text-xs font-black hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200">
                    {t("fetchLocation")}
                  </button>
                  <div className="rounded-2xl overflow-hidden border-2 border-white shadow-inner h-[250px] relative z-0">
                    <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }}>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <LocationMarker setUserLocation={setUserLocation} userLocation={userLocation} />
                    </MapContainer>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">{t("Describe Issue")}</label>
            <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder={t("describe Placeholder") || "Write your concern here..."} className="w-full border border-purple-100 rounded-xl p-4 bg-purple-50/30 focus:bg-white focus:ring-2 focus:ring-purple-500 min-h-[120px] outline-none transition-all" />
          </div>

          <button type="submit" className="w-full py-5 bg-purple-600 text-white font-black rounded-2xl shadow-xl shadow-purple-200 hover:bg-purple-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
            <Send size={20} /> {t("Submit Complaint")}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ComplaintForm;