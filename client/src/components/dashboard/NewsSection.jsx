import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const NewsSection = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const newsData = [
    {
      title: t("news1Title"),
      description: t("news1Desc"),
      category: t("municipal"),
      bg: "bg-indigo-600",
    },
    {
      title: t("news2Title"),
      description: t("news2Desc"),
      category: t("water"),
      bg: "bg-blue-500",
    },
    {
      title: t("news3Title"),
      description: t("news3Desc"),
      category: t("electricity"),
      bg: "bg-yellow-500",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % newsData.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [newsData.length]);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">

        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          {t("latestUpdates")}
        </h2>

        <p className="text-center text-gray-600 mb-12">
          {t("stayInformed")}
        </p>

        <div className="flex justify-center items-center gap-8 flex-wrap">
          {newsData.map((news, index) => (
            <div
              key={index}
              className={`group w-64 h-72 [perspective:1000px] transition-all duration-500 ${
                index === activeIndex ? "scale-110" : "opacity-60"
              }`}
            >
              <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

                {/* Front */}
                <div className="absolute w-full h-full [backface-visibility:hidden] flex flex-col items-center justify-center rounded-xl bg-white border border-gray-200 shadow-md p-6 text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {news.title}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {news.category}
                  </span>
                </div>

                {/* Back */}
                <div
                  className={`absolute w-full h-full [backface-visibility:hidden] rounded-xl text-white p-6 flex flex-col justify-center ${news.bg} [transform:rotateY(180deg)]`}
                >
                  <h3 className="text-lg font-semibold mb-3">
                    {news.category}
                  </h3>
                  <p className="text-sm">{news.description}</p>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default NewsSection;