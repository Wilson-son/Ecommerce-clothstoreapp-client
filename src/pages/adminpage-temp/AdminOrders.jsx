import { useState } from "react";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../redux/api/orderApiSlice";
import {
  FiTruck,
  FiCheck,
  FiClock,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiFilter,
  FiAlertCircle,
} from "react-icons/fi";

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Pending:   { color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", icon: <FiClock size={12} /> },
  Paid:      { color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe", icon: <FiCheck size={12} /> },
  Shipped:   { color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe", icon: <FiTruck size={12} /> },
  Delivered: { color: "#088178", bg: "#f0faf8", border: "#c6ede6", icon: <FiCheck size={12} /> },
  Cancelled: { color: "#ef4444", bg: "#fff8f8", border: "#fecaca", icon: <FiX size={12} /> },
};

const ALL_STATUSES = ["Pending", "Paid", "Shipped", "Delivered", "Cancelled"];

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3C/svg%3E";

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border"
      style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
    >
      {cfg.icon} {status}
    </span>
  );
}

// ── Status selector ───────────────────────────────────────────────────────────
// NOTE: We derive displayed value from the *live* order.status prop passed by
// the parent (which comes straight from the RTK Query cache), so the badge and
// selector always reflect the latest server state after invalidatesTags fires.
function StatusSelector({ orderId, currentStatus }) {
  const [updateStatus, { isLoading }] = useUpdateOrderStatusMutation();
  const [optimistic, setOptimistic] = useState(null); // null = use server value
  const [updateError, setUpdateError] = useState(false);

  // Show optimistic value during the in-flight request; fall back to server
  const displayValue = optimistic ?? currentStatus;

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    setOptimistic(newStatus);
    setUpdateError(false);
    try {
      await updateStatus({ orderId, status: newStatus }).unwrap();
      // Cache is invalidated → parent re-renders with new currentStatus.
      // Clear optimistic so we hand back control to the server value.
      setOptimistic(null);
    } catch {
      setOptimistic(null); // revert to server value
      setUpdateError(true);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <select
        value={displayValue}
        onChange={handleChange}
        disabled={isLoading}
        className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 font-semibold outline-none cursor-pointer hover:border-gray-400 transition-colors disabled:opacity-50"
      >
        {ALL_STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      {updateError && (
        <FiAlertCircle
          size={13}
          className="text-red-400 flex-shrink-0"
          title="Update failed. Try again."
        />
      )}
    </div>
  );
}

// ── Single order row ──────────────────────────────────────────────────────────
function OrderRow({ order }) {
  const [expanded, setExpanded] = useState(false);

  const customerName = order.shippingAddress?.fullName || "—";
  const customerPhone = order.shippingAddress?.phone || "";
  const itemCount = order.orderItems?.length ?? 0;

  return (
    <>
      {/* Main row */}
      <tr className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors">
        <td className="px-4 py-3">
          <p className="text-xs font-bold text-gray-700 font-mono">
            #{order._id.slice(-8).toUpperCase()}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </td>

        <td className="px-4 py-3">
          <p className="text-xs font-semibold text-gray-800">{customerName}</p>
          {customerPhone && (
            <p className="text-[10px] text-gray-400 mt-0.5">{customerPhone}</p>
          )}
          {/* Populated user info from getAllOrders (populate("user","name email")) */}
          {order.user?.email && (
            <p className="text-[10px] text-gray-400">{order.user.email}</p>
          )}
        </td>

        <td className="px-4 py-3">
          <p className="text-xs text-gray-500">
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </p>
        </td>

        <td className="px-4 py-3">
          <p className="text-sm font-bold text-gray-900">
            ₹{order.totalPrice?.toFixed(2)}
          </p>
        </td>

        <td className="px-4 py-3">
          <StatusBadge status={order.status} />
        </td>

        <td className="px-4 py-3">
          <StatusSelector orderId={order._id} currentStatus={order.status} />
        </td>

        <td className="px-4 py-3">
          <button
            onClick={() => setExpanded((p) => !p)}
            aria-label={expanded ? "Collapse order details" : "Expand order details"}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            {expanded ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />}
          </button>
        </td>
      </tr>

      {/* Expanded detail row */}
      {expanded && (
        <tr className="bg-gray-50/60 border-b border-gray-100">
          <td colSpan={7} className="px-6 py-4">
            <div className="flex flex-col lg:flex-row gap-6">

              {/* Items */}
              <div className="flex-1 space-y-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Items Ordered
                </p>
                {order.orderItems?.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
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
                    <p className="text-xs font-bold text-gray-700 flex-shrink-0">
                      ₹{(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Address + Payment */}
              <div className="lg:w-60 space-y-3">
                {/* Shipping address */}
                <div className="bg-white border border-gray-100 rounded-xl px-4 py-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Shipping Address
                  </p>
                  <p className="text-xs font-semibold text-gray-800">
                    {order.shippingAddress?.fullName}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                    {order.shippingAddress?.address},{" "}
                    {order.shippingAddress?.city} – {order.shippingAddress?.pincode},{" "}
                    {order.shippingAddress?.state}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {order.shippingAddress?.phone}
                  </p>
                </div>

                {/* Payment breakdown */}
                <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 space-y-1.5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Payment
                  </p>
                  <div className="flex justify-between text-[11px] text-gray-500">
                    <span>Method</span>
                    <span className="font-semibold text-gray-700">
                      {order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-500">
                    <span>Paid</span>
                    <span className={order.isPaid ? "text-[#088178] font-semibold" : "text-red-400 font-semibold"}>
                      {order.isPaid ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-500">
                    <span>Items</span>
                    <span>₹{order.itemsPrice?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-500">
                    <span>Shipping</span>
                    <span>
                      {order.shippingPrice === 0 ? "Free" : `₹${order.shippingPrice}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-gray-900 pt-1 border-t border-dashed border-gray-200">
                    <span>Total</span>
                    <span>₹{order.totalPrice?.toFixed(2)}</span>
                  </div>
                </div>

                {/* Razorpay IDs (only for Razorpay orders) */}
                {order.paymentMethod === "Razorpay" && order.paymentResult?.razorpay_payment_id && (
                  <div className="bg-white border border-gray-100 rounded-xl px-4 py-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                      Razorpay
                    </p>
                    <p className="text-[10px] text-gray-500 font-mono break-all">
                      {order.paymentResult.razorpay_payment_id}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ── Stats card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-2xl font-extrabold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

// ── Main Admin Orders page ────────────────────────────────────────────────────
export default function AdminOrders() {
  const { data: orders, isLoading, error } = useGetAllOrdersQuery();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-[#088178] rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading orders…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-red-400 font-semibold">Failed to load orders.</p>
      </div>
    );
  }

  const allOrders = orders || [];

  // ── Filter + search ─────────────────────────────────────────────────────────
  const filtered = allOrders.filter((o) => {
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      o._id.toLowerCase().includes(q) ||
      o.shippingAddress?.fullName?.toLowerCase().includes(q) ||
      o.shippingAddress?.phone?.includes(search) ||
      o.user?.email?.toLowerCase().includes(q) ||
      o.user?.name?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  // ── Stats ───────────────────────────────────────────────────────────────────
  // Revenue excludes cancelled orders (consistent with real revenue)
  const totalRevenue = allOrders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const countByStatus = (s) => allOrders.filter((o) => o.status === s).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {allOrders.length} total order{allOrders.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <StatCard
            label="Revenue (excl. cancelled)"
            value={`₹${totalRevenue.toFixed(0)}`}
            color="#088178"
          />
          <StatCard label="Pending"   value={countByStatus("Pending")}   color="#f59e0b" />
          <StatCard label="Shipped"   value={countByStatus("Shipped")}   color="#8b5cf6" />
          <StatCard label="Delivered" value={countByStatus("Delivered")} color="#088178" />
          <StatCard label="Cancelled" value={countByStatus("Cancelled")} color="#ef4444" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 flex-1 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-gray-400 transition-colors">
            <FiSearch size={13} className="text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, name, email, or phone…"
              className="flex-1 text-sm outline-none placeholder-gray-300 text-gray-800 bg-transparent"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
            <FiFilter size={13} className="text-gray-400 flex-shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm outline-none text-gray-700 bg-transparent font-medium cursor-pointer"
            >
              <option value="All">All Statuses</option>
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  {["Order ID", "Customer", "Items", "Total", "Status", "Update Status", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400">
                      No orders match your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((order) => (
                    <OrderRow key={order._id} order={order} />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer count */}
          {filtered.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/40">
              <p className="text-[11px] text-gray-400">
                Showing {filtered.length} of {allOrders.length} orders
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}