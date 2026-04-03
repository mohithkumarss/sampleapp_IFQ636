import React from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";
import toast from "react-hot-toast";

const TaskList = ({ tasks, setTasks, setEditingTask }) => {
  const { user } = useAuth();

  const handleDelete = async (taskId) => {
    // Replaced jarring alert with a standard confirm, but you could upgrade this to a custom modal later
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await axiosInstance.delete(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
      toast.success("Task removed successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete task.");
    }
  };

  // Helper to make dates look like "Oct 24, 2024" instead of "10/24/2024"
  const formatDate = (dateString) => {
    if (!dateString) return "No Deadline";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="w-full">
      {/* Header aligned with the overall dashboard aesthetic */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-base font-bold text-emerald-950 tracking-tight">
            Active Tasks
          </h3>
          <p className="text-xs font-medium text-emerald-700/70 mt-0.5">
            Manage and track your current responsibilities
          </p>
        </div>
        <div className="text-xs font-bold text-emerald-600 tracking-widest uppercase">
          {tasks.length} Records
        </div>
      </div>

      {/* Premium Empty State */}
      {!tasks || tasks.length === 0 ? (
        <div className="bg-emerald-50/30 border border-dashed border-emerald-200 rounded-2xl h-48 flex flex-col items-center justify-center text-emerald-700/60 space-y-3 mt-4">
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-emerald-200 bg-emerald-50 flex items-center justify-center">
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
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </div>
          <div className="text-center">
            <span className="block text-sm font-bold text-emerald-800 tracking-tight">
              No active tasks
            </span>
            <span className="block text-xs font-medium uppercase tracking-widest mt-1 text-emerald-600/70">
              Create a new task above
            </span>
          </div>
        </div>
      ) : (
        /* Task List Grid */
        <div className="grid grid-cols-1 gap-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="group bg-white p-5 rounded-2xl border border-emerald-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-emerald-200 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Task Content */}
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                  <h2 className="text-sm font-bold text-emerald-950 tracking-tight truncate">
                    {task.title}
                  </h2>
                  {task.deadline && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase bg-emerald-50 text-emerald-700">
                      Due: {formatDate(task.deadline)}
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium text-emerald-700/70 line-clamp-2 leading-relaxed">
                  {task.description}
                </p>
              </div>

              {/* Action Buttons (Hidden until Hover) */}
              <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 shrink-0 border-t sm:border-t-0 border-emerald-50 pt-3 sm:pt-0 mt-1 sm:mt-0">
                <button
                  onClick={() => setEditingTask(task)}
                  className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 hover:text-emerald-950 bg-white border border-emerald-100 hover:border-emerald-900 hover:bg-emerald-50 px-3 py-1.5 rounded-md transition-all duration-200 shadow-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-[10px] font-bold uppercase tracking-widest text-emerald-600/50 hover:text-red-600 bg-white border border-emerald-100 hover:border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-md transition-all duration-200 shadow-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
