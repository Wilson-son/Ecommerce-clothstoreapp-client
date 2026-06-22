import React from "react";
import { FiMapPin, FiCreditCard, FiCheck } from "react-icons/fi";

const STEPS = [
  { id: 1, label: "Shipping", icon: <FiMapPin size={13} /> },
  { id: 2, label: "Payment", icon: <FiCreditCard size={13} /> },
  { id: 3, label: "Confirmed", icon: <FiCheck size={13} /> },
];

export default function Steps({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, i) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
              style={
                step.id < current
                  ? { background: "#088178", color: "#fff" }
                  : step.id === current
                  ? { background: "#111", color: "#fff" }
                  : { background: "#f3f4f6", color: "#9ca3af" }
              }
            >
              {step.id < current ? <FiCheck size={13} strokeWidth={3} /> : step.icon}
            </div>
            <span
              className="text-[10px] font-semibold hidden sm:block"
              style={{
                color:
                  step.id === current ? "#111" : step.id < current ? "#088178" : "#9ca3af",
              }}
            >
              {step.label}
            </span>
          </div>

          {i < STEPS.length - 1 && (
            <div
              className="flex-1 mx-2 h-0.5 rounded-full transition-all duration-500"
              style={{
                background: step.id < current ? "#088178" : "#e5e7eb",
                maxWidth: "80px",
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}