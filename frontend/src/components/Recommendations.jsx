import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";

const Recommendations = () => {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axiosInstance.get("/api/recommendations");
        setInsight(res.data);
      } catch (error) {
        console.error("Error fetching recommendations", error);
        // Fallback so the UI doesn't break if the AI/backend fails
        setInsight({
          suggestion:
            "Consolidate your trips today to reduce overall emissions.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // Premium Skeleton Loading State
  if (loading) {
    return (
      <div className="mt-8 animate-pulse bg-gray-50/50 p-6 rounded-2xl border border-gray-100 flex gap-4 items-start">
        <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0"></div>
        <div className="space-y-3 flex-1 pt-1">
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          <div className="h-2 bg-gray-100 rounded w-full"></div>
          <div className="h-2 bg-gray-100 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  // If the API returns nothing at all, fail gracefully
  if (!insight) return null;

  return (
    <div className="mt-8 group relative bg-white p-6 rounded-2xl border border-gray-200/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-gray-300 transition-all duration-300 overflow-hidden w-full">
      {/* Sleek Left Accent Line */}
      <div className="absolute top-0 left-0 w-1 h-full bg-black scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300 ease-out"></div>

      <div className="flex gap-4 items-start pl-1">
        {/* Dynamic Icon Container */}
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FAFAFA] text-gray-900 ring-1 ring-inset ring-gray-200/60 group-hover:bg-black group-hover:text-white transition-colors duration-300 shrink-0 shadow-sm">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
            <path d="m17 18 6-6-6-6" />
            <path d="M1 12h12" />
          </svg>
        </div>

        {/* Text Content */}
        <div className="flex flex-col pt-0.5">
          <h4 className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5 flex items-center gap-2">
            Smart Insight
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></span>
          </h4>
          <p className="text-sm font-medium text-gray-900 leading-relaxed pr-4">
            {insight.suggestion}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
