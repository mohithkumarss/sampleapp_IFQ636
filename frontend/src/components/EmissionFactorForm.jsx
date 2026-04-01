import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig"; // Adjust path if needed

const EmissionFactorForm = () => {
  const [factors, setFactors] = useState([]);
  const [formData, setFormData] = useState({ type: "", factorValue: "" });
  const [message, setMessage] = useState("");

  // Fetch existing factors on load
  const fetchFactors = async () => {
    try {
      // Adjust this URL if your backend route is different
      const res = await axiosInstance.get("/api/admin/factors");
      setFactors(res.data);
    } catch (error) {
      console.error("Error fetching factors", error);
    }
  };

  useEffect(() => {
    fetchFactors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/api/admin/factors", {
        type: formData.type,
        factorValue: Number(formData.factorValue), // Ensure it sends as a number
      });
      setMessage(`Successfully updated factor for ${formData.type}!`);
      setFormData({ type: "", factorValue: "" }); // Clear form
      fetchFactors(); // Refresh the list
    } catch (error) {
      setMessage("Error updating factor.");
    }
  };

  return (
    <div
      className="factor-management-card"
      style={{
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        marginTop: "20px",
      }}
    >
      <h3>Manage Emission Factors</h3>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
      >
        <input
          type="text"
          placeholder="Activity Type (e.g., Transport)"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Factor Value (e.g., 0.14)"
          value={formData.factorValue}
          onChange={(e) =>
            setFormData({ ...formData, factorValue: e.target.value })
          }
          required
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#28a745",
            color: "white",
            padding: "5px 15px",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Save Factor
        </button>
      </form>

      {message && (
        <p style={{ color: message.includes("Error") ? "red" : "green" }}>
          {message}
        </p>
      )}

      <h4>Current Factors in System:</h4>
      <ul>
        {factors.length === 0 ? <p>No factors set yet.</p> : null}
        {factors.map((factor) => (
          <li key={factor._id}>
            <strong>{factor.type}:</strong> {factor.factorValue} kg CO₂ / unit
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmissionFactorForm;
