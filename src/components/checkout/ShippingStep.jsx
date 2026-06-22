import { FiMapPin, FiUser, FiPhone, FiChevronRight } from "react-icons/fi";
import Field from "./Field";

export default function ShippingStep({ form, onChange, errors, onNext }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center gap-2">
        <FiMapPin size={15} className="text-[#088178]" />
        <h2 className="text-sm font-bold text-gray-900">Shipping Details</h2>
      </div>

      <div className="px-6 py-5 space-y-4">
        <Field
          label="Full Name"
          icon={<FiUser size={14} />}
          placeholder="Rahul Sharma"
          value={form.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
          error={errors.fullName}
        />
        <Field
          label="Phone Number"
          icon={<FiPhone size={14} />}
          placeholder="9876543210"
          type="tel"
          maxLength={10}
          value={form.phone}
          onChange={(e) => onChange("phone", e.target.value.replace(/\D/g, ""))}
          error={errors.phone}
        />
        <Field
          label="Address"
          icon={<FiMapPin size={14} />}
          placeholder="House / Flat no., Street, Area"
          value={form.address}
          onChange={(e) => onChange("address", e.target.value)}
          error={errors.address}
        />
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="City"
            placeholder="District"
            value={form.city}
            onChange={(e) => onChange("city", e.target.value)}
            error={errors.city}
          />
          <Field
            label="PIN Code"
            placeholder="741801"
            type="text"
            maxLength={6}
            value={form.pincode}
            onChange={(e) => onChange("pincode", e.target.value.replace(/\D/g, ""))}
            error={errors.pincode}
          />
        </div>
        <Field
          label="State"
          placeholder="State"
          value={form.state}
          onChange={(e) => onChange("state", e.target.value)}
          error={errors.state}
        />
      </div>

      <div className="px-6 pb-6">
        <button
          onClick={onNext}
          className="w-full bg-gray-900 text-white py-3.5 rounded-full text-sm font-bold hover:bg-[#088178] transition-colors duration-200 flex items-center justify-center gap-2"
        >
          Continue to Payment <FiChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}