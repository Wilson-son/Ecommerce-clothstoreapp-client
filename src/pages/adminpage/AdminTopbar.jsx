import React from "react";

import { useNavigate } from "react-router-dom";

import { FiBell, FiMenu } from "react-icons/fi";
import { SiHomeadvisor } from "react-icons/si";
import { IoPerson } from "react-icons/io5";
import { IoAdd } from "react-icons/io5";

import Profile from "../Profile";

const pageTitles = {
  dashboard: "Dashboard Overview",
  products: "Product Management",
  orders: "Order Management",
  newsletter: "Newsletter & Messages",
};

export default function AdminTopbar({ activeTab, onAddProduct, onOpenMenu }) {
  const nav = useNavigate();

  return (
    <header className="bg-white border-b border-[#e8f0ef] px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center gap-2 min-w-0">
       
        <button
          onClick={onOpenMenu}
          aria-label="Open menu"
          className="md:hidden p-2 -ml-2 rounded-lg text-gray-600 hover:bg-[#f0f7f6] active:bg-[#e8f0ef] transition-colors flex-shrink-0"
        >
          <FiMenu size={20} />
        </button>
        <div className="min-w-0">
          <h1 className="text-sm sm:text-lg font-bold text-gray-800 truncate">
            {pageTitles[activeTab] || "Admin"}
          </h1>
          <p className="hidden sm:block text-xs text-gray-400 mt-0.5">
            Welcome back, Admin
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-7 flex-shrink-0">
        <button className="relative p-2 rounded-xl bg-[#f0f7f6] text-[#01796F] hover:bg-[#e8f6ea] transition-colors">
          <FiBell size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full" />
        </button>

        <button
          onClick={onAddProduct}
          className="w-8 h-8 sm:w-9 sm:h-9 text-gray-800 hover:bg-gray-900 hover:text-white flex items-center justify-center text-sm font-bold rounded-full transition"
        >
          <IoAdd size={22} className="sm:hidden" />
          <IoAdd size={25} className="hidden sm:block" />
        </button>

        <button
          onClick={() => nav("/")}
          className="w-8 h-8 sm:w-9 sm:h-9 text-gray-800 hover:bg-gray-900 hover:text-white flex items-center justify-center text-sm font-bold rounded-full transition"
        >
          <SiHomeadvisor size={20} className="sm:hidden" />
          <SiHomeadvisor size={25} className="hidden sm:block" />
        </button>

        <button
          onClick={() => nav("/profile")}
          className="w-8 h-8 sm:w-9 sm:h-9 text-gray-800 hover:bg-gray-900 hover:text-white flex items-center justify-center text-sm font-bold rounded-full transition"
        >
          <IoPerson size={20} className="sm:hidden" />
          <IoPerson size={25} className="hidden sm:block" />
        </button>
      </div>
    </header>
  );
}