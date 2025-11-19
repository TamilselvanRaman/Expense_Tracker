import React from "react";
import { LuTrendingDown } from "react-icons/lu";

// Stats Card component
const StatsInfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex items-center gap-6 bg-white p-4 rounded-xl shadow-md shadow-purple-400/10 border border-gray-200/50 z-10">
      {/* Icon */}
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-full ${color} text-[26px] text-white drop-shadow-xl`}
      >
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 mb-1">{label}</span>
        <span className="text-lg font-semibold">{value}</span>
      </div>
    </div>
  );
};

// Auth Layout component
function AuthLayout({ children }) {
  return (
    <div className="flex">
      {/* Left Side - Content */}
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-lg font-medium text-black">Expense Tracker</h2>
        {children}
      </div>

      {/* Right Side - Visual Stats & Background */}
      <div className="hidden md:block w-[45vw] h-screen bg-violet-50 bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative">
        {/* Decorative Elements */}
        <div className="w-48 h-48 rounded-[40px] bg-purple-600 absolute -top-7 -left-5"></div>
        <div className="w-48 h-56 rounded-[40px] border-[20px] border-fuchsia-600 absolute top-[30%] -right-10"></div>
        <div className="w-48 h-48 rounded-[40px] bg-violet-500 absolute -bottom-7 -left-0.5"></div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 z-20">
          <StatsInfoCard
            icon={<LuTrendingDown />}
            label="Track Your Income & Expenses"
            value="₹430,000"
            color="bg-purple-600"
          />
        </div>

        {/* Placeholder Image */}
        <img
          src="https://placehold.co/600x400/EEE/31343C?text=Expense+Image&font=montserrat"
          alt="Expense Illustration"
          className="w-64 lg:w-[90%] absolute bottom-10 shadow-lg shadow-blue-400/15"
        />
      </div>
    </div>
  );
}

export default AuthLayout;
