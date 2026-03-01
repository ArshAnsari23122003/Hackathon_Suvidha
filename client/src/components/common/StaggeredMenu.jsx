import React, { useRef, useState, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";

const StaggeredMenu = ({
  position = "right",
  items = [],
  accentColor = "#4f46e5",
}) => {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const panelRef = useRef(null);
  const iconRef = useRef(null);

  useLayoutEffect(() => {
    if (!panelRef.current) return;

    gsap.set(panelRef.current, {
      xPercent: position === "right" ? 100 : -100,
    });
  }, [position]);

  // OPEN MENU
  const openMenu = () => {
    setOpen(true);

    gsap.to(panelRef.current, {
      xPercent: 0,
      duration: 0.6,
      ease: "power4.out",
    });

    gsap.to(iconRef.current, {
      rotate: 225,
      duration: 0.5,
      ease: "power3.out",
    });

    // Faster text stagger
    gsap.fromTo(
      ".menu-item",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.07,
        duration: 0.5,
        delay: 0.15,
        ease: "power3.out",
        clearProps: "all",
      }
    );
  };

  // CLOSE MENU
  const closeMenu = () => {
    setServicesOpen(false);

    gsap.to(panelRef.current, {
      xPercent: position === "right" ? 100 : -100,
      duration: 0.45,
      ease: "power3.inOut",
    });

    gsap.to(iconRef.current, {
      rotate: 0,
      duration: 0.4,
      ease: "power3.inOut",
    });

    setOpen(false);
  };

  const toggleMenu = () => {
    open ? closeMenu() : openMenu();
  };

  // SERVICES DROPDOWN
  const toggleServices = () => {
    setServicesOpen(!servicesOpen);

    gsap.fromTo(
      ".service-child",
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.06,
        duration: 0.4,
        ease: "power2.out",
      }
    );
  };

  return (
    <div className="relative z-50">
      {/* Toggle Button */}
      <button
        onClick={toggleMenu}
        className="flex items-center gap-3 text-lg font-medium"
        style={{ color: accentColor }}
      >
        <span>{open ? "Close" : "Menu"}</span>

        {/* + to X */}
        <div ref={iconRef} className="relative w-6 h-6 transition-all">
          <span className="absolute top-1/2 left-0 w-full h-[2px] bg-current -translate-y-1/2"></span>
          <span className="absolute left-1/2 top-0 h-full w-[2px] bg-current -translate-x-1/2"></span>
        </div>
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        />
      )}

      {/* Panel */}
      <aside
        ref={panelRef}
        className={`fixed top-0 ${
          position === "right" ? "right-0" : "left-0"
        } h-screen w-[85%] sm:w-[420px] bg-white shadow-2xl flex flex-col justify-between p-12`}
      >
        {/* Menu Items */}
        <ul className="flex flex-col gap-8 text-2xl tracking-wide">
          {items.map((item, index) => {
            const formattedIndex = String(index + 1).padStart(2, "0");

            if (item.type === "services") {
              return (
                <li key={index} className="menu-item">
                  <div
                    onClick={toggleServices}
                    className="flex items-center justify-between cursor-pointer hover:opacity-70 transition"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-400">
                        {formattedIndex}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    <span
                      className={`transition-transform duration-300 ${
                        servicesOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </div>

                  {/* Dropdown */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      servicesOpen ? "max-h-96 mt-6" : "max-h-0"
                    }`}
                  >
                    <ul className="flex flex-col gap-5 pl-8 text-lg text-gray-600">
                      {item.children.map((child, i) => (
                        <li key={i} className="service-child">
                          <Link
                            to={child.link}
                            onClick={closeMenu}
                            className="hover:text-indigo-600 transition"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            }

            return (
              <li key={index} className="menu-item">
                <Link
                  to={item.link}
                  onClick={closeMenu}
                  className="flex items-center gap-4 hover:opacity-70 transition"
                >
                  <span className="text-xs text-gray-400">
                    {formattedIndex}
                  </span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
};

export default StaggeredMenu;