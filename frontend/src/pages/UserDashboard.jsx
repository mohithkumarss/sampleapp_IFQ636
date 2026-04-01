import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import CarbonChart from "../components/CarbonChart";
import Recommendations from "../components/Recommendations";

const UserDashboard = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [formData, setFormData] = useState({ type: "Transport", distance: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch activities on load
  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const { data } = await axiosInstance.get("/api/activities");
      setActivities(data);
    } catch (error) {
      console.error("Error fetching activities", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing activity
        await axiosInstance.put(`/api/activities/${editingId}`, formData);
        setEditingId(null);
      } else {
        // Create new activity
        await axiosInstance.post("/api/activities", formData);
      }
      setFormData({ type: "Transport", distance: "" }); // Reset form
      fetchActivities(); // Refresh list
    } catch (error) {
      alert(error.response?.data?.message || "Error saving activity.");
    }
  };

  const handleEdit = (activity) => {
    setEditingId(activity._id);
    setFormData({ type: activity.type, distance: activity.distance });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        await axiosInstance.delete(`/api/activities/${id}`);
        fetchActivities();
      } catch (error) {
        alert("Error deleting activity.");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-8">
        Hello, {user?.name}! 👋
      </h1>

      <CarbonChart activities={activities} />
      <Recommendations />
      {/* ADD/EDIT ACTIVITY FORM */}
      <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-200 mb-8">
        <h2 className="text-xl font-bold text-green-700 mb-4">
          {editingId ? "Edit Activity" : "Log New Activity"}
        </h2>
        <form onSubmit={handleSubmit} className="flex gap-4 items-center">
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="p-3 border border-green-300 rounded focus:ring-2 focus:ring-green-500 w-1/3"
          >
            <option value="Transport">🚗 Transport</option>
            <option value="Electricity">💡 Electricity</option>
            <option value="Food">🍔 Food</option>
            <option value="Other">📦 Other</option>
          </select>
          <input
            type="number"
            placeholder="Value (e.g., miles or kWh)"
            value={formData.distance}
            onChange={(e) =>
              setFormData({ ...formData, distance: e.target.value })
            }
            className="p-3 border border-green-300 rounded focus:ring-2 focus:ring-green-500 w-1/3"
            required
            min="0.1"
            step="0.1"
          />
          <button
            type="submit"
            className="w-1/3 bg-green-600 hover:bg-green-700 text-white font-bold p-3 rounded transition duration-200"
          >
            {editingId ? "Update Log" : "Add to Tracker"}
          </button>
        </form>
      </div>

      {/* ACTIVITY FEED */}
      <h2 className="text-2xl font-bold text-green-800 mb-4">
        Your Recent Activities
      </h2>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div className="bg-white shadow rounded-xl overflow-hidden border border-gray-100">
          {activities.length === 0 ? (
            <p className="p-6 text-gray-500 text-center">
              No activities logged yet. Start tracking above!
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {activities.map((activity) => (
                <li
                  key={activity._id}
                  className="p-4 flex justify-between items-center hover:bg-green-50 transition"
                >
                  <div>
                    <span className="font-bold text-gray-800 text-lg">
                      {activity.type}
                    </span>
                    <p className="text-sm text-gray-500">
                      Value: {activity.distance} | Logged:{" "}
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="font-black text-red-500 bg-red-50 px-3 py-1 rounded-full">
                      +{activity.emission.toFixed(2)} kg CO₂
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(activity)}
                        className="text-blue-500 hover:text-blue-700 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(activity._id)}
                        className="text-red-500 hover:text-red-700 font-medium"
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
      )}
    </div>
  );
};

export default UserDashboard;
