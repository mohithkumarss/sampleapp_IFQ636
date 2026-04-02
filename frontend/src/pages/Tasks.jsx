import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get("/api/tasks", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to load tasks. Please refresh the page.");
      } finally {
        setIsFetching(false);
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [user]);

  // Premium Initial Loading State
  if (isFetching) {
    return (
      <div className="max-w-[1000px] mx-auto w-full flex justify-center items-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">
            Loading Dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto w-full pb-20 mt-4 px-4 sm:px-6 font-sans">
      {/* PAGE HEADER */}
      <div className="mb-10 border-b border-gray-200/60 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Task Management
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-1">
            Organize, track, and update your daily objectives.
          </p>
        </div>

        {/* Quick Stat Counter */}
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
            Total Active
          </span>
          <span className="text-2xl font-black text-gray-900 leading-none tracking-tighter">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* TWO-COLUMN DASHBOARD LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: The Form (Sticky on desktop) */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-32">
            <TaskForm
              tasks={tasks}
              setTasks={setTasks}
              editingTask={editingTask}
              setEditingTask={setEditingTask}
            />
          </div>
        </div>

        {/* Right Column: The List */}
        <div className="lg:col-span-7">
          <TaskList
            tasks={tasks}
            setTasks={setTasks}
            setEditingTask={setEditingTask}
          />
        </div>
      </div>
    </div>
  );
};

export default Tasks;
