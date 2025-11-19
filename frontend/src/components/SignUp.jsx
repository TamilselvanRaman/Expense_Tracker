import React, { useState } from "react";
import AuthLayout from "../Layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "./Input";
import { UserContext } from "../Context/UserContext";
import { useContext } from "react";
import ProfilePhotoSelector from "./ProfilePhotoSelector";
import axisoInstance from "../Utils/axiosInstance";
import { API_ENDPOINTS } from "../Utils/API_Paths";
import uploadImage from "../Utils/uploadImage";

function SignUp() {
  const [image, setImage] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { updateUser } = useContext(UserContext);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null); // reset previous errors


    // ProfileImageUrl would be set here if uploading image
    let profileImageUrl = "";

    if (!fullName) {
      setError("Please enter your full name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (image) {
      const ImgUploadRes = await uploadImage(image);
      profileImageUrl = ImgUploadRes.imageUrl || "";
    }

    try {

      const response = await axisoInstance.post(API_ENDPOINTS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl,
      });
      
      const { token, user } = response.data;
      console.log(user)
      if (token) {
        // Store token in local storage
        localStorage.setItem("token", token);
        updateUser(user); // Assuming you have a function to update user context
        navigate("/dashboard");
      }
    } catch (error) {
      // console.error("Error during sign up:", error);
      console.log("Error during sign up:", error.response.data.message);
      setError("An error occurred during sign up. Please try again.");
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below
        </p>

        <form onSubmit={handleSignUp} >
          <ProfilePhotoSelector image={image} setImage={setImage} />

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
              placeholder="john@example.com"
              value={email}
              label="Email Address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 col-span-2">
            <Input
              type="password"
              placeholder="Min 8 characters"
              value={password}
              label="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button
              type="submit"
              className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              Sign Up
            </button>
          </div>

          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account?{" "}
            <Link className="font-medium text-primary underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default SignUp;
