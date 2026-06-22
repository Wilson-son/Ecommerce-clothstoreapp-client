import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  clearCart,
  increaseQty,
  decreaseQty,
  addToCart,
} from "../redux/slices/cartSlice";
import {
  FiArrowLeft,
  FiTrash2,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiTag,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiX,
  FiCheck,
  FiChevronRight,
  FiChevronDown,
} from "react-icons/fi";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='12' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

const VALID_COUPONS = { SAVE10: 10, CARA20: 20 };

// ── Shipping Progress ─────────────────────────────────────────────────────────
function ShippingProgress({ subtotal }) {
  const threshold = 999;
  const pct = Math.min((subtotal / threshold) * 100, 100);
  const remaining = threshold - subtotal;

  return (
    <div className="bg-[#f0faf8] border border-[#c6ede6] rounded-xl px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold text-[#088178] flex items-center gap-1.5">
          <FiTruck size={12} />
          {subtotal >= threshold
            ? "You've unlocked free shipping!"
            : `₹${remaining.toFixed(0)} away from free shipping`}
        </span>
        <span className="text-[10px] text-gray-400">{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 bg-white rounded-full overflow-hidden border border-[#c6ede6]">
        <div
          className="h-full bg-[#088178] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ── Cart Item ─────────────────────────────────────────────────────────────────
function CartItem({ item, onIncrease, onDecrease, onRemove, onChangeSize }) {
  const [imgErr, setImgErr] = useState(false);
  const [showSizes, setShowSizes] = useState(false);

  //  Use sizes stored on the item from DB, fallback to common sizes
  const availableSizes = item.sizes?.length
    ? item.sizes
    : ["S", "M", "L", "XL"];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 hover:border-gray-200 hover:shadow-sm transition-all duration-200 group">
      {/* Image */}
      <div className="w-[84px] h-[84px] rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
        <img
          src={imgErr ? PLACEHOLDER : item.image || PLACEHOLDER}
          alt={item.name}
          onError={() => setImgErr(true)}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
              {item.name}
            </h3>

            {/* Color + Size row */}
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {/* Color badge */}
              {item.color && (
                <span className="flex items-center gap-1 text-[11px] text-gray-400">
                  <span
                    className="inline-block w-3 h-3 rounded-full border border-gray-200 flex-shrink-0"
                    style={{ backgroundColor: item.color.toLowerCase() }}
                  />
                  {typeof item.color === "object" ? item.color?.name : item.color}
                </span>
              )}

              {/* ── Size selector — only shows product's own sizes ── */}
              <div className="relative">
                <button
                  onClick={() => setShowSizes((p) => !p)}
                  className="flex items-center gap-1 text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium transition-colors"
                >
                  {item.size || "Size"}
                  <FiChevronDown
                    size={10}
                    style={{
                      transform: showSizes ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.15s",
                    }}
                  />
                </button>

                {showSizes && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-2 flex flex-wrap gap-1 min-w-[120px]">
                    {/* ✅ Only shows sizes available for this product */}
                    {availableSizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          onChangeSize(item, s);
                          setShowSizes(false);
                        }}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all"
                        style={{
                          background: item.size === s ? "#111" : "#f3f4f6",
                          color: item.size === s ? "#fff" : "#374151",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Remove button */}
          <button
            onClick={() => onRemove(item._id, item.size, item.color)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0 opacity-0 group-hover:opacity-100"
            title="Remove item"
          >
            <FiX size={14} />
          </button>
        </div>

        {/* Price + Qty */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1 border border-gray-200 rounded-full px-1 py-0.5">
            <button
              onClick={() => onDecrease(item)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-all disabled:opacity-30"
              disabled={item.qty <= 1}
            >
              <FiMinus size={10} />
            </button>
            <span className="text-sm font-bold w-6 text-center text-gray-800">
              {item.qty}
            </span>
            <button
              onClick={() => onIncrease(item)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-all"
            >
              <FiPlus size={10} />
            </button>
          </div>

          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">
              ₹{(item.price * item.qty).toFixed(2)}
            </p>
            {item.qty > 1 && (
              <p className="text-[10px] text-gray-400">₹{item.price} each</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Cart ─────────────────────────────────────────────────────────────────
export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems || []);

  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponFocused, setCouponFocused] = useState(false);

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (VALID_COUPONS[code]) {
      setAppliedCoupon({ code, discount: VALID_COUPONS[code] });
      setCouponError("");
    } else {
      setAppliedCoupon(null);
      setCouponError("That code isn't valid. Try SAVE10 or CARA20.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCoupon("");
    setCouponError("");
  };

  // ✅ Remove old size, add new size — preserves qty and all other fields
  const handleChangeSize = (item, newSize) => {
    if (item.size === newSize) return;
    dispatch(removeFromCart({ _id: item._id, size: item.size, color: item.color }));
    dispatch(addToCart({ ...item, size: newSize }));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 0),
    0,
  );
  const discountAmount = appliedCoupon
    ? (subtotal * appliedCoupon.discount) / 100
    : 0;
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal - discountAmount + shipping;
  const totalQty = cartItems.reduce((sum, item) => sum + (item.qty || 0), 0);

  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-5 px-4 pt-20">
        <div className="w-20 h-20 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center">
          <FiShoppingBag size={28} className="text-gray-300" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="text-sm text-gray-400 mt-1.5 max-w-xs leading-relaxed">
            Looks like you haven't added anything yet. Browse our collections to get started.
          </p>
        </div>
        <button
          onClick={() => navigate("/shop")}
          className="flex items-center gap-2 bg-gray-900 text-white px-7 py-3 rounded-full text-sm font-semibold hover:bg-[#088178] transition-colors"
        >
          Browse Products
          <FiChevronRight size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pt-20">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 hover:text-gray-700 transition-colors"
          >
            <FiArrowLeft size={12} />
            Home
          </button>
          <span>›</span>
          <span className="text-gray-600 font-medium">Cart</span>
        </div>

        {/* Title row */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              Shopping Cart
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {totalQty} item{totalQty !== 1 ? "s" : ""} in your bag
            </p>
          </div>
          <button
            onClick={() => dispatch(clearCart())}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors border border-gray-200 hover:border-red-200 rounded-full px-3 py-1.5"
          >
            <FiTrash2 size={12} />
            Clear cart
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* LEFT: Items */}
          <div className="flex-1 flex flex-col gap-3">
            <ShippingProgress subtotal={subtotal} />

            {cartItems.map((item) => (
              <CartItem
                key={`${item._id}-${item.size}-${item.color}`}
                item={item}
                onIncrease={(i) => dispatch(increaseQty(i))}
                onDecrease={(i) => dispatch(decreaseQty(i))}
                onRemove={(id, size, color) =>
                  dispatch(removeFromCart({ _id: id, size, color }))
                }
                onChangeSize={handleChangeSize}
              />
            ))}

            {/* Trust badges */}
            <div className="mt-2 grid grid-cols-3 gap-3">
              {[
                { icon: <FiTruck size={15} />, label: "Free shipping", sub: "Orders above ₹999" },
                { icon: <FiShield size={15} />, label: "Secure payment", sub: "SSL encrypted" },
                { icon: <FiRefreshCw size={15} />, label: "Easy returns", sub: "30-day policy" },
              ].map(({ icon, label, sub }) => (
                <div
                  key={label}
                  className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col items-center text-center gap-1.5"
                >
                  <span className="text-[#088178]">{icon}</span>
                  <p className="text-[11px] font-semibold text-gray-700 leading-tight">{label}</p>
                  <p className="text-[10px] text-gray-400">{sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="w-full lg:w-[300px] flex-shrink-0 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60">
                <h2 className="text-sm font-bold text-gray-900">Order Summary</h2>
              </div>

              <div className="px-5 py-5 space-y-5">
                {/* Coupon */}
                <div>
                  <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
                    <FiTag size={11} />
                    Coupon code
                  </label>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-[#f0faf8] border border-[#c6ede6] rounded-xl px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-[#088178] rounded-full flex items-center justify-center flex-shrink-0">
                          <FiCheck size={11} className="text-white" strokeWidth={3} />
                        </span>
                        <div>
                          <p className="text-xs font-bold text-[#088178]">{appliedCoupon.code}</p>
                          <p className="text-[10px] text-[#088178]/70">
                            {appliedCoupon.discount}% discount applied
                          </p>
                        </div>
                      </div>
                      <button onClick={handleRemoveCoupon} className="text-gray-400 hover:text-red-500 transition-colors">
                        <FiX size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      <div
                        className="flex gap-2 border rounded-xl overflow-hidden transition-all duration-200"
                        style={{
                          borderColor: couponError ? "#fca5a5" : couponFocused ? "#111" : "#e5e7eb",
                        }}
                      >
                        <input
                          value={coupon}
                          onChange={(e) => { setCoupon(e.target.value); setCouponError(""); }}
                          onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                          onFocus={() => setCouponFocused(true)}
                          onBlur={() => setCouponFocused(false)}
                          className="flex-1 px-3 py-2.5 text-xs outline-none bg-transparent placeholder-gray-300"
                          placeholder="e.g. SAVE10"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          className="bg-gray-900 text-white text-xs px-4 font-semibold hover:bg-[#088178] transition-colors m-1 rounded-lg"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-[11px] text-red-400 flex items-center gap-1">
                          <FiX size={11} />
                          {couponError}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Price breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>
                      Subtotal
                      <span className="text-gray-400 text-xs ml-1">({totalQty} items)</span>
                    </span>
                    <span className="font-medium text-gray-700">₹{subtotal.toFixed(2)}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-sm text-[#088178] font-medium">
                      <span>Discount ({appliedCoupon.discount}%)</span>
                      <span>−₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-[#088178] font-semibold" : "text-gray-700 font-medium"}>
                      {shipping === 0 ? "Free" : `₹${shipping}`}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-900">Total</span>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-gray-900">₹{total.toFixed(2)}</span>
                    {appliedCoupon && (
                      <p className="text-[10px] text-[#088178] font-medium">
                        You save ₹{discountAmount.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-gray-900 text-white py-3.5 rounded-full text-sm font-bold hover:bg-[#088178] transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
                >
                  Proceed to Checkout
                  <FiChevronRight size={15} />
                </button>

                <button
                  onClick={() => navigate("/shop")}
                  className="w-full text-xs text-gray-400 hover:text-gray-700 transition-colors py-1 text-center flex items-center justify-center gap-1"
                >
                  <FiArrowLeft size={11} />
                  Continue shopping
                </button>
              </div>
            </div>

            <p className="text-center text-[10px] text-gray-400 mt-3">
              Secure checkout · UPI · Cards · Net Banking
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}