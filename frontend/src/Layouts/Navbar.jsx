import React, { useState } from "react";
import { HiOutlineMenuAlt2, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";

function Navbar({ activeMenu }) {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className="flex items-center justify-between bg-white/80 backdrop-blur-lg border-b border-slate-100 py-3.5 px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-600"
          onClick={() => setOpenSideMenu(!openSideMenu)}
        >
          {openSideMenu ? (
            <HiOutlineX className="text-2xl" />
          ) : (
            <HiOutlineMenuAlt2 className="text-2xl" />
          )}
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100">
             <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45"></div>
          </div>
          <h2 className="text-lg font-display font-bold text-slate-900 tracking-tight hidden sm:block">
            Expenzo
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* You can add notifications, search or user profile dropdown here in the future */}
        <div className="h-8 w-[1px] bg-slate-100 hidden sm:block"></div>
        <div className="px-3 py-1.5 bg-indigo-50 rounded-full">
           <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Enterprise v1.0</span>
        </div>
      </div>

      {openSideMenu && (
        <div className="fixed inset-0 top-[65px] bg-slate-900/10 backdrop-blur-sm z-40 lg:hidden" onClick={() => setOpenSideMenu(false)}>
          <div className="w-64 bg-white h-full shadow-2xl animate-slide-in" onClick={e => e.stopPropagation()}>
            <SideMenu activeMenu={activeMenu} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;

