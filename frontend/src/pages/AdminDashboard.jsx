import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import EmissionFactorForm from "../components/EmissionFactorForm";
import AdminActivityList from "../components/AdminActivityList";

// Colors mimicking your Figma design
const COLORS = ["#ef4444", "#eab308", "#22c55e", "#3b82f6"]; // Red, Yellow, Green, Blue

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, totalEmissions: 0 });
  const [users, setUsers] = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Promise.all lets us fetch all three Admin APIs at the exact same time to load the dashboard faster
      const [statsRes, usersRes, breakdownRes] = await Promise.all([
        axiosInstance.get("/api/admin/stats"),
        axiosInstance.get("/api/admin/users"),
        axiosInstance.get("/api/reports/breakdown"),
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);

      // Format data for Recharts Doughnut
      const chartData = breakdownRes.data.map((item) => ({
        name: item._id,
        value: item.total,
      }));
      setBreakdown(chartData);
    } catch (error) {
      console.error("Error fetching admin data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Delete this user and ALL their data permanently?")) {
      try {
        await axiosInstance.delete(`/api/admin/users/${id}`);
        fetchAdminData(); // Refresh everything
      } catch (error) {
        alert("Error deleting user");
      }
    }
  };

  if (loading)
    return (
      <div className="text-center mt-20 text-green-700 font-bold">
        Loading Platform Stats...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-800">Admin Panel</h1>
        <span className="bg-green-600 text-white px-4 py-2 rounded-full font-bold">
          A
        </span>
      </div>

      {/* THREE COLUMN GRID - Combining Figma Screens 1, 2, and 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* COLUMN 1: System Stats (Figma Screen 1) */}
        <div className="bg-green-50 p-6 rounded-xl shadow border border-green-200 flex flex-col gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100 flex justify-between items-center">
            <span className="text-green-700 font-bold">Total Users</span>
            <span className="text-2xl font-black text-gray-800">
              {stats?.userCount ?? 0}
            </span>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100 flex justify-between items-center">
            <span className="text-green-700 font-bold">Total Emissions</span>
            <span className="text-2xl font-black text-red-500">
              {Number(stats?.totalEmissions || 0).toFixed(2)} kg CO₂
            </span>
          </div>
        </div>

        {/* COLUMN 2: Activity Breakdown Chart (Figma Screen 3) */}
        <div className="bg-green-50 p-6 rounded-xl shadow border border-green-200">
          <h3 className="font-bold text-green-800 mb-4">Activity Breakdown</h3>
          <div className="h-48 bg-white rounded-lg shadow-sm border border-green-100">
            {breakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdown}
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {breakdown.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${value.toFixed(2)} kg CO₂`}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                No data available yet
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 3: User Management (Figma Screen 2) */}
        <div className="bg-green-50 p-6 rounded-xl shadow border border-green-200 col-span-1 md:col-span-3 lg:col-span-1">
          <h3 className="font-bold text-green-800 mb-4">Recent Users</h3>
          <div className="bg-white rounded-lg shadow-sm border border-green-100 max-h-64 overflow-y-auto">
            <ul className="divide-y divide-gray-100">
              {users.map((u) => (
                <li
                  key={u._id}
                  className="p-3 flex justify-between items-center hover:bg-gray-50"
                >
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{u.name}</p>
                    <p className="text-xs text-green-600">{u.email}</p>
                  </div>
                  {u.role !== "admin" && (
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 font-bold"
                    >
                      Delete
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <EmissionFactorForm />
      <AdminActivityList />
    </div>
  );
};

export default AdminDashboard;
