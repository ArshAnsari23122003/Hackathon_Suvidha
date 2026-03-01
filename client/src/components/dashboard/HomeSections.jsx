import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Zap, Droplet, Trash2, Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";

/* ===============================
   1️⃣ LIVE SERVICE STATUS BAR
================================= */
const ServiceStatusBar = () => {
  const { t } = useTranslation();

  const statuses = [
    t("statusElectricity"),
    t("statusWater"),
    t("statusWaste"),
    t("statusMunicipal"),
  ];

  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % statuses.length);
        setFade(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [statuses.length]);

  return (
    <div className="bg-indigo-600 text-white py-2 text-center font-medium">
      <span className={`transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`}>
        {statuses[index]}
      </span>
    </div>
  );
};

/* ===============================
   2️⃣ QUICK SERVICES GRID
================================= */
const QuickServices = () => {
  const { t } = useTranslation();

  const services = [
    { name: t("electricity"), icon: <Zap size={32} />, path: "/services/electricity" },
    { name: t("water"), icon: <Droplet size={32} />, path: "/services/water" },
    { name: t("waste"), icon: <Trash2 size={32} />, path: "/services/waste" },
    { name: t("municipal"), icon: <Building2 size={32} />, path: "/services/municipal" },
  ];

  return (
    <section className="py-20 px-6 md:px-20 bg-white">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
        {t("quickServices")}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {services.map((service, i) => (
          <Link
            key={i}
            to={service.path}
            className="bg-indigo-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition duration-300 flex flex-col items-center gap-4 hover:-translate-y-2"
          >
            <div className="text-indigo-600">{service.icon}</div>
            <h3 className="font-semibold text-gray-800">
              {service.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

/* ===============================
   3️⃣ AUTO NEWS SLIDER
================================= */
const NewsSlider = () => {
  const { t } = useTranslation();

  const news = [
    { title: t("news1Title"), desc: t("news1Desc") },
    { title: t("news2Title"), desc: t("news2Desc") },
    { title: t("news3Title"), desc: t("news3Desc") },
  ];

  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % news.length);
        setFade(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [news.length]);

  return (
    <section className="py-20 bg-indigo-50 px-6 md:px-20 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-12">
        {t("latestAnnouncements")}
      </h2>

      <div className={`max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-md transition duration-300 ${fade ? "opacity-100" : "opacity-0"}`}>
        <h3 className="text-xl font-semibold text-indigo-600">
          {news[index].title}
        </h3>
        <p className="text-gray-600 mt-4">
          {news[index].desc}
        </p>
      </div>
    </section>
  );
};

/* ===============================
   4️⃣ APP DOWNLOAD SECTION
================================= */
const AppDownload = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-indigo-600 text-white text-center px-6">
      <h2 className="text-4xl font-bold mb-6">
        {t("downloadApp")}
      </h2>

      <p className="max-w-xl mx-auto mb-10 text-indigo-100">
        {t("appDesc")}
      </p>

      <div className="flex justify-center gap-6 flex-wrap">
        <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:scale-105 transition">
          Play Store
        </button>

        <button className="border border-white px-8 py-3 rounded-lg hover:bg-white hover:text-indigo-600 transition">
          App Store
        </button>
      </div>
    </section>
  );
};

/* ===============================
   5️⃣ TESTIMONIALS
================================= */
const Testimonials = () => {
  const { t } = useTranslation();

  const reviews = [
    { name: "Ramesh Kumar", text: t("review1") },
    { name: "Anjali Verma", text: t("review2") },
  ];

  return (
    <section className="py-24 px-6 md:px-20 bg-white text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-16">
        {t("citizenFeedback")}
      </h2>

      <div className="grid md:grid-cols-2 gap-10">
        {reviews.map((review, i) => (
          <div key={i} className="bg-indigo-50 p-10 rounded-3xl shadow-sm hover:shadow-md transition duration-300">
            <p className="text-gray-700 italic">
              "{review.text}"
            </p>
            <h4 className="mt-6 font-semibold text-indigo-600">
              — {review.name}
            </h4>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ===============================
   EXPORT MAIN
================================= */
const HomeSections = () => {
  return (
    <>
      <ServiceStatusBar />
      <QuickServices />
      <NewsSlider />
      <AppDownload />
      <Testimonials />
    </>
  );
};

export default HomeSections;