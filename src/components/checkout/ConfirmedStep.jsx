import { FiCheck, FiPackage, FiTruck } from "react-icons/fi";

export default function ConfirmedStep({ orderId, navigate }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-12 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-[#e8f6ea] flex items-center justify-center mb-4">
        <FiCheck size={28} className="text-[#088178]" strokeWidth={2.5} />
      </div>

      <h2 className="text-xl font-black text-gray-900 mb-1">Order Confirmed!</h2>
      <p className="text-xs text-gray-400 mb-4">
        Thank you for your purchase. We'll send a confirmation to your email.
      </p>

      {orderId && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 mb-6">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Order ID</p>
          <p className="text-sm font-bold text-gray-800">{orderId}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-6">
        {[
          { icon: <FiPackage size={14} />, label: "Processing", sub: "Your order is confirmed" },
          { icon: <FiTruck size={14} />, label: "3–4 Working Days", sub: "Estimated delivery" },
        ].map(({ icon, label, sub }) => (
          <div
            key={label}
            className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex flex-col items-center text-center gap-1"
          >
            <span className="text-[#088178]">{icon}</span>
            <p className="text-[11px] font-semibold text-gray-700">{label}</p>
            <p className="text-[10px] text-gray-400">{sub}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/")}
        className="bg-gray-900 text-white text-sm font-semibold px-8 py-3 rounded-full hover:bg-[#088178] transition-colors"
      >
        Continue Shopping
      </button>
    </div>
  );
}