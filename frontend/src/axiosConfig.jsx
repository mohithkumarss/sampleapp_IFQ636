import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
});

// THE ADDITION: This function runs automatically before EVERY request
axiosInstance.interceptors.request.use(
  (config) => {
    // 1. Grab the token we saved during login
    const token = localStorage.getItem("token");

    // 2. If it exists, attach it to the "Authorization" header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
