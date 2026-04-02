import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../axiosConfig";

const AdminActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllActivities = async () => {
    try {
      const res = await axiosInstance.get("/api/admin/activities");
      setActivities(res.data);
    } catch (error) {
      console.error("Error fetching all activities", error);
      toast.error("Failed to load system activities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllActivities();
  }, []);

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "WARNING: Are you sure you want to delete this user's activity? This cannot be undone.",
      )
    )
      return;

    try {
      await axiosInstance.delete(`/api/admin/activities/${id}`);
      toast.success("Activity permanently deleted.");
      fetchAllActivities();
    } catch (error) {
      toast.error("Failed to delete activity.");
      console.error(error);
    }
  };

  // Helper for generative avatars (keeps consistency with the dashboard)
  const getInitials = (name) => {
    if (!name || name === "Unknown User") return "?";
    const parts = name.split(" ");
    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header section matches the dashboard aesthetic */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h3 className="text-base font-bold text-gray-900 tracking-tight">
            System-Wide Activity Log
          </h3>
          <p className="text-xs font-medium text-gray-500 mt-0.5">
            Master record of all tracked emissions
          </p>
        </div>
        <div className="text-xs font-bold text-gray-400 tracking-widest uppercase">
          {activities.length} Records
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl h-48 flex flex-col items-center justify-center text-gray-400 space-y-2">
          <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-200"></div>
          <span className="text-xs font-medium uppercase tracking-widest">
            No Activities Logged
          </span>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-200/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200/60">
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                    User Identity
                  </th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                    Category
                  </th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                    Input / Distance
                  </th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                    Calculated Emissions
                  </th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activities.map((act) => {
                  const userName = act.userId?.name || "Unknown User";
                  const userEmail = act.userId?.email || "Account deleted";

                  return (
                    <tr
                      key={act._id}
                      className="group hover:bg-[#FAFAFA] transition-colors"
                    >
                      {/* Identity Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[10px] font-bold tracking-wider ring-1 ring-inset ring-gray-200/50 flex-shrink-0">
                            {getInitials(userName)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm tracking-tight">
                              {userName}
                            </p>
                            <p className="text-[11px] text-gray-500 font-medium tracking-wide">
                              {userEmail}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category Column */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-600 capitalize">
                          {act.type}
                        </span>
                      </td>

                      {/* Input/Distance Column */}
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-gray-700">
                          {act.distance || "-"}
                        </span>
                      </td>

                      {/* Emissions Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm font-black text-gray-900">
                            {act.emission?.toFixed(2)}
                          </span>
                          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                            kg CO₂
                          </span>
                        </div>
                      </td>

                      {/* Action Column */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDelete(act._id)}
                          className="opacity-0 group-hover:opacity-100 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-red-600 bg-white border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-md transition-all duration-200 shadow-sm whitespace-nowrap"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminActivityList;
