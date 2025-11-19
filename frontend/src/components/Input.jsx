import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

function Input({ type, placeholder, value, onChange, label }) {
  const [showPasssword, setShowpassword] = useState(false);

  const handleTogglePassword = () => {
    setShowpassword(!showPasssword);
  };
  return (
    <div>
      <label className="text-[13px] text-slate-800">{label}</label>

      <div className="input-box">
        <input
          type={
            type == "password" ? (showPasssword ? "text" : "password") : type
          }
          placeholder={placeholder}
          className="w-full bg-transparent outline-none"
          value={value}
          onChange={(e) => onChange(e)}
        />

        {type == "password" && (
          <>
            {showPasssword ? (
              <FaRegEye
                size={20}
                className="text-primary cursor-pointer"
                onClick={() => handleTogglePassword()}
              />
            ) : (
              <FaRegEyeSlash
                size={20}
                className="text-slate-400 cursor-pointer"
                onClick={() => handleTogglePassword()}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Input;
