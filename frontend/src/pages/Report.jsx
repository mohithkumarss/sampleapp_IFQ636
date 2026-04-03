import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";

const Report = () => {
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const [activeTab, setActiveTab] = useState("monthly");
  const [reportData, setReportData] = useState([]);
  const [secondaryData, setSecondaryData] = useState([]); // Holds either Breakdown or Leaderboard
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Premium Emerald Sequence for Charts
  const COLORS = ["#022c22", "#065f46", "#059669", "#34d399", "#6ee7b7"];

  useEffect(() => {
    fetchReportData(activeTab);
  }, [activeTab]);

  const fetchReportData = async (timeframe) => {
    setIsLoading(true);
    try {
      // 1. Fetch the Trend Bar Chart Data (Always)
      const trendRes = await axiosInstance.get(
        `/api/reports/trend?timeframe=${timeframe}`,
      );
      const formattedTrend = trendRes.data.map((item) => ({
        period: item.period || item._id,
        value: Number(item.value || item.totalEmission || 0),
      }));
      setReportData(formattedTrend);

      // 2. Fetch the Dual-View Data based on Role
      if (isAdmin) {
        const boardRes = await axiosInstance.get("/api/reports/leaderboard");
        setSecondaryData(boardRes.data);
      } else {
        const breakRes = await axiosInstance.get("/api/reports/breakdown");
        const formattedBreakdown = breakRes.data.map((item) => ({
          name: item._id,
          value: item.total || 0,
        }));
        setSecondaryData(formattedBreakdown);
      }
    } catch (error) {
      console.error("Error fetching report", error);
      toast.error("Failed to load report data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    /* Same as before */
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    const element = document.getElementById("report-capture-area");
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.text(
        isAdmin ? "Platform Analytics Report" : "Personal Carbon Report",
        15,
        15,
      );
      pdf.addImage(imgData, "PNG", 0, 30, pdfWidth, pdfHeight);
      pdf.save(`CarbonTracker_Report.pdf`);
      toast.success("PDF Generated");
    } catch (error) {
      toast.error("Failed to generate PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const tabs = [
    { id: "daily", label: "Daily" },
    { id: "weekly", label: "Weekly" },
    { id: "monthly", label: "Monthly" },
    { id: "annual", label: "Annual" },
  ];

  return (
    <div className="max-w-[1000px] mx-auto pb-20 px-4 sm:px-6 font-sans mt-16">
      {/* HEADER */}
      <div className="mb-8 pt-4 pb-6 border-b border-emerald-100 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-emerald-950 tracking-tight">
            Analytics & Reports
          </h1>
          <p className="text-sm font-medium text-emerald-700/70 mt-1">
            {isAdmin
              ? "Platform-wide trends and user accountability."
              : "Analyze your personal emission footprint over time."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Export Buttons */}
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-900 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-emerald-800 transition-all shadow-sm"
          >
            {isExporting ? "Generating..." : "Export PDF"}
          </button>
        </div>
      </div>

      <div className="flex space-x-1 bg-emerald-50/50 p-1 rounded-xl w-fit mb-8 border border-emerald-100/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 text-xs font-bold tracking-widest uppercase rounded-lg transition-all ${activeTab === tab.id ? "bg-white text-emerald-950 shadow-sm ring-1 ring-emerald-900/10" : "text-emerald-700/70 hover:text-emerald-950 hover:bg-white/50"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ENTIRE AREA CAPTURED IN PDF */}
      <div id="report-capture-area" className="flex flex-col gap-6">
        {/* TOP SECTION: TREND BAR CHART */}
        <div className="bg-white p-8 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-emerald-100 w-full">
          <div className="mb-8 flex justify-between items-end border-b border-emerald-50 pb-4">
            <div>
              <h3 className="text-lg font-black text-emerald-950 tracking-tight capitalize">
                {activeTab} Trend Overview
              </h3>
              <p className="text-xs font-medium text-emerald-700/70 mt-0.5">
                Measured in kg of CO₂ equivalent
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600/70">
                Total Volume
              </p>
              <p className="text-2xl font-black text-emerald-950 tracking-tighter">
                {reportData
                  .reduce((acc, curr) => acc + curr.value, 0)
                  .toFixed(1)}{" "}
                <span className="text-sm text-emerald-600/50">kg</span>
              </p>
            </div>
          </div>

          <div style={{ width: "100%", height: "350px", minHeight: "350px" }}>
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center animate-pulse bg-emerald-50/30 rounded-xl"></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={reportData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <XAxis
                    dataKey="period"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#047857", fontSize: 11, fontWeight: 600 }} // emerald-700
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#10b981", fontSize: 11 }} // emerald-500
                  />
                  <Tooltip
                    cursor={{ fill: "#ecfdf5" }} // emerald-50
                    contentStyle={{
                      backgroundColor: "#022c22", // emerald-950
                      borderRadius: "8px",
                      border: "none",
                      color: "#fff",
                    }}
                    itemStyle={{ fontSize: "13px", fontWeight: "700" }}
                    labelStyle={{ display: "none" }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {reportData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* BOTTOM SECTION: DUAL VIEW (Admin Table vs User Doughnut) */}
        <div className="bg-white p-8 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-emerald-100 w-full">
          {isAdmin ? (
            /* ADMIN VIEW: Top Emitters Table */
            <div>
              <h3 className="text-lg font-black text-emerald-950 tracking-tight mb-6">
                Top Platform Emitters
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] text-emerald-700 uppercase tracking-widest border-b border-emerald-50">
                    <tr>
                      <th className="px-4 py-3">User Identity</th>
                      <th className="px-4 py-3 text-right">Total Emissions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {secondaryData.map((userObj, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-emerald-50 hover:bg-emerald-50/30 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <p className="font-bold text-emerald-950">
                            {userObj.name}
                          </p>
                          <p className="text-xs text-emerald-700/70">
                            {userObj.email}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-right font-black text-emerald-950">
                          {userObj.totalEmission.toFixed(2)}{" "}
                          <span className="text-xs font-normal text-emerald-600/60">
                            kg CO₂
                          </span>
                        </td>
                      </tr>
                    ))}
                    {secondaryData.length === 0 && (
                      <tr>
                        <td
                          colSpan="2"
                          className="text-center py-8 text-emerald-600/70 text-sm"
                        >
                          No user data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* NORMAL USER VIEW: Category Split Doughnut */
            <div>
              <h3 className="text-lg font-black text-emerald-950 tracking-tight mb-6">
                Emissions by Category
              </h3>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 h-[250px]">
                <div style={{ width: "250px", height: "250px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={secondaryData}
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={4}
                      >
                        {secondaryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#022c22", // emerald-950
                          borderRadius: "8px",
                          border: "none",
                          color: "#fff",
                        }}
                        itemStyle={{ fontSize: "13px", fontWeight: "700" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Custom Legend */}
                <div className="flex flex-col gap-3">
                  {secondaryData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full shadow-sm ring-1 ring-black/5"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></div>
                      <p className="text-sm font-bold text-emerald-800 capitalize w-24">
                        {entry.name}
                      </p>
                      <p className="text-sm font-medium text-emerald-600/70">
                        {entry.value.toFixed(1)} kg
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;
