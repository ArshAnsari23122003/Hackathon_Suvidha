import React from "react";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
  { code: "bn", name: "বাংলা" },
  { code: "ta", name: "தமிழ்" },
  { code: "te", name: "తెలుగు" },
  { code: "mr", name: "मराठी" },
  { code: "gu", name: "ગુજરાતી" },
];

const LanguageGate = ({ onSelect }) => {
  const { i18n } = useTranslation();

  const handleSelect = (code) => {
    localStorage.setItem("lang", code);
    i18n.changeLanguage(code);
    onSelect();
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 text-white animate-fadeIn">

      <h1 className="text-4xl font-bold mb-8 animate-slideDown">
        Select Your Language
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:scale-105 transition transform duration-300 shadow-md"
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageGate;