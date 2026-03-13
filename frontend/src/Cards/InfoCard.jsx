import React from "react";

function InfoCard({ icon, label, value, color }) {
  return (
    <div className="card-premium flex gap-5 items-center">
      <div
        className={`w-14 h-14 flex items-center justify-center text-2xl text-white ${color} rounded-2xl shadow-lg ring-4 ring-white/10`}
      >
        {icon}
      </div>
      <div>
        <h6 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</h6>
        <span className="text-2xl font-bold text-slate-900 tracking-tight">{value}</span>
      </div>
    </div>
  );
}

export default InfoCard;
