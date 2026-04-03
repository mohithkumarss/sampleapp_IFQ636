import React, { useState, useEffect } from "react";

const Recommendations = ({ activities = [] }) => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateInsights = () => {
      let generated = [];

      if (activities.length === 0) {
        generated = [
          "Start logging activities to unlock personalized emission insights.",
          "Switching to LED bulbs reduces home energy use by up to 75%.",
          "Plant-based meals twice a week drastically lower your carbon footprint.",
          "Public transit produces 95% less CO2 per passenger mile than driving.",
        ];
      } else {
        const totals = activities.reduce((acc, curr) => {
          acc[curr.type] = (acc[curr.type] || 0) + curr.emission;
          return acc;
        }, {});

        const sortedCats = Object.entries(totals).sort((a, b) => b[1] - a[1]);
        const highestCategory = sortedCats[0]?.[0];

        if (highestCategory === "Transport") {
          generated.push(
            "Transport is your biggest emitter. Consider carpooling or biking twice a week to drastically lower your impact.",
          );
        } else if (highestCategory === "Electricity") {
          generated.push(
            "Energy use is peaking. Unplugging idle devices and adjusting the AC can save up to 10% on emissions.",
          );
        } else if (highestCategory === "Food") {
          generated.push(
            "Diet is driving your footprint. Swapping beef for poultry or beans can cut your food emissions in half.",
          );
        } else {
          generated.push(
            "Great job tracking your inputs! Keep identifying areas where you can reduce daily consumption.",
          );
        }

        generated.push(
          `You have logged ${activities.length} activities so far. Consistency is the key to accurate footprint tracking!`,
        );

        const standardTips = [
          "Adjusting your thermostat just 2 degrees can save 2,000 lbs of CO2 a year.",
          "Cold water washing saves 90% of the energy used by washing machines.",
          "Keeping your car tires properly inflated improves gas mileage by up to 3%.",
          "A dripping faucet can waste up to 3,000 gallons of water per year.",
        ];

        const shuffled = standardTips.sort(() => 0.5 - Math.random());
        generated.push(shuffled[0]);
        generated.push(shuffled[1]);
      }

      setInsights(generated);
      setLoading(false);
    };

    generateInsights();
  }, [activities]);

  if (loading) {
    return (
      <div className="h-[400px] bg-emerald-50/30 p-8 rounded-2xl border border-emerald-100 flex flex-col gap-6 w-full animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-4 items-start">
            <div className="w-8 h-8 bg-emerald-100 rounded-full shrink-0"></div>
            <div className="space-y-2 flex-1 pt-1">
              <div className="h-2 bg-emerald-200 rounded w-1/4"></div>
              <div className="h-2 bg-emerald-100 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="h-[400px] flex flex-col bg-white p-8 rounded-2xl border border-emerald-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all overflow-hidden w-full relative">
      {/* Decorative Emerald Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-emerald-900 rounded-t-2xl"></div>

      {/* Fixed Header */}
      <h3 className="text-lg font-black text-emerald-950 tracking-tight mb-6 shrink-0">
        Actionable Insights
      </h3>

      {/* Scrollable List Container with Custom Scrollbar formatting */}
      <div className="flex flex-col gap-6 flex-grow overflow-y-auto pr-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-emerald-50 [&::-webkit-scrollbar-thumb]:bg-emerald-200 [&::-webkit-scrollbar-thumb]:rounded-full">
        {insights.map((text, index) => (
          <div key={index} className="flex gap-4 items-start group">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 group-hover:bg-emerald-900 group-hover:text-white transition-colors duration-300 shrink-0 shadow-sm mt-0.5">
              {index === 0 ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m13 2-2 2.5-1-1L7 6M2 17h16M14 13h6M18 9h4" />
                </svg>
              ) : index === 1 ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                  <path d="m17 18 6-6-6-6" />
                  <path d="M1 12h12" />
                </svg>
              )}
            </div>

            <div className="flex flex-col">
              <p className="text-sm font-medium text-emerald-950 leading-relaxed">
                {text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
