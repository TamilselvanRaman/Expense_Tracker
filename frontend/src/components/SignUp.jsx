import React, { useState, useContext } from "react";
import AuthLayout from "../Layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "./Input";
import ProfilePhotoSelector from "./ProfilePhotoSelector";
import axiosInstance from "../Utils/axiosInstance";
import { API_ENDPOINTS } from "../Utils/API_Paths";
import { UserContext } from "../Context/UserContext";
import uploadImage from "../Utils/uploadImage";

function SignUp() {
  const [image, setImage] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    if (!fullName) {
      setError("Please enter your legal full name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid work email address");
      return;
    }

    if (!password || password.length < 8) {
      setError("Security password must be at least 8 characters");
      return;
    }

    let profileImageUrl = "";

    try {
      if (image) {
        const ImgUploadRes = await uploadImage(image);
        profileImageUrl = ImgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl,
      });

      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || "Registration failed. Please try again.";
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
        <div className="mb-8 text-center md:text-left">
          <h3 className="text-2xl font-display font-bold text-slate-900">Create Professional Account</h3>
          <p className="text-sm text-slate-500 mt-2">
            Join Expenzo to start your financial optimization journey
          </p>
        </div>

        <form onSubmit={handleSignUp} className="flex flex-col gap-5">
          <div className="flex justify-center mb-2">
             <ProfilePhotoSelector image={image} setImage={setImage} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="John Doe"
              value={fullName}
              label="Full Name"
              onChange={(e) => setFullName(e.target.value)}
            />

            <Input
              type="email"
              placeholder="name@company.com"
              value={email}
              label="Work Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Input
            type="password"
            placeholder="Min 8 characters"
            value={password}
            label="Security Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-100 animate-shake">
              {error}
            </div>
          )}

          <p className="text-[12px] text-slate-500 leading-relaxed text-center md:text-left">
            By creating an account, you agree to our{" "}
            <span className="text-primary font-medium cursor-pointer hover:underline">Terms of Service</span> and{" "}
            <span className="text-primary font-medium cursor-pointer hover:underline">Compliance Standards</span>.
          </p>

          <button className="btn-primary w-full mt-2" type="submit">
            Establish Account
          </button>

          <p className="text-sm text-center text-slate-600 mt-6">
            Already registered?{" "}
            <Link className="font-semibold text-primary hover:underline" to={"/login"}>
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default SignUp;

