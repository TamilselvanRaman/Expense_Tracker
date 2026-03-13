import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

function Input({ type, placeholder, value, onChange, label }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col gap-1.5 Group">
      <label className="text-[13px] font-medium text-slate-700 ml-1">
        {label}
      </label>

      <div className="relative flex items-center">
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          className="w-full bg-white text-slate-900 text-sm rounded-xl px-4 py-3 border border-slate-200 shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none placeholder:text-slate-400"
          value={value}
          onChange={(e) => onChange(e)}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute right-4 text-slate-400 hover:text-primary transition-colors focus:outline-none"
          >
            {showPassword ? (
              <FaRegEye size={18} />
            ) : (
              <FaRegEyeSlash size={18} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default Input;

