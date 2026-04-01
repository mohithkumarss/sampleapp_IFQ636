import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";

const Recommendations = () => {
  const [insight, setInsight] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axiosInstance.get("/api/recommendations");
        setInsight(res.data);
      } catch (error) {
        console.error("Error fetching recommendations", error);
      }
    };

    fetchRecommendations();
  }, []);

  if (!insight)
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Loading insights... (Check F12 Console if stuck)
      </div>
    );

  return (
    <div
      style={{
        marginTop: "20px",
        backgroundColor: "#e6fffa",
        borderLeft: "5px solid #38b2ac",
        padding: "15px 20px",
        borderRadius: "4px",
      }}
    >
      <h4
        style={{
          margin: "0 0 10px 0",
          color: "#2c7a7b",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        💡 Smart Insight
      </h4>
      <p style={{ margin: 0, color: "#2d3748", lineHeight: "1.5" }}>
        {insight.suggestion}
      </p>
    </div>
  );
};

export default Recommendations;
