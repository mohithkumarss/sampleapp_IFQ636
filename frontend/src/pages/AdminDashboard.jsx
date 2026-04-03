import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import EmissionFactorForm from "../components/EmissionFactorForm";
import AdminActivityList from "../components/AdminActivityList";

// Premium Emerald Sequence (Tailwind Emerald 950 -> 300)
const COLORS = ["#022c22", "#065f46", "#059669", "#34d399", "#6ee7b7"];

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
      const [statsRes, usersRes, breakdownRes] = await Promise.all([
        axiosInstance.get("/api/admin/stats"),
        axiosInstance.get("/api/admin/users"),
        axiosInstance.get("/api/admin/reports/breakdown"),
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setBreakdown(breakdownRes.data);
    } catch (error) {
      console.error("Error fetching admin data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (
      window.confirm(
        "Permanently revoke this user's access and delete all data?",
      )
    ) {
      try {
        await axiosInstance.delete(`/api/admin/users/${id}`);
        fetchAdminData();
      } catch (error) {
        alert("Error deleting user");
      }
    }
  };

  // Helper to generate sleek initials for the user avatars
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-5 h-5 border-2 border-emerald-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-medium text-emerald-800 uppercase tracking-widest">
            Initializing Environment
          </p>
        </div>
      </div>
    );
  }
  const renderLegendText = (value) => {
    return (
      <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase ml-1">
        {value}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-emerald-950 pb-20 mt-10">
      <div className="max-w-[1200px] mx-auto px-6 pt-12">
        {/* HEADER SECTION */}
        <header className="flex justify-between items-end mb-12 pb-6 border-b border-emerald-100">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter text-emerald-950">
              Admin Console.
            </h1>
            <p className="text-sm font-medium text-emerald-700/70 tracking-tight">
              Manage system configurations and monitor platform activity.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full border border-emerald-100/50 shadow-[0_2px_8px_rgb(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgb(0,0,0,0.06)] transition-all cursor-pointer">
            <div className="flex flex-col items-end">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600/70 leading-none">
                Session
              </span>
              <span className="text-sm font-semibold text-emerald-950 leading-tight">
                Administrator
              </span>
            </div>
            <div className="h-8 w-8 bg-gradient-to-br from-emerald-800 to-emerald-950 text-white flex items-center justify-center rounded-full text-sm font-bold ring-2 ring-white shadow-sm">
              A
            </div>
          </div>
        </header>

        {/* METRICS & OVERVIEW GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          {/* COLUMN 1: System Stats (Spans 4 columns) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Total Emissions Card - Dark Emerald Mode */}
            <div className="relative overflow-hidden bg-gradient-to-b from-emerald-900 to-emerald-950 p-7 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-emerald-800 group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                {/* Abstract decorative SVG */}
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-emerald-100/70 uppercase tracking-widest mb-1">
                Total Footprint
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-5xl font-black text-white tracking-tighter">
                  {Number(stats?.totalEmissions || 0).toFixed(1)}
                </span>
                <span className="text-sm font-medium text-emerald-200/60">
                  kg CO₂
                </span>
              </div>
            </div>

            {/* Total Users Card - Light Mode */}
            <div className="bg-white p-7 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-emerald-100 hover:border-emerald-200 transition-colors">
              <p className="text-xs font-semibold text-emerald-600/70 uppercase tracking-widest mb-1">
                Active Accounts
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-black text-emerald-950 tracking-tighter">
                  {stats?.userCount ?? 0}
                </span>
                <span className="text-sm font-medium text-emerald-600/50">
                  users
                </span>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Activity Breakdown Chart (Spans 4 columns) */}
          <div className="lg:col-span-4 bg-white p-7 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-emerald-100 flex flex-col">
            <div className="mb-6">
              <h3 className="text-base font-bold text-emerald-950 tracking-tight">
                Emissions by Category
              </h3>
              <p className="text-xs font-medium text-emerald-700/70 mt-0.5">
                Distribution across all tracked activities
              </p>
            </div>

            <div className="flex-grow min-h-[220px] flex items-center justify-center relative">
              {breakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={breakdown}
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={4} // Sleek rounded edges on the pie slices
                    >
                      {breakdown.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      cursor={false}
                      contentStyle={{
                        backgroundColor: "#022c22", // Emerald-950
                        borderRadius: "12px",
                        border: "1px solid #064e3b", // Emerald-900
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                        color: "#fff",
                        padding: "10px 14px",
                      }}
                      itemStyle={{
                        color: "#ecfdf5", // Emerald-50
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                      formatter={(value, name) => [
                        `${value.toFixed(2)} kg CO₂`,
                        name,
                      ]}
                      labelStyle={{ display: "none" }}
                    />

                    <Legend
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                      iconSize={6}
                      layout="horizontal"
                      wrapperStyle={{ paddingTop: "20px" }}
                      formatter={renderLegendText}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-emerald-700/60 space-y-2">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-emerald-200"></div>
                  <span className="text-xs font-medium uppercase tracking-widest">
                    No Data
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 3: User Management (Spans 4 columns) */}
          <div className="lg:col-span-4 bg-white p-0 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-emerald-100 flex flex-col overflow-hidden">
            <div className="p-7 border-b border-emerald-50 bg-emerald-50/30">
              <h3 className="text-base font-bold text-emerald-950 tracking-tight">
                Access Management
              </h3>
              <p className="text-xs font-medium text-emerald-700/70 mt-0.5">
                Recent system registrations
              </p>
            </div>

            <div
              className="flex-grow overflow-y-auto"
              style={{ maxHeight: "300px" }}
            >
              <ul className="divide-y divide-emerald-50">
                {users.map((u) => (
                  <li
                    key={u._id}
                    className="p-4 flex justify-between items-center group hover:bg-emerald-50/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {/* Generative Avatar */}
                      <div className="h-9 w-9 rounded-full bg-emerald-100/50 text-emerald-800 flex items-center justify-center text-xs font-bold tracking-wider ring-1 ring-inset ring-emerald-200/50">
                        {getInitials(u.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-emerald-950 text-sm tracking-tight">
                          {u.name}
                        </p>
                        <p className="text-[11px] text-emerald-700/70 font-medium tracking-wide">
                          {u.email}
                        </p>
                      </div>
                    </div>
                    {u.role !== "admin" && (
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="opacity-0 group-hover:opacity-100 text-[10px] uppercase tracking-widest font-bold text-emerald-600/50 hover:text-red-600 bg-white border border-emerald-200 hover:border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-md transition-all duration-200 shadow-sm"
                      >
                        Revoke
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM COMPONENTS */}
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white p-0 rounded-2xl border-none">
            <EmissionFactorForm />
          </div>
          <div className="bg-white p-0 rounded-2xl border-none">
            <AdminActivityList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
