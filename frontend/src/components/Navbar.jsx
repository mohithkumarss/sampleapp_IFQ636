import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close dropdown if user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generative avatar helper
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].substring(0, 2).toUpperCase();
  };

  // Sleek pill-based active states (Emerald Theme)
  const getNavPillStyle = (path) => {
    const isActive = location.pathname === path;
    return `relative px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 ${
      isActive
        ? "text-emerald-950 bg-emerald-50/80 shadow-[0_1px_2px_rgb(0,0,0,0.02)]"
        : "text-emerald-700/70 hover:text-emerald-950 hover:bg-emerald-50/50"
    }`;
  };

  return (
    <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      {/* FLOATING ISLAND CONTAINER */}
      <nav className="pointer-events-auto w-full max-w-[1000px] bg-white/70 backdrop-blur-xl border border-emerald-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-2xl px-4 py-2.5 flex justify-between items-center transition-all">
        {/* BRANDING */}
        <Link to="/" className="flex items-center gap-2.5 group mr-8">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-lg flex items-center justify-center shadow-md ring-1 ring-emerald-900/10 group-hover:scale-105 transition-transform duration-300">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6a8 8 0 1 0 0 12" />
            </svg>
          </div>
          <span className="text-lg font-black tracking-tighter text-emerald-950 hidden sm:block">
            Carbon<span className="text-emerald-600/70">Tracker</span>
          </span>
        </Link>

        {/* NAVIGATION & ACTIONS */}
        <div className="flex items-center gap-2 flex-grow justify-end">
          {user ? (
            <>
              {/* PRIMARY NAV PILLS */}
              <div className="flex items-center gap-1 mr-4">
                <Link to="/home" className={getNavPillStyle("/home")}>
                  Dashboard
                </Link>
                <Link to="/reports" className={getNavPillStyle("/reports")}>
                  Reports
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin" className={getNavPillStyle("/admin")}>
                    <span className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-900"></div>
                      Admin Console
                    </span>
                  </Link>
                )}
              </div>

              {/* VERTICAL DIVIDER */}
              <div className="w-px h-6 bg-emerald-100/80 mr-2"></div>

              {/* INTERACTIVE USER DROPDOWN */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2.5 hover:bg-emerald-50/50 p-1.5 rounded-xl transition-colors focus:outline-none"
                >
                  <div className="hidden md:flex flex-col items-end mr-1">
                    <span className="text-xs font-bold text-emerald-950 leading-none tracking-tight">
                      {user.name || "User"}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-600/70 uppercase tracking-widest mt-0.5">
                      {user.role || "Standard"}
                    </span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-emerald-100/50 text-emerald-800 flex items-center justify-center text-[11px] font-black tracking-wider ring-1 ring-inset ring-emerald-200/50 shadow-sm">
                    {getInitials(user.name || user.email)}
                  </div>
                </button>

                {/* DROPDOWN MENU */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-emerald-100/80 shadow-[0_10px_40px_rgb(0,0,0,0.08)] rounded-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-emerald-50 mb-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600/70">
                        Signed in as
                      </p>
                      <p className="text-sm font-semibold text-emerald-950 truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm font-medium text-emerald-700 hover:text-emerald-950 hover:bg-emerald-50/50 transition-colors"
                    >
                      Account Settings
                    </Link>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center px-4 py-2 mt-1 text-sm font-medium text-emerald-700/70 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* GUEST STATE */
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-emerald-700 hover:text-emerald-950 transition-colors rounded-lg hover:bg-emerald-50/50"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-emerald-900 hover:bg-emerald-800 text-white text-sm font-semibold px-5 py-2 rounded-lg shadow-[0_2px_10px_rgb(0,0,0,0.1)] transition-all ring-1 ring-emerald-900/10"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
