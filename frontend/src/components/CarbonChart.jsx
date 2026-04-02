import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Premium Monochrome Sequence (Tailwind Gray 900 -> 300)
const COLORS = ["#111827", "#374151", "#6B7280", "#9CA3AF", "#D1D5DB"];

const CarbonChart = ({ activities }) => {
  // 1. Data Transformation: Group and sum emissions by 'type'
  // Wrapped in useMemo so it only recalculates when activities actually change
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

  // 2. Premium Empty State
  if (data.length === 0) {
    return (
      <div className="mt-8 bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl h-[350px] flex flex-col items-center justify-center text-gray-400 space-y-3">
        <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center">
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
          <span className="block text-sm font-bold text-gray-500 tracking-tight">
            No data to visualize
          </span>
          <span className="block text-xs font-medium uppercase tracking-widest mt-1">
            Log your first activity
          </span>
        </div>
      </div>
    );
  }

  // Custom sleek legend formatter
  const renderLegendText = (value) => {
    return (
      <span className="text-xs font-bold text-gray-600 tracking-wider uppercase ml-1">
        {value}
      </span>
    );
  };

  // 3. Render the interactive Pie Chart
  return (
    <div className="mt-8 bg-white p-8 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-200/60 w-full h-[400px] flex flex-col">
      <div className="mb-6 text-center">
        <h3 className="text-lg font-black text-gray-900 tracking-tight">
          Emission Breakdown
        </h3>
        <p className="text-xs font-medium text-gray-500 mt-0.5">
          Your personal carbon footprint by category
        </p>
      </div>

      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%" // Shifted slightly up to make room for the legend
              innerRadius={75}
              outerRadius={105}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              cornerRadius={4} // Sleek rounded edges on the slices
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
                backgroundColor: "#111827",
                borderRadius: "12px",
                border: "1px solid #374151",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.2)",
                color: "#fff",
                padding: "10px 14px",
              }}
              itemStyle={{
                color: "#F3F4F6",
                fontSize: "13px",
                fontWeight: "600",
              }}
              formatter={(value) => [`${value.toFixed(2)} kg`, "CO₂"]}
              labelStyle={{ display: "none" }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={renderLegendText}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CarbonChart;
