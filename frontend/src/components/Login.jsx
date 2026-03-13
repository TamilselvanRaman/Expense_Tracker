import React, { useState } from "react";
import AuthLayout from "../Layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "./Input";
import { UserContext } from "../Context/UserContext";
import { useContext } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { API_ENDPOINTS } from "../Utils/API_Paths";

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

    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, user } = response.data;
      if (token) {
        updateUser(user);
        localStorage.setItem("token", token);
        navigate("/dashboard");
      }
    } catch (error) {
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
      <div className="w-full">
        <div className="mb-8">
          <h3 className="text-2xl font-display font-bold text-slate-900">Welcome Back</h3>
          <p className="text-sm text-slate-500 mt-2">
            Securely access your financial overview
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <Input
            type="email"
            placeholder="name@company.com"
            value={email}
            label="Work Email Address"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-100 animate-shake">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between text-[13px] mt-1">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary/20" />
              Remember me
            </label>
            <Link to="/forgot-password" size="sm" className="text-primary font-medium hover:underline">
               Forgot password?
            </Link>
          </div>

          <button className="btn-primary w-full mt-2" type="submit">
            Sign In to Expenzo
          </button>

          <p className="text-sm text-center text-slate-600 mt-6">
            New to Expenzo?{" "}
            <Link className="font-semibold text-primary hover:underline" to={"/signup"}>
              Create a free account
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Login;

