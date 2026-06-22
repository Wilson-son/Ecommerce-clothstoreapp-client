import { FiMapPin, FiCreditCard, FiLock, FiChevronRight, FiArrowLeft } from "react-icons/fi";

export default function PaymentStep({ shippingForm, total, onSuccess, onBack, isLoading }) {
  return (
    <div className="space-y-4">
      {/* Shipping review */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
            <FiMapPin size={13} className="text-[#088178]" />
            Delivering to
          </div>
          <button
            onClick={onBack}
            className="text-[11px] text-[#088178] hover:underline font-semibold"
          >
            Edit
          </button>
        </div>
        <p className="text-sm font-semibold text-gray-900">{shippingForm.fullName}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
          {shippingForm.address}, {shippingForm.city} – {shippingForm.pincode},{" "}
          {shippingForm.state}
        </p>
        <p className="text-xs text-gray-500">{shippingForm.phone}</p>
      </div>

      {/* Payment card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center gap-2">
          <FiCreditCard size={15} className="text-[#088178]" />
          <h2 className="text-sm font-bold text-gray-900">Payment</h2>
        </div>

        <div className="px-6 py-5 space-y-3">
          {/* Razorpay */}
          <button
            onClick={onSuccess}
            disabled={isLoading}
            className="w-full bg-[#072654] text-white py-3.5 rounded-full text-sm font-bold hover:bg-[#0a3578] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Processing…
              </>
            ) : (
              <>
                <FiLock size={14} /> Pay ₹{total.toFixed(2)} with Razorpay
              </>
            )}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">or pay with</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Coming soon options */}
          {[
            { label: "UPI / QR Code", sub: "PhonePe, GPay, Paytm" },
            { label: "Cash on Delivery", sub: "₹40 extra COD charge" },
          ].map((opt) => (
            <button
              key={opt.label}
              className="w-full flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 hover:border-gray-400 transition-colors text-left"
              onClick={() => alert("Coming Soon")}
            >
              <div>
                <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{opt.sub}</p>
              </div>
              <FiChevronRight size={14} className="text-gray-400" />
            </button>
          ))}
        </div>

        <div className="px-6 pb-5">
          <button
            onClick={onBack}
            className="w-full text-xs text-gray-400 hover:text-gray-700 py-1 flex items-center justify-center gap-1 transition-colors"
          >
            <FiArrowLeft size={11} /> Back to shipping
          </button>
        </div>
      </div>
    </div>
  );
}