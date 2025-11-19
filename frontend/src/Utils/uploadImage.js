import { API_ENDPOINTS } from "./API_Paths";
import axiosInstance from "./axiosInstance";

const uploadImage = async (image) => {
  const formData = new FormData();
  formData.append("profileImage", image); // ✅ Must match backend field name

  try {
    const response = await axiosInstance.post(
      "http://localhost:5001/api/v1/auth/uploadImage", // ✅ Update with your backend URL
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response.data)
    return response.data;// Example: { url: "..." }
  } catch (error) {
    console.error("Error uploading image:", error.response);
    throw error;
  }
};

export default uploadImage;
