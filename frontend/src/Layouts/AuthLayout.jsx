import React from "react";
import { LuTrendingUp } from "react-icons/lu";
import authIllustration from "../assets/auth-illustration.png";

// Stats Card component
const StatsInfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex items-center gap-6 bg-white p-4 rounded-2xl shadow-premium border border-slate-100 z-10">
      {/* Icon */}
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-xl ${color} text-[26px] text-white shadow-lg shadow-indigo-200`}
      >
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">{label}</span>
        <span className="text-xl font-bold text-slate-800">{value}</span>
      </div>
    </div>
  );
};

// Auth Layout component
function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Content */}
      <div className="w-full md:w-[60vw] px-8 md:px-16 lg:px-24 py-12 flex flex-col">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
             <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45"></div>
          </div>
          <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight">
            Expenzo
          </h2>
        </div>
        
        <div className="flex-1 flex flex-col justify-center max-w-[440px] mx-auto w-full">
          {children}
        </div>

        <p className="text-slate-400 text-xs mt-auto pt-8">
          © 2026 Expenzo Inc. All rights reserved.
        </p>
      </div>

      {/* Right Side - Visual Stats & Background */}
      <div className="hidden md:flex w-[40vw] bg-slate-50 relative overflow-hidden flex-col justify-center p-12 border-l border-slate-100">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/30 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-fuchsia-100/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>

        {/* Floating Stats Card */}
        <div className="relative z-20 mb-12 animate-bounce-subtle">
          <StatsInfoCard
            icon={<LuTrendingDown />}
            label="Total Monthly Savings"
            value="₹43,000.00"
            color="bg-primary"
          />
        </div>

        {/* Premium Illustration */}
        <div className="relative z-10 w-full flex justify-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-indigo-500/10 blur-2xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-700"></div>
            <img
              src={authIllustration}
              alt="Expense Illustration"
              className="relative w-full max-w-[420px] drop-shadow-[0_20px_50px_rgba(79,70,229,0.15)] transform transition-all duration-700 group-hover:translate-y-[-10px]"
            />
          </div>
        </div>

        {/* Quote/Tagline */}
        <div className="mt-16 text-center relative z-20">
          <h4 className="text-slate-800 font-display font-semibold text-lg mb-2">Smart Wealth Management</h4>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            Take control of your finances with our intuitive tracking and insightful analytics.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;


