import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { FiPackage, FiUsers, FiShoppingCart, FiMail } from "react-icons/fi";
import StatCard from "./StatCard";

import { fetchAdminDashboard } from "../../redux/slices/adminSlice";

import { useGetProductsQuery } from "../../redux/api/productApiSlice";


export default function DashboardPage({ setActiveTab }) {
  const dispatch = useDispatch();

  const { data: adminData, loading } = useSelector((state) => state.admin);

  const totalUsers = adminData?.totalUsers ?? 0;
  const totalProducts = adminData?.totalProducts ?? 0;
  const totalSubscribers = adminData?.totalSubscribers ?? 0;
  const totalOrders = adminData?.totalOrders ?? 0;

  const usersToday = adminData?.usersToday ?? 0;
  const subscribersToday = adminData?.subscribersToday ?? 0;

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  // ── Products (for recent products list) ──
  const { data } = useGetProductsQuery();
  const productList = Array.isArray(data)
    ? data
    : data?.products || data?.data || [];

  const recentProducts = [...productList]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={FiPackage}
          label="Total Products"
          value={totalProducts}
          sub="Products"
          color="bg-[#e8f6ea] text-[#01796F]"
        />

        <StatCard
          icon={FiUsers}
          label="Total Users"
          value={totalUsers}
          sub={`+${usersToday} today`}
          color="bg-[#e8f4ff] text-[#4a6fa5]"
        />
        <StatCard
          icon={FiShoppingCart}
          label="Total Orders"
          value={totalOrders}
          sub="Orders"
          color="bg-[#fff7e6] text-[#c97d10]"
        />
        <StatCard
          icon={FiMail}
          label="Subscribers"
          value={totalSubscribers}
          sub={`+${totalSubscribers}`}
          color="bg-[#fde8f0] text-[#c0305a]"
        />
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e8f0ef] p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <h3 className="font-bold text-gray-800">Recent Products</h3>
          <button
            onClick={() => setActiveTab("products")}
            className="text-xs text-[#01796F] font-semibold hover:underline"
          >
            View all →
          </button>
        </div>
        <div className="space-y-3">
          {recentProducts?.length > 0 ? (
            recentProducts.map((p) => (
              <div
                key={p._id}
                className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-xl hover:bg-[#f8fffe] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#e8f6ea] flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img
                    src={p.images?.[0]?.url}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {p.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {p.brand} · {p.category}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-800">
                    ₹{p.price.toLocaleString()}
                  </p>
                  <p
                    className={`text-xs font-medium ${
                      p.countInStock === 0
                        ? "text-red-400"
                        : p.countInStock < 15
                          ? "text-amber-500"
                          : "text-[#01796F]"
                    }`}
                  >
                    {p.countInStock === 0
                      ? "Out of stock"
                      : `${p.countInStock} in stock`}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400">No recent products</p>
          )}
        </div>
      </div>
    </div>
  );
}