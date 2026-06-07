import React from "react";

export default function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e8f0ef] flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        {sub && <p className="text-xs text-[#01796F] mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}