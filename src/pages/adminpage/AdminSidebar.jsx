import React from "react";
import { FiBarChart2, FiPackage, FiMail, FiShoppingCart, FiChevronDown, FiX } from "react-icons/fi";
import { HiMiniShoppingBag } from "react-icons/hi2";

const tabs = [
  { key: "dashboard", label: "Dashboard", icon: FiBarChart2 },
  { key: "products", label: "Products", icon: FiPackage },
  { key: "orders", label: "orders", icon: FiShoppingCart },
  { key: "newsletter", label: "Newsletter", icon: FiMail },
];

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  mobileOpen = false,
  setMobileOpen = () => {},
}) {
  return (
    <aside
      className={`
        bg-white border-r border-[#e8f0ef] flex flex-col shadow-sm z-40
        fixed inset-y-0 left-0 w-64 transform transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:static md:translate-x-0 md:transition-all
        ${sidebarOpen ? "md:w-56" : "md:w-16"}
      `}
    >
      {/* Logo */}
      <div className="px-4 py-5 flex items-center gap-3 border-b border-[#e8f0ef]">
        <div className="w-9 h-9 bg-[#1F2937] rounded-xl flex items-center justify-center flex-shrink-0">
          <HiMiniShoppingBag size={18} className="text-white" />
        </div>
         
        <span
          className={`font-bold text-gray-800 text-base tracking-tight ${
            sidebarOpen ? "" : "md:hidden"
          }`}
        >
          Cara Admin
        </span>

        {/* Close button — mobile drawer only */}
        <button
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
          className="ml-auto p-1.5 rounded-lg text-gray-400 hover:bg-[#f0f7f6] hover:text-gray-600 transition-colors md:hidden"
        >
          <FiX size={18} />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              activeTab === key
                ? "bg-[#1F2937] text-[#f0f7f6]"
                : "text-gray-500 hover:bg-[#f0f7f6] hover:text-gray-700"
            }`}
          >
            <Icon size={18} className="flex-shrink-0" />
            <span className={sidebarOpen ? "" : "md:hidden"}>{label}</span>
            {activeTab === key && (
              <span
                className={`ml-auto w-1.5 h-1.5 bg-[#f0f7f6] rounded-full ${
                  sidebarOpen ? "" : "md:hidden"
                }`}
              />
            )}
          </button>
        ))}
      </nav>

      
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="hidden md:flex m-3 mt-auto items-center justify-center gap-2 p-2.5 rounded-xl text-gray-400 hover:bg-[#f0f7f6] hover:text-gray-600 transition-colors text-xs font-medium"
      >
        <FiChevronDown
          size={16}
          className={`transition-transform ${sidebarOpen ? "rotate-90" : "-rotate-90"}`}
        />
        {sidebarOpen && "Collapse"}
      </button>
    </aside>
  );
}