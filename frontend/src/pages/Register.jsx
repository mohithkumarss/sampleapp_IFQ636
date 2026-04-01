import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Register the user
      const response = await axiosInstance.post("/api/auth/register", formData);

      // Because our backend is efficient, it logs them in immediately
      const { token, user } = response.data;
      login(user, token);

      // Send new normal users straight to their dashboard
      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-green-50 shadow-lg rounded-xl border border-green-200">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-800">
        Join Carbon Tracker
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full mb-4 p-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full mb-4 p-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="w-full mb-6 p-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold p-3 rounded transition duration-200"
        >
          Register
        </button>
      </form>

      <p className="mt-6 text-center text-green-700">
        Already have an account?{" "}
        <Link to="/login" className="font-bold underline hover:text-green-800">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Register;
