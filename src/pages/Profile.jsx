import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiShoppingBag,
  FiHeart,
  FiLogOut,
  FiChevronRight,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiEdit2,
  FiGrid,
  FiSettings,
} from "react-icons/fi";
import { logout } from "../redux/slices/authSlice";

// ── Mock order data (replace with real API data) ──────────────────────────────
const MOCK_ORDERS = [
  {
    id: "ORD-2024-001",
    date: "12 Nov 2024",
    status: "Delivered",
    total: 2499,
    items: [
      { name: "Classic Grey Hoodie", qty: 1, size: "M", price: 1499 },
      { name: "White Minimalist Tee", qty: 2, size: "L", price: 500 },
    ],
  },
  {
    id: "ORD-2024-002",
    date: "01 Dec 2024",
    status: "In Transit",
    total: 1799,
    items: [
      { name: "Olive Cargo Pants", qty: 1, size: "32", price: 1799 },
    ],
  },
  {
    id: "ORD-2024-003",
    date: "08 Dec 2024",
    status: "Processing",
    total: 3299,
    items: [
      { name: "Navy Windbreaker", qty: 1, size: "XL", price: 2299 },
      { name: "Burgundy Cap", qty: 1, size: "Free", price: 1000 },
    ],
  },
];

const STATUS_CONFIG = {
  Delivered: {
    icon: <FiCheckCircle size={11} />,
    bg: "#E6F7F2",
    color: "#0a6e56",
    border: "#a3e2cd",
  },
  "In Transit": {
    icon: <FiTruck size={11} />,
    bg: "#EFF6FF",
    color: "#1d4ed8",
    border: "#bfdbfe",
  },
  Processing: {
    icon: <FiClock size={11} />,
    bg: "#FFFBEB",
    color: "#92400e",
    border: "#fcd34d",
  },
};

