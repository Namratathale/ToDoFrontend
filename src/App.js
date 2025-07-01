import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import { FiLogOut } from "react-icons/fi";
import { AiOutlineDatabase } from "react-icons/ai";

import Login from "./Login";
import Signup from "./Signup";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const fetchTasks = async (token) => {
    try {
      const response = await fetch("https://todobackend-bi77.onrender.com/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    if (token) fetchTasks(token);
  }, [token]);

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setTasks([]);
    toast.success("Logged out successfully!");
  };

  const addTask = async (text) => {
    try {
      const response = await fetch("https://todobackend-bi77.onrender.com/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, status: "pending", priority: "medium" }),
      });
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      toast.success("Task added!");
    } catch (err) {
      console.error("Add task error:", err);
      toast.error("Failed to add task.");
    }
  };

  const isDuplicateTask = (text) => {
    return tasks.some(
      (task) => task.text.trim().toLowerCase() === text.trim().toLowerCase()
    );
  };

  const isTaskEmpty = (text) => text.trim().length === 0;
  const isTaskTooLong = (text) => text.trim().length > 100;

  const deleteTask = async (id) => {
    try {
      await fetch(`https://todobackend-bi77.onrender.com/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task._id !== id));
      toast.info("Task deleted.");
    } catch (err) {
      console.error("Delete task error:", err);
      toast.error("Failed to delete task.");
    }
  };

  const updateTaskStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";
    try {
      const response = await fetch(
        `https://todobackend-bi77.onrender.com/tasks/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Status update failed");

      setTasks((prev) =>
        prev.map((task) =>
          task._id === id ? { ...task, status: newStatus } : task
        )
      );
      toast.success(`Marked as ${newStatus}`);
    } catch (err) {
      console.error("Status update error:", err);
      toast.error("Failed to update task status.");
    }
  };

  const updateTaskPriority = async (id, newPriority) => {
    try {
      const response = await fetch(
        `https://todobackend-bi77.onrender.com/tasks/${id}/priority`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ priority: newPriority }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Priority update failed");

      setTasks((prev) =>
        prev.map((task) =>
          task._id === id ? { ...task, priority: newPriority } : task
        )
      );
      toast.success(`Priority set to ${newPriority}`);
    } catch (err) {
      console.error("Priority update error:", err);
      toast.error("Failed to update priority.");
    }
  };

  const filteredTasks = tasks.filter(
    (task) =>
      (filterStatus === "all" || task.status === filterStatus) &&
      (filterPriority === "all" || task.priority === filterPriority)
  );

  const MainApp = () => (
    <div className="min-h-screen flex flex-col">
      <nav className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 gap-2 shadow-md">
        <div
          className="flex items-center gap-2 text-yellow-400 font-bold text-xl cursor-pointer"
          onClick={() => window.location.href = "/"}
        >
          <AiOutlineDatabase className="text-2xl" />
          <span>To-Do List</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1 px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
        >
          <FiLogOut />
          Logout
        </button>
      </nav>

      <main className="flex-1 px-4 sm:px-10 md:px-20 py-6">
        <div className="text-center mb-6">
          <div className="text-yellow-400 text-3xl sm:text-4xl font-bold">⚡Task</div>
          <div className="text-white text-2xl sm:text-3xl font-semibold">Manager</div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const taskText = e.target[0].value.trim();

            if (isDuplicateTask(taskText)) return toast.error("Task already exists!");
            if (isTaskEmpty(taskText)) return toast.error("Task cannot be empty!");
            if (isTaskTooLong(taskText)) return toast.error("Task is too long!");

            addTask(taskText);
            e.target[0].value = "";
          }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6"
        >
          <input
            type="text"
            placeholder="Add a task..."
            className="p-3 w-full sm:w-2/3 max-w-md rounded-lg border-2"
          />
          <button
            type="submit"
            className="px-6 py-2 rounded-lg font-bold w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400"
          >
            Add
          </button>
        </form>

        <div className="mb-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 rounded-md border-2 w-full sm:w-60"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="p-2 rounded-md border-2 w-full sm:w-60"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <ul className="space-y-4">
          {filteredTasks.map((task) => (
            <li
              key={task._id}
              className="p-4 rounded-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-800 shadow-md"
            >
              <div className="flex-1 break-words">
                <span className="text-lg font-semibold text-white">{task.text}</span>
                <span className="ml-2 text-sm text-gray-400">
                  ({task.status}, {task.priority})
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                <button
                  onClick={() => updateTaskStatus(task._id, task.status)}
                  className={`px-3 py-1 rounded-md font-semibold ${
                    task.status === "pending"
                      ? "bg-yellow-600 text-black hover:bg-yellow-500"
                      : "bg-green-600 text-white hover:bg-green-500"
                  }`}
                >
                  {task.status === "pending" ? "Mark Complete" : "Mark Pending"}
                </button>
                <select
                  value={task.priority}
                  onChange={(e) => updateTaskPriority(task._id, e.target.value)}
                  className="p-2 rounded-md border-2"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700"
                >
                  🗑 Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>

      <footer className="p-4 text-center shadow-inner">
        <p className="text-sm text-yellow-400">© 2025 Neon To-Do Pro</p>
      </footer>
    </div>
  );

  return (
    <Router>
      <ToastContainer
        position="top-right"
        transition={Slide}
        autoClose={2500}
        theme="dark"
      />
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={token ? <MainApp /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to={token ? "/" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
