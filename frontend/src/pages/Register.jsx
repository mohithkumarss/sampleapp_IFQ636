import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post("/api/auth/register", formData);

      // Backend logs them in immediately upon successful registration
      const { token, user } = response.data;
      login(user, token);

      // Send new normal users straight to their dashboard
      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-[400px] w-full space-y-8">
        {/* BRAND HEADER */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-emerald-900/10 mb-6 group hover:scale-105 transition-transform duration-300">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6a8 8 0 1 0 0 12" />
            </svg>
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-emerald-950">
            Create an account
          </h2>
          <p className="mt-2 text-sm font-medium text-emerald-700/70">
            Join CarbonTracker to start monitoring your footprint
          </p>
        </div>

        {/* REGISTRATION CARD */}
        <div className="bg-white py-8 px-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl border border-emerald-100 sm:px-10">
          {error && (
            <div className="mb-6 bg-red-50/50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-500 mt-0.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm font-semibold text-red-800 tracking-tight">
                {error}
              </p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Leokonda"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full bg-[#FAFAFA] border border-emerald-100 text-emerald-950 text-sm rounded-xl focus:ring-emerald-900 focus:border-emerald-900 focus:bg-white block p-3.5 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full bg-[#FAFAFA] border border-emerald-100 text-emerald-950 text-sm rounded-xl focus:ring-emerald-900 focus:border-emerald-900 focus:bg-white block p-3.5 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="w-full bg-[#FAFAFA] border border-emerald-100 text-emerald-950 text-sm rounded-xl focus:ring-emerald-900 focus:border-emerald-900 focus:bg-white block p-3.5 transition-all outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-3.5 px-4 mt-2 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-emerald-900 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Setting up account...
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-emerald-50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-[10px] font-bold uppercase tracking-widest text-emerald-600/70">
                Already have an account?
              </span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm font-bold text-emerald-700/80 hover:text-emerald-950 transition-colors"
            >
              Log in to your dashboard &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
