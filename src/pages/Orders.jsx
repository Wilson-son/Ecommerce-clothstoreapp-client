import { useState } from "react";
import { useGetMyOrdersQuery } from "../redux/api/orderApiSlice";
import {
  FiTruck,
  FiCheck,
  FiClock,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiShoppingBag,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Pending: {
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
    icon: <FiClock size={13} />,
    label: "Pending",
  },
  Paid: {
    color: "#3b82f6",
    bg: "#eff6ff",
    border: "#bfdbfe",
    icon: <FiCheck size={13} />,
    label: "Paid",
  },
  Shipped: {
    color: "#8b5cf6",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    icon: <FiTruck size={13} />,
    label: "Shipped",
  },
  Delivered: {
    color: "#088178",
    bg: "#f0faf8",
    border: "#c6ede6",
    icon: <FiCheck size={13} />,
    label: "Delivered",
  },
  Cancelled: {
    color: "#ef4444",
    bg: "#fff8f8",
    border: "#fecaca",
    icon: <FiX size={13} />,
    label: "Cancelled",
  },
};

// ── Tracking timeline ─────────────────────────────────────────────────────────
// Maps the 4 non-cancelled statuses in order. "Cancelled" gets its own display.
const TRACKING_STEPS = ["Pending", "Paid", "Shipped", "Delivered"];

function TrackingTimeline({ status }) {
  if (status === "Cancelled") {
    return (
      <div className="flex items-center gap-2 mt-4 px-1">
        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <FiX size={12} className="text-red-500" />
        </div>
        <p className="text-xs text-red-500 font-semibold">Order Cancelled</p>
      </div>
    );
  }

  const currentIndex = TRACKING_STEPS.indexOf(status);

  return (
    <div className="mt-4 px-1">
      <div className="flex items-center gap-0">
        {TRACKING_STEPS.map((step, i) => {
          const done = i <= currentIndex;
          const active = i === currentIndex;
          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0"
                  style={{
                    background: done ? "#088178" : "#f3f4f6",
                    boxShadow: active ? "0 0 0 3px #c6ede6" : "none",
                  }}
                >
                  {done ? (
                    <FiCheck size={11} className="text-white" strokeWidth={3} />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-gray-300" />
                  )}
                </div>
                <span
                  className="text-[9px] font-semibold whitespace-nowrap"
                  style={{ color: done ? "#088178" : "#9ca3af" }}
                >
                  {step}
                </span>
              </div>
              {i < TRACKING_STEPS.length - 1 && (
                <div
                  className="flex-1 h-0.5 mb-4 mx-1 rounded-full transition-all duration-500"
                  style={{ background: i < currentIndex ? "#088178" : "#e5e7eb" }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border"
      style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
    >
      {cfg.icon} {cfg.label}
    </span>
  );
}

// ── Placeholder SVG for broken images ─────────────────────────────────────────
const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3C/svg%3E";

// ── Single order card ─────────────────────────────────────────────────────────
function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
              Order
            </p>
            <p className="text-[11px] font-bold text-gray-700 font-mono">
              #{order._id.slice(-8).toUpperCase()}
            </p>
          </div>
          <p className="text-[11px] text-gray-400">
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} />
          <p className="text-sm font-extrabold text-gray-900">
            ₹{order.totalPrice?.toFixed(2)}
          </p>
          <button
            onClick={() => setExpanded((p) => !p)}
            aria-label={expanded ? "Hide order details" : "Show order details"}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            {expanded ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />}
          </button>
        </div>
      </div>

      {/* Tracking timeline */}
      <div className="px-5 pb-4 border-b border-gray-100">
        <TrackingTimeline status={order.status} />
      </div>

      {/* Expanded: items + price breakdown + address */}
      {expanded && (
        <div className="px-5 py-4 space-y-4 bg-gray-50/40">

          {/* Order items (from backend orderItems array) */}
          <div className="space-y-3">
            {order.orderItems?.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
                  <img
                    src={item.image || PLACEHOLDER}
                    alt={item.name}
                    onError={(e) => { e.target.src = PLACEHOLDER; }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {[
                      item.size && `Size: ${item.size}`,
                      item.color?.name && item.color.name,
                      `Qty: ${item.qty}`,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <p className="text-xs font-bold text-gray-800 flex-shrink-0">
                  ₹{(item.price * item.qty).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Price breakdown (from backend order fields) */}
          <div className="border-t border-dashed border-gray-200 pt-3 space-y-1.5">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Items total</span>
              <span>₹{order.itemsPrice?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Shipping</span>
              <span
                className={
                  order.shippingPrice === 0 ? "text-[#088178] font-semibold" : ""
                }
              >
                {order.shippingPrice === 0 ? "Free" : `₹${order.shippingPrice}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-gray-900 pt-1">
              <span>Total</span>
              <span>₹{order.totalPrice?.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment method */}
          <div className="flex justify-between text-xs text-gray-500">
            <span>Payment</span>
            <span className="font-semibold text-gray-700">{order.paymentMethod}</span>
          </div>

          {/* Shipping address (from backend shippingAddress field) */}
          {order.shippingAddress && (
            <div className="bg-white border border-gray-100 rounded-xl px-4 py-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Delivered to
              </p>
              <p className="text-xs font-semibold text-gray-800">
                {order.shippingAddress.fullName}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                {order.shippingAddress.address}, {order.shippingAddress.city} –{" "}
                {order.shippingAddress.pincode}, {order.shippingAddress.state}
              </p>
              <p className="text-[11px] text-gray-500">{order.shippingAddress.phone}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Orders page ──────────────────────────────────────────────────────────
export default function Orders() {
  const navigate = useNavigate();
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-[#088178] rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading your orders…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-red-400 font-semibold">Failed to load orders.</p>
          <p className="text-xs text-gray-400 mt-1">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {orders?.length || 0} order{orders?.length !== 1 ? "s" : ""} placed
          </p>
        </div>

        {/* Empty state */}
        {!orders?.length ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-16 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
              <FiShoppingBag size={24} className="text-gray-300" />
            </div>
            <h2 className="text-base font-bold text-gray-900 mb-1">No orders yet</h2>
            <p className="text-xs text-gray-400 max-w-xs leading-relaxed mb-5">
              You haven't placed any orders. Browse our collections to get started.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="bg-gray-900 text-white text-sm font-semibold px-7 py-3 rounded-full hover:bg-[#088178] transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}