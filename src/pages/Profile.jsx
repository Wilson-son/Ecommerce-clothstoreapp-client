import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiShoppingBag,
  FiHeart,
  FiLogOut,
  FiChevronRight,
  FiGrid,
  FiSettings,
} from "react-icons/fi";
import { logout } from "../redux/slices/authSlice";

// ── Shared: action row (link / button) ────────────────────────────────────────
function ActionRow({ icon, label, sub, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-6 py-4 border-t border-gray-50 hover:bg-gray-50/70 transition-colors text-left"
    >
      <span className={danger ? "text-red-400 flex-shrink-0" : "text-gray-400 flex-shrink-0"}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${danger ? "text-red-500" : "text-gray-800"}`}>
          {label}
        </p>
        {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <FiChevronRight size={13} className="text-gray-300 flex-shrink-0" />
    </button>
  );
}

// ── Shared: identity header inside the card ───────────────────────────────────
function IdentityRow({ displayName, displayEmail, badge, onLogout }) {
  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 flex-shrink-0">
          <FiUser size={20} />
        </div>
        <div>
          {displayName && (
            <p className="text-base font-black text-gray-900 leading-tight">{displayName}</p>
          )}
          <p className="text-xs text-gray-400 mt-0.5">{displayEmail}</p>
          {badge && (
            <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-900 text-white">
              {badge}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={onLogout}
        className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors px-3 py-2 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100"
      >
        <FiLogOut size={14} />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  );
}

// ── Main Profile Page ─────────────────────────────────────────────────────────
export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist?.wishlistItems || []);

  const isAdmin = user?.role === "admin";

  const displayName = user?.name || "";
  const displayEmail = user?.email || "—";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // ── Admin view ────────────────────────────────────────────────────────────
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

          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
            <IdentityRow
              displayName={displayName}
              displayEmail={displayEmail}
              badge="Admin"
              onLogout={handleLogout}
            />

            <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-50">
              <span className="text-gray-400 flex-shrink-0"><FiMail size={13} /></span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate">{displayEmail}</p>
              </div>
            </div>

            <ActionRow
              icon={<FiGrid size={14} />}
              label="Admin Dashboard"
              sub="Manage products, orders & users"
              onClick={() => navigate("/admin")}
            />

          </div>
        </div>
      </div>
    );
  }

  // ── Regular user view ─────────────────────────────────────────────────────
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

        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">

          {/* Identity */}
          <IdentityRow
            displayName={displayName}
            displayEmail={displayEmail}
            onLogout={handleLogout}
          />

          {/* Action links */}
          <ActionRow
            icon={<FiShoppingBag size={14} />}
            label="My Orders"
            sub="View your order history & tracking"
            onClick={() => navigate("/orders")}
          />
          <ActionRow
            icon={<FiHeart size={14} />}
            label="My Wishlist"
            sub={`${wishlistItems.length} saved item${wishlistItems.length !== 1 ? "s" : ""}`}
            onClick={() => navigate("/whishlist")}
          />
        </div>
      </div>
    </div>
  );
}