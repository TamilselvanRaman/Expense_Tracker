import React, { useContext } from "react";
import { SIDE_MENU_DATA } from "../Utils/data";
import { UserContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";

function SideMenu({ activeMenu }) {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLinkClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  return (
    <div className="w-64 h-[calc(100vh-65px)] bg-white border-r border-slate-100 flex flex-col sticky top-[65px] z-20">
      {/* Profile Section */}
      <div className="p-6 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={user?.profileImageUrl || "https://ui-avatars.com/api/?name=" + (user?.fullName || "User") + "&background=6366f1&color=fff"}
              alt="Profile"
              className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-md ring-1 ring-slate-100"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex flex-col overflow-hidden">
            <h5 className="text-sm font-bold text-slate-800 truncate">
              {user?.fullName || "Guest User"}
            </h5>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">
               Professional
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 p-4 flex flex-col gap-1.5 overflow-y-auto">
        {SIDE_MENU_DATA.map((item, index) => (
          <button
            key={`menu_${index}`}
            onClick={() => handleLinkClick(item.path)}
            className={`w-full flex items-center gap-3.5 py-3 px-4 rounded-xl transition-all duration-200 group ${
              activeMenu === item.label
                ? "bg-indigo-50 text-primary shadow-sm shadow-indigo-100/50"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <item.icon className={`text-xl ${activeMenu === item.label ? "text-primary" : "text-slate-400 group-hover:text-slate-600"}`} />
            <span className="text-[14px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Logout Bottom */}
      <div className="p-4 border-t border-slate-50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 py-3 px-4 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200"
        >
          <LuLogOut className="text-xl" />
          <span className="text-[14px] font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default SideMenu;

