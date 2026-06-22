import React from "react";

import { useNavigate } from "react-router-dom";

import { FiBell } from "react-icons/fi";
import { SiHomeadvisor } from "react-icons/si";
import { IoPerson } from "react-icons/io5";
import { IoAdd } from "react-icons/io5";

import Profile from  "../Profile"


const pageTitles = {
  dashboard: "Dashboard Overview",
  products: "Product Management",
  newsletter: "Newsletter & Messages",
};

export default function AdminTopbar({ activeTab,onAddProduct }) {
   const nav = useNavigate();

  
  return (
    <header className="bg-white border-b border-[#e8f0ef] px-6 py-4 flex items-center justify-between shadow-sm">
      <div>
        <h1 className="text-lg font-bold text-gray-800">
          {pageTitles[activeTab] || "Admin"}
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">Welcome back, Admin</p>
      </div>
      <div className="flex items-center gap-7">
        <button className="relative p-2 rounded-xl bg-[#f0f7f6] text-[#01796F] hover:bg-[#e8f6ea] transition-colors">
          <FiBell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full" />
        </button>

         <button onClick={onAddProduct} className=" w-9 h-9 text-gray-800 hover:bg-gray-900 hover:text-white flex items-center justify-center text-sm font-bold rounded-full transition">
          <IoAdd size={25} />
        </button>

        <button onClick={() => nav("/")} className=" w-9 h-9 text-gray-800 hover:bg-gray-900 hover:text-white flex items-center justify-center text-sm font-bold rounded-full transition">
          <SiHomeadvisor size={25} />
        </button>
        <button onClick = {()=> nav("/profile")} className="w-9 h-9 text-gray-800 hover:bg-gray-900 hover:text-white flex items-center justify-center text-sm font-bold rounded-full transition">
        <IoPerson size={25} />
        </button>
      </div>
    </header>
  );
}
