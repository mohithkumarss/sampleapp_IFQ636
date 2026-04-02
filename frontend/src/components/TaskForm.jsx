import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";
import toast from "react-hot-toast";

const TaskForm = ({ tasks, setTasks, editingTask, setEditingTask }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || "",
        description: editingTask.description || "",
        deadline: editingTask.deadline
          ? editingTask.deadline.split("T")[0]
          : "", // Ensures date inputs format correctly
      });
    } else {
      setFormData({ title: "", description: "", deadline: "" });
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingTask) {
        const response = await axiosInstance.put(
          `/api/tasks/${editingTask._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          },
        );
        setTasks(
          tasks.map((task) =>
            task._id === response.data._id ? response.data : task,
          ),
        );
        toast.success("Task updated successfully");
      } else {
        const response = await axiosInstance.post("/api/tasks", formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTasks([...tasks, response.data]);
        toast.success("Task created successfully");
      }
      setEditingTask(null);
      setFormData({ title: "", description: "", deadline: "" });
    } catch (error) {
      console.error(error);
      toast.error(
        editingTask ? "Failed to update task." : "Failed to create task.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditingTask(null);
    setFormData({ title: "", description: "", deadline: "" });
  };

  return (
    <div className="bg-white p-7 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-200/60 mb-8 transition-all">
      <div className="mb-6 border-b border-gray-100 pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-lg font-black text-gray-900 tracking-tight">
            {editingTask ? "Edit Task Record" : "Create New Task"}
          </h2>
          <p className="text-xs font-medium text-gray-500 mt-0.5">
            {editingTask
              ? "Update the details for this specific entry."
              : "Fill out the details below to add a new entry."}
          </p>
        </div>

        {/* Dynamic Badge */}
        <div
          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${editingTask ? "bg-amber-50 text-amber-600" : "bg-gray-100 text-gray-500"}`}
        >
          {editingTask ? "Edit Mode" : "Draft"}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Title Input */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
            Task Title
          </label>
          <input
            type="text"
            placeholder="e.g., Weekly Server Maintenance"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            className="w-full bg-[#FAFAFA] border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black focus:bg-white block p-3 transition-all outline-none"
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
            Description
          </label>
          <textarea
            placeholder="Provide a brief overview of the requirements..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows="3"
            className="w-full bg-[#FAFAFA] border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black focus:bg-white block p-3 transition-all outline-none resize-none"
          />
        </div>

        {/* Deadline Input */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
            Deadline
          </label>
          <input
            type="date"
            value={formData.deadline}
            onChange={(e) =>
              setFormData({ ...formData, deadline: e.target.value })
            }
            required
            className="w-full bg-[#FAFAFA] border border-gray-200 text-gray-500 focus:text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black focus:bg-white block p-3 transition-all outline-none cursor-pointer"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-2 pt-4 border-t border-gray-50">
          {editingTask && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="text-xs font-bold text-gray-500 hover:text-gray-900 px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel Edit
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black hover:bg-gray-800 text-white text-sm font-semibold px-6 py-2.5 rounded-lg shadow-[0_2px_10px_rgb(0,0,0,0.1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {editingTask ? "Update Task" : "Save Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
