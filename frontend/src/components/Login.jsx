import React, { useState } from "react";
import AuthLayout from "../Layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "./Input";
import { UserContext } from "../Context/UserContext";
import { useContext } from "react";
import axisoInstance from "../Utils/axiosInstance";
import { API_BASE_URL, API_ENDPOINTS } from "../Utils/API_Paths";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setError("");

    // TODO: Call login API here
    // Example API call (replace with actual API call)

    try {
      const response = await axisoInstance.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });
      console.log("Login response:", response.data);

      const { token, user } = response.data;
      console.log("User data:", user);
      if (token) {
        // Update user context
        updateUser(user);
        
        // Store token in local storage
        localStorage.setItem("token", token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);

      const message =
        error?.response?.data?.message || "Login failed. Please try again.";

      setError(message);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your details to log in
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <Input
            type="email"
            placeholder="john@example.com"
            value={email}
            label="Email Address"
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <Input
            type="password"
            placeholder="Min 8 characters"
            value={password}
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button className="btn-primary" type="submit" onClick={handleLogin}>
            Login
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            <Link className="font-medium text-primary underline" to={"/signup"}>
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Login;
