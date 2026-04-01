import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../axiosConfig"; // Adjust path if needed

const AdminActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllActivities = async () => {
    try {
      const res = await axiosInstance.get("/api/admin/activities");
      setActivities(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching all activities", error);
      toast.error("Failed to load system activities.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllActivities();
  }, []);

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "WARNING: Are you sure you want to delete this user's activity? This cannot be undone.",
      )
    )
      return;

    try {
      await axiosInstance.delete(`/api/admin/activities/${id}`);
      toast.success("Activity permanently deleted.");
      fetchAllActivities(); // Refresh the list
    } catch (error) {
      toast.error("Failed to delete activity.");
      console.error(error);
    }
  };

  if (loading)
    return <p style={{ textAlign: "center" }}>Loading system activities...</p>;

  return (
    <div
      style={{
        marginTop: "30px",
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ marginBottom: "15px", color: "#333" }}>
        System-Wide Activity Log
      </h3>

      {activities.length === 0 ? (
        <p>No activities logged in the system yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#f8f9fa",
                  borderBottom: "2px solid #ddd",
                }}
              >
                <th style={{ padding: "12px" }}>User</th>
                <th style={{ padding: "12px" }}>Category</th>
                <th style={{ padding: "12px" }}>Amount</th>
                <th style={{ padding: "12px" }}>Emissions</th>
                <th style={{ padding: "12px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((act) => (
                <tr key={act._id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px" }}>
                    {/* Fallback to 'Unknown User' if the user was deleted but their activity remained */}
                    <strong>{act.userId?.name || "Unknown User"}</strong>
                    <br />
                    <span style={{ fontSize: "0.85rem", color: "#666" }}>
                      {act.userId?.email || "N/A"}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>{act.type}</td>
                  <td style={{ padding: "12px" }}>{act.distance}</td>
                  <td
                    style={{
                      padding: "12px",
                      fontWeight: "bold",
                      color: "#e53e3e",
                    }}
                  >
                    {act.emission.toFixed(2)} kg CO₂
                  </td>
                  <td style={{ padding: "12px" }}>
                    <button
                      onClick={() => handleDelete(act._id)}
                      style={{
                        backgroundColor: "#ff4d4f",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminActivityList;
