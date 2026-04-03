import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#022c22", "#065f46", "#059669", "#34d399", "#6ee7b7"];

const CarbonChart = ({ activities }) => {
  const data = useMemo(() => {
    if (!activities || activities.length === 0) return [];

    const groupedData = activities.reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + curr.emission;
      return acc;
    }, {});

    return Object.keys(groupedData).map((key) => ({
      name: key,
      value: groupedData[key],
    }));
  }, [activities]);

  if (data.length === 0) {
    return (
      <div className="bg-emerald-50/30 border border-dashed border-emerald-200 rounded-2xl h-[400px] flex flex-col items-center justify-center text-emerald-700/60 space-y-3">
        <div className="w-12 h-12 rounded-full border-2 border-dashed border-emerald-200 flex items-center justify-center bg-emerald-50">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
            <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
          </svg>
        </div>
        <div className="text-center">
          <span className="block text-sm font-bold text-emerald-800 tracking-tight">
            No data to visualize
          </span>
          <span className="block text-xs font-medium uppercase tracking-widest mt-1 text-emerald-600/70">
            Log your first activity
          </span>
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
    <div className="bg-white p-8 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-emerald-100 w-full h-[400px] flex flex-col">
      <div className="mb-6 text-center shrink-0">
        <h3 className="text-lg font-black text-emerald-950 tracking-tight">
          Emission Breakdown
        </h3>
        <p className="text-xs font-medium text-emerald-700/70 mt-0.5">
          Your personal carbon footprint by category
        </p>
      </div>

      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={75}
              outerRadius={105}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              cornerRadius={4}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              cursor={false}
              contentStyle={{
                backgroundColor: "#022c22",
                borderRadius: "12px",
                border: "1px solid #064e3b",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                color: "#fff",
                padding: "10px 14px",
              }}
              itemStyle={{
                color: "#ecfdf5",
                fontSize: "13px",
                fontWeight: "600",
              }}
              formatter={(value, name) => [`${value.toFixed(2)} kg CO₂`, name]}
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
      </div>
    </div>
  );
};

export default CarbonChart;
