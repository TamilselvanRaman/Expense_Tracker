import React, { useContext } from "react";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import { UserContext } from "../Context/UserContext";

function DashboardLayout({ children, activeMenu }) {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <Navbar activeMenu={activeMenu} />

      {user && (
        <div className="flex flex-1 relative">
          <div className="hidden lg:block">
            <SideMenu activeMenu={activeMenu} />
          </div>

          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto max-w-[1600px] mx-auto w-full">
            {children}
          </main>
        </div>
      )}
    </div>
  );
}

export default DashboardLayout;

