import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";

const EmissionFactorForm = () => {
  const [factors, setFactors] = useState([]);
  const [formData, setFormData] = useState({ type: "", factorValue: "" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchFactors = async () => {
    try {
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
    setIsSubmitting(true);
    try {
      await axiosInstance.post("/api/admin/factors", {
        type: formData.type.toLowerCase(), // Normalizing the input
        factorValue: Number(formData.factorValue),
      });
      setMessage({
        text: `Successfully updated multiplier for ${formData.type}`,
        type: "success",
      });
      setFormData({ type: "", factorValue: "" });
      fetchFactors();
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Error updating factor.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
      // Clear message after 3 seconds for a clean UI
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h3 className="text-base font-bold text-gray-900 tracking-tight">
            System Multipliers
          </h3>
          <p className="text-xs font-medium text-gray-500 mt-0.5">
            Configure carbon emission factors per activity unit
          </p>
        </div>
      </div>

      <div className="bg-white p-7 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-200/60 flex flex-col gap-8">
        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-4 items-start md:items-end"
        >
          <div className="flex-grow w-full">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
              Activity Category
            </label>
            <input
              type="text"
              placeholder="e.g., transport, food, electricity"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              required
              className="w-full bg-[#FAFAFA] border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black focus:bg-white block p-3 transition-all outline-none"
            />
          </div>
          <div className="w-full md:w-1/3">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
              Multiplier Value
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.factorValue}
                onChange={(e) =>
                  setFormData({ ...formData, factorValue: e.target.value })
                }
                required
                className="w-full bg-[#FAFAFA] border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black focus:bg-white block p-3 pr-16 transition-all outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                kg/unit
              </span>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto bg-black hover:bg-gray-800 text-white font-semibold rounded-lg text-sm px-6 py-3 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isSubmitting ? "Saving..." : "Save Factor"}
          </button>
        </form>

        {/* Transient Status Message */}
        {message.text && (
          <div
            className={`p-3 rounded-lg border text-sm font-medium transition-all ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Divider */}
        <div className="w-full h-px bg-gray-100"></div>

        {/* Active Factors Display Grid */}
        <div>
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">
            Active Configurations
          </h4>

          {factors.length === 0 ? (
            <div className="text-sm font-medium text-gray-400 italic">
              No custom factors have been configured yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {factors.map((factor) => (
                <div
                  key={factor._id}
                  className="p-4 bg-[#FAFAFA] rounded-xl border border-gray-100 flex flex-col items-start hover:border-gray-300 transition-colors group"
                >
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1 group-hover:text-gray-900 transition-colors">
                    {factor.type}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-gray-900 tracking-tighter">
                      {factor.factorValue}
                    </span>
                    <span className="text-xs font-medium text-gray-500">
                      kg CO₂
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmissionFactorForm;
