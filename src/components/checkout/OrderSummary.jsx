import { FiLock } from "react-icons/fi";
import { PLACEHOLDER } from "./CheckoutUtils";

export default function OrderSummary({
  cartItems,
  subtotal,
  shipping,
  total,
  discount,
  appliedCoupon,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">Order Summary</h3>
        <span className="text-xs text-gray-400">
          {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Items */}
      <div className="px-5 py-4 space-y-3 max-h-56 overflow-y-auto">
        {cartItems.map((item) => (
          <div
            key={`${item._id}-${item.size}-${item.color}`}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
              <img
                src={item.image || PLACEHOLDER}
                alt={item.name}
                onError={(e) => {
                  e.target.src = PLACEHOLDER;
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">
                {item.name}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {item.size && `${item.size}`}
                {item.color &&
                  ` · ${typeof item.color === "object" ? item.color.name : item.color}`}
                {` · Qty ${item.qty}`}
              </p>
            </div>
            <p className="text-xs font-bold text-gray-900 flex-shrink-0">
              ₹{(item.price * item.qty).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="px-5 py-4 space-y-2.5 border-t border-gray-100">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Subtotal</span>
          <span className="font-medium text-gray-700">
            ₹{subtotal.toFixed(2)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm text-[#088178] font-medium">
            <span>Coupon ({appliedCoupon?.code})</span>
            <span>−₹{discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm text-gray-500">
          <span>Shipping</span>
          <span
            className={
              shipping === 0
                ? "text-[#088178] font-semibold"
                : "text-gray-700 font-medium"
            }
          >
            {shipping === 0 ? "Free" : `₹${shipping}`}
          </span>
        </div>

        <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center">
          <span className="text-sm font-bold text-gray-900">Total</span>
          <span className="text-xl font-extrabold text-gray-900">
            ₹{total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Trust note */}
      <div className="px-5 pb-4 flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
        <FiLock size={10} /> Secure checkout · UPI · Cards · Net Banking
      </div>
    </div>
  );
}