// ── Expandable Order Row (inside the single card) ─────────────────────────────
function OrderRow({ order }) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG["Processing"];

  return (
    <div className="border-b border-gray-50 last:border-b-0">
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/60 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
            <FiShoppingBag size={13} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-800">{order.id}</p>
            <p className="text-[11px] text-gray-400">{order.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <span
            className="hidden sm:flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border"
            style={{ background: status.bg, color: status.color, borderColor: status.border }}
          >
            {status.icon}
            {order.status}
          </span>
          <span className="text-xs font-extrabold text-gray-900">
            ₹{order.total.toLocaleString()}
          </span>
          <FiChevronRight
            size={13}
            className="text-gray-300 transition-transform duration-200"
            style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}
          />
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-4 pt-1 space-y-2.5 bg-gray-50/40">
          {/* Mobile status */}
          <span
            className="sm:hidden inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border mb-1"
            style={{ background: status.bg, color: status.color, borderColor: status.border }}
          >
            {status.icon}
            {order.status}
          </span>

          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <FiPackage size={11} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-700">{item.name}</p>
                  <p className="text-[10px] text-gray-400">Size: {item.size} · Qty: {item.qty}</p>
                </div>
              </div>
              <p className="text-[11px] font-bold text-gray-600">₹{item.price.toLocaleString()}</p>
            </div>
          ))}

          <button className="mt-1 w-full flex items-center justify-center gap-1.5 border border-gray-200 rounded-lg py-2 text-[11px] font-bold text-gray-500 hover:border-gray-300 hover:text-gray-800 transition-colors bg-white">
            <FiTruck size={11} />
            Track Order
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Profile Page ─────────────────────────────────────────────────────────
export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist?.wishlistItems || []);

  const [activeTab, setActiveTab] = useState("orders");

  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const displayName = user?.name || "";
  const displayEmail = user?.email || "—";

  // ── Admin view: single info card ──────────────────────────────────────────
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-lg mx-auto px-4 md:px-8">

          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:border-gray-400 transition-colors shadow-sm text-gray-600"
            >
              <FiArrowLeft size={16} />
            </button>
            <h1 className="text-2xl font-black text-gray-950 tracking-tight">My Profile</h1>
          </div>

          {/* Single card for admin */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">

            {/* Top: identity */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500">
                  <FiUser size={20} />
                </div>
                <div>
                  {displayName && (
                    <p className="text-base font-black text-gray-900 leading-tight">{displayName}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">{displayEmail}</p>
                  <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-900 text-white">
                    
                    Admin
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors px-3 py-2 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100"
              >
                <FiLogOut size={14} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>

            {/* Info rows */}
            {[
              { icon: <FiMail size={13} />, label: "Email", value: displayEmail },
              { icon: <FiPhone size={13} />, label: "Phone", value: user?.phone || "Not added" },
              { icon: <FiMapPin size={13} />, label: "Address", value: user?.address || "Not added" },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 px-6 py-4 border-b border-gray-50 last:border-b-0">
                <span className="text-gray-400 flex-shrink-0">{icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate">{value}</p>
                </div>
              </div>
            ))}

            {/* Admin quick links */}
            {[
              {
                icon: <FiGrid size={14} />,
                label: "Admin Dashboard",
                sub: "Manage products, orders & users",
                onClick: () => navigate("/admin"),
              },
              {
                icon: <FiSettings size={14} />,
                label: "Settings",
                sub: "Password, data settings",
                onClick: () => {},
              },
              
            ].map(({ icon, label, sub, onClick, danger }) => (
              <button
                key={label}
                onClick={onClick}
                className="w-full flex items-center gap-4 px-6 py-4 border-t border-gray-50 hover:bg-gray-50/70 transition-colors text-left"
              >
                <span className={danger ? "text-red-400 flex-shrink-0" : "text-gray-400 flex-shrink-0"}>
                  {icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${danger ? "text-red-500" : "text-gray-800"}`}>{label}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
                </div>
                <FiChevronRight size={13} className="text-gray-300 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Regular user view ─────────────────────────────────────────────────────
  const deliveredCount = MOCK_ORDERS.filter((o) => o.status === "Delivered").length;
  const inTransitCount = MOCK_ORDERS.filter((o) => o.status === "In Transit").length;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 md:px-8">

        {/* ── Header ── */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:border-gray-400 transition-colors shadow-sm text-gray-600"
          >
            <FiArrowLeft size={16} />
          </button>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight">My Profile</h1>
        </div>

        {/* ── THE ONE CARD ── */}
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">

          {/* Identity row */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 flex-shrink-0">
                <FiUser size={22} />
              </div>
              <div>
                {displayName && (
                  <p className="text-base font-black text-gray-900 leading-tight">{displayName}</p>
                )}
                <p className="text-xs text-gray-400 mt-0.5">{displayEmail}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors px-3 py-2 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100"
            >
              <FiLogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-4 divide-x divide-gray-100 border-b border-gray-100">
            {[
              { label: "Orders", value: MOCK_ORDERS.length, color: "#088178" },
              { label: "Delivered", value: deliveredCount, color: "#0a6e56" },
              { label: "In Transit", value: inTransitCount, color: "#1d4ed8" },
              { label: "Wishlist", value: wishlistItems.length, color: "#ef4444" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex flex-col items-center py-4 gap-0.5">
                <p className="text-lg font-black" style={{ color }}>{value}</p>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-center leading-tight px-1">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {[
              { key: "orders", icon: <FiShoppingBag size={12} />, label: "My Orders" },
              { key: "details", icon: <FiUser size={12} />, label: "Account" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex-1 flex items-center justify-center gap-1.5 py-3.5 text-xs font-bold transition-all duration-200 border-b-2"
                style={
                  activeTab === tab.key
                    ? { borderBottomColor: "#111", color: "#111" }
                    : { borderBottomColor: "transparent", color: "#9ca3af" }
                }
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Orders tab content ── */}
          {activeTab === "orders" && (
            <div>
              {MOCK_ORDERS.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 text-center px-6">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3 text-gray-300">
                    <FiShoppingBag size={22} />
                  </div>
                  <p className="text-sm font-bold text-gray-800">No orders yet</p>
                  <p className="text-xs text-gray-400 mt-1 mb-5">Your purchases will show up here.</p>
                  <button
                    onClick={() => navigate("/")}
                    className="bg-gray-900 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl hover:bg-[#088178] transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                MOCK_ORDERS.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))
              )}
            </div>
          )}

          {/* ── Account details tab content ── */}
          {activeTab === "details" && (
            <div>
              {/* Info rows */}
              {[
                { icon: <FiUser size={13} />, label: "Full Name", value: displayName || "—" },
                { icon: <FiMail size={13} />, label: "Email", value: displayEmail },
                { icon: <FiPhone size={13} />, label: "Phone", value: user?.phone || "Not added" },
                { icon: <FiMapPin size={13} />, label: "Address", value: user?.address || "Not added" },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50">
                  <span className="text-gray-400 flex-shrink-0">{icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate">{value}</p>
                  </div>
                  <button className="text-gray-300 hover:text-[#088178] transition-colors flex-shrink-0">
                    <FiEdit2 size={13} />
                  </button>
                </div>
              ))}

              {/* Quick links */}
              {[
                {
                  icon: <FiHeart size={14} />,
                  label: "My Wishlist",
                  sub: `${wishlistItems.length} saved items`,
                  onClick: () => navigate("/whishlist"),
                },
                {
                  icon: <FiShield size={14} />,
                  label: "Privacy & Security",
                  sub: "Password, data settings",
                  onClick: () => {},
                },
                {
                  icon: <FiLogOut size={14} />,
                  label: "Sign Out",
                  sub: "Logout from this device",
                  onClick: handleLogout,
                  danger: true,
                },
              ].map(({ icon, label, sub, onClick, danger }) => (
                <button
                  key={label}
                  onClick={onClick}
                  className="w-full flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50/70 transition-colors text-left"
                >
                  <span className={danger ? "text-red-400 flex-shrink-0" : "text-gray-400 flex-shrink-0"}>
                    {icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${danger ? "text-red-500" : "text-gray-800"}`}>
                      {label}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
                  </div>
                  <FiChevronRight size={13} className="text-gray-300 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}