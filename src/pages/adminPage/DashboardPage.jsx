import React from "react";
import { FiPackage, FiUsers, FiShoppingCart, FiMail } from "react-icons/fi";
import StatCard from "./StatCard";

export default function DashboardPage({ products, subscribers, setActiveTab }) {
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FiPackage}
          label="Total Products"
          value={products.length}
          sub="+2 this week"
          color="bg-[#e8f6ea] text-[#01796F]"
        />
        <StatCard
          icon={FiUsers}
          label="Total Users"
          value="1,284"
          sub="+18 today"
          color="bg-[#e8f4ff] text-[#4a6fa5]"
        />
        <StatCard
          icon={FiShoppingCart}
          label="Total Orders"
          value="3,762"
          sub="12 pending"
          color="bg-[#fff7e6] text-[#c97d10]"
        />
        <StatCard
          icon={FiMail}
          label="Subscribers"
          value={subscribers.length}
          sub="Newsletter"
          color="bg-[#fde8f0] text-[#c0305a]"
        />
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e8f0ef] p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-800">Recent Products</h3>
          <button
            onClick={() => setActiveTab("products")}
            className="text-xs text-[#01796F] font-semibold hover:underline"
          >
            View all →
          </button>
        </div>
        <div className="space-y-3">
          {products.slice(0, 4).map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#f8fffe] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#e8f6ea] flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                <p className="text-xs text-gray-400">
                  {p.brand} · {p.category}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-gray-800">
                  ₹{p.price.toLocaleString()}
                </p>
                <p
                  className={`text-xs font-medium ${
                    p.stock === 0
                      ? "text-red-400"
                      : p.stock < 15
                      ? "text-amber-500"
                      : "text-[#01796F]"
                  }`}
                >
                  {p.stock === 0 ? "Out of stock" : `${p.stock} in stock`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}