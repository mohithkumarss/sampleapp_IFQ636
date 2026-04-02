import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";
import toast from "react-hot-toast";

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    university: "",
    address: "",
  });

  // Separated loading states for a smoother UX
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/api/auth/profile", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setFormData({
          name: response.data.name || "",
          email: response.data.email || "",
          university: response.data.university || "",
          address: response.data.address || "",
        });
      } catch (error) {
        toast.error("Failed to load profile data.");
      } finally {
        setIsFetching(false);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axiosInstance.put("/api/auth/profile", formData, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to generate the profile avatar
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    return parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].substring(0, 2).toUpperCase();
  };

  if (isFetching) {
    return (
      <div className="max-w-2xl mx-auto w-full flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">
            Loading Profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full py-12 px-4 sm:px-0">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-200/60 p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 flex items-center justify-center text-2xl font-black tracking-wider ring-4 ring-white shadow-sm shrink-0">
          {getInitials(formData.name || formData.email)}
        </div>
        <div className="pt-1">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            {formData.name || "User Profile"}
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-1">
            Manage your personal information and platform settings.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-200/60 overflow-hidden">
        <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 className="text-sm font-bold text-gray-900 tracking-tight">
            Account Details
          </h2>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Settings
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Top Row: Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Jane Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-[#FAFAFA] border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-black focus:border-black focus:bg-white block p-3.5 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="jane@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-[#FAFAFA] border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-black focus:border-black focus:bg-white block p-3.5 transition-all outline-none"
              />
            </div>
          </div>

          {/* Bottom Row: Organization & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                Organization / University
              </label>
              <input
                type="text"
                placeholder="e.g. Stanford University"
                value={formData.university}
                onChange={(e) =>
                  setFormData({ ...formData, university: e.target.value })
                }
                className="w-full bg-[#FAFAFA] border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-black focus:border-black focus:bg-white block p-3.5 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="City, Country"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full bg-[#FAFAFA] border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-black focus:border-black focus:bg-white block p-3.5 transition-all outline-none"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 mt-2 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white text-sm font-semibold px-8 py-3.5 rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  Saving Changes...
                </>
              ) : (
                "Save Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
