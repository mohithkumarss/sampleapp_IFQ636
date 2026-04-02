import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import CarbonChart from "../components/CarbonChart";
import Recommendations from "../components/Recommendations";
import toast from "react-hot-toast";

const UserDashboard = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [formData, setFormData] = useState({ type: "Transport", distance: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const { data } = await axiosInstance.get("/api/activities");
      setActivities(data);
    } catch (error) {
      console.error("Error fetching activities", error);
      toast.error("Failed to load activity feed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await axiosInstance.put(`/api/activities/${editingId}`, formData);
        toast.success("Activity updated successfully.");
        setEditingId(null);
      } else {
        await axiosInstance.post("/api/activities", formData);
        toast.success("Activity logged successfully.");
      }
      setFormData({ type: "Transport", distance: "" });
      fetchActivities();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving activity.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (activity) => {
    setEditingId(activity._id);
    setFormData({ type: activity.type, distance: activity.distance });
    // Scroll smoothly back to the form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Permanently delete this activity record?")) {
      try {
        await axiosInstance.delete(`/api/activities/${id}`);
        toast.success("Activity removed.");
        fetchActivities();
      } catch (error) {
        toast.error("Error deleting activity.");
      }
    }
  };

  // Helper to render sleek icons for the activity feed
  const getCategoryIcon = (type) => {
    switch (type) {
      case "Transport":
        return "🚗";
      case "Electricity":
        return "⚡";
      case "Food":
        return "🍔";
      default:
        return "📦";
    }
  };

  // Full Page Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#FAFAFA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">
            Loading Dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto py-20 px-4 sm:px-6 font-sans">
      {/* HEADER SECTION */}
      <header className="mb-10 pt-4 pb-6 border-b border-gray-200/60 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Welcome back, {user?.name?.split(" ")[0] || "User"}
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-1">
            Track, analyze, and offset your carbon footprint.
          </p>
        </div>
      </header>

      {/* TOP GRID: Chart & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        <div className="lg:col-span-8">
          <CarbonChart activities={activities} />
        </div>
        <div className="lg:col-span-4 flex flex-col justify-end">
          <Recommendations />
        </div>
      </div>

      {/* LOG ACTIVITY FORM */}
      <div className="bg-white p-7 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-200/60 mb-10 transition-all">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-base font-bold text-gray-900 tracking-tight">
              {editingId ? "Edit Activity Record" : "Log New Activity"}
            </h2>
            <p className="text-xs font-medium text-gray-500 mt-0.5">
              {editingId
                ? "Update your previously logged entry below."
                : "Enter your consumption data to track emissions."}
            </p>
          </div>
          {editingId && (
            <div className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-amber-50 text-amber-600">
              Edit Mode
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-5 items-start md:items-end"
        >
          <div className="w-full md:w-1/3">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
              Category
            </label>
            <div className="relative">
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full bg-[#FAFAFA] border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-black focus:border-black focus:bg-white block p-3.5 transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="Transport">Transport</option>
                <option value="Electricity">Electricity</option>
                <option value="Food">Food</option>
                <option value="Other">Other</option>
              </select>
              {/* Custom Dropdown Arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/3">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
              Input Value
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="e.g. 50"
                value={formData.distance}
                onChange={(e) =>
                  setFormData({ ...formData, distance: e.target.value })
                }
                className="w-full bg-[#FAFAFA] border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-black focus:border-black focus:bg-white block p-3.5 pr-16 transition-all outline-none"
                required
                min="0.1"
                step="0.1"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                units
              </span>
            </div>
          </div>

          <div className="w-full md:w-1/3 flex gap-2">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ type: "Transport", distance: "" });
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold p-3.5 rounded-xl transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-[2] text-white text-sm font-semibold p-3.5 rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.1)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                editingId
                  ? "bg-gray-900 hover:bg-black"
                  : "bg-black hover:bg-gray-800"
              }`}
            >
              {isSubmitting && (
                <svg
                  className="animate-spin h-4 w-4 text-white"
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
              )}
              {editingId ? "Save Edits" : "Log Activity"}
            </button>
          </div>
        </form>
      </div>

      {/* ACTIVITY FEED */}
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-200/60 overflow-hidden">
        <div className="px-7 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-bold text-gray-900 tracking-tight">
              Recent Activity Feed
            </h2>
            <p className="text-[11px] font-medium text-gray-500 mt-0.5">
              Chronological record of your inputs
            </p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {activities.length} Logs
          </span>
        </div>

        {activities.length === 0 ? (
          <div className="p-10 flex flex-col items-center text-center text-gray-400">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-200 mb-3 flex items-center justify-center text-xl">
              🌱
            </div>
            <p className="text-sm font-bold tracking-tight text-gray-500">
              Your feed is empty
            </p>
            <p className="text-xs font-medium tracking-wide mt-1">
              Log your first activity above to see it here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {activities.map((activity) => (
              <li
                key={activity._id}
                className="p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center group hover:bg-[#FAFAFA] transition-colors gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg shadow-inner ring-1 ring-inset ring-gray-200/50 shrink-0">
                    {getCategoryIcon(activity.type)}
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 text-sm tracking-tight block mb-0.5">
                      {activity.type}
                    </span>
                    <p className="text-[11px] text-gray-500 font-medium tracking-wide">
                      Input: {activity.distance} units{" "}
                      <span className="mx-1.5 opacity-50">•</span>{" "}
                      {new Date(activity.createdAt).toLocaleDateString(
                        undefined,
                        { month: "short", day: "numeric", year: "numeric" },
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 ml-14 sm:ml-0">
                  <div className="flex flex-col items-start sm:items-end">
                    <span className="font-black text-gray-900 text-base leading-none tracking-tighter">
                      +{activity.emission.toFixed(2)}
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                      kg CO₂
                    </span>
                  </div>

                  <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleEdit(activity)}
                      className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900 bg-white border border-gray-200 hover:border-gray-900 hover:bg-gray-50 px-3 py-1.5 rounded-md transition-all duration-200 shadow-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(activity._id)}
                      className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-600 bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-md transition-all duration-200 shadow-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
