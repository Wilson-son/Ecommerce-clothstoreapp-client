import { useState } from "react";
import { FiAlertCircle } from "react-icons/fi";

export default function Field({ label, icon, error, ...props }) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      {label && (
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
          {label}
        </label>
      )}
      <div
        className="flex items-center gap-2 border rounded-xl px-3 py-2.5 transition-all duration-200"
        style={{
          borderColor: error ? "#fca5a5" : focused ? "#111" : "#e5e7eb",
          background: error ? "#fff8f8" : "#fff",
        }}
      >
        {icon && <span className="text-gray-400 flex-shrink-0">{icon}</span>}
        <input
          {...props}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
          className="flex-1 text-sm outline-none bg-transparent placeholder-gray-300 text-gray-900"
        />
      </div>
      {error && (
        <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
          <FiAlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}