import React from "react";
import { FiBell } from "react-icons/fi";

const pageTitles = {
  dashboard: "Dashboard Overview",
  products: "Product Management",
  newsletter: "Newsletter & Messages",
};

export default function AdminTopbar({ activeTab }) {
  return (
    <header className="bg-white border-b border-[#e8f0ef] px-6 py-4 flex items-center justify-between shadow-sm">
      <div>
        <h1 className="text-lg font-bold text-gray-800">
          {pageTitles[activeTab] || "Admin"}
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">Welcome back, Admin</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl bg-[#f0f7f6] text-[#01796F] hover:bg-[#e8f6ea] transition-colors">
          <FiBell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full" />
        </button>
        <div className="w-9 h-9 rounded-xl bg-[#01796F] flex items-center justify-center text-white text-sm font-bold">
          A
        </div>
      </div>
    </header>
  );
}