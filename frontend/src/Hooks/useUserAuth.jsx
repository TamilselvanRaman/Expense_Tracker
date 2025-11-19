// useUserAuth.js
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Utils/axiosInstance";
import {API_ENDPOINTS} from "../Utils/API_Paths";

export const useUserAuth = () => {
  const { user, updateUser, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get(
          API_ENDPOINTS.AUTH.GET_USER_INFO
        );

        if (isMounted && response.data) {
          updateUser(response.data);
        }
      } catch (err) {
        console.log("Failed fetch User Info:", err.message);
        if (isMounted) {
          clearUser();
          navigate("/login");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUserInfo();

    return () => {
      isMounted = false;
    };
  }, [updateUser, clearUser, navigate]);

  return { user, loading };
};
