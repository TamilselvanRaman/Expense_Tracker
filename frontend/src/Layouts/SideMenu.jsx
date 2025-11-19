import React, { useContext } from "react";
import { SIDE_MENU_DATA } from "../Utils/data";
import { UserContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";

function SideMenu({ activeMenu }) {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handelClick = (route) => {
    if (route === "logout") {
      handelLogout();
      return;
    }
    navigate(route);
  };

  const handelLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border border-gray-200/50 p-5 sticky top-[61px] z-20 ml-0">
      <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
        {!user?.ptofileImageUrl ? 
        (<img
          src={user.profileImageUrl }
          alt="Profile"
          className="w-20 h-20 bg-slate-400 rounded-full flex justify-center items-center"
        />):("")}

        <h5 className="text-gray-950 font-medium leading-6">
          {" "}
          {user?.fullName || ""}
        </h5>

        {SIDE_MENU_DATA.map((item, index) => (
          <button
            key={`menu_${index}`}
            onClick={() => handelClick(item.path)}
            className={`w-full flex items-center gap-4 text-[15px] ${
              activeMenu == item.label ? "text-white bg-primary" : ""
            } py-3 px-6 rounded-lg mb-3`}
          >
            <item.icon className="text-xl" />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SideMenu;
