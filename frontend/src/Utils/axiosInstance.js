import axios from "axios";
import { API_BASE_URL } from "./API_Paths";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL, // Or use "http://localhost:5001" directly
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`, // Or however you store your token
  },
  // withCredentials: true, // Uncomment if you are using cookies
});

// Request interceptor to add token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        // Handle unauthorized access
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        window.location.href = "/login"; // Redirect to login page
      } else if (error.response.status === 500) {
        alert("Server error. Please try again later.");
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error in request setup:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
