import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import {
  toggleCategory,
  toggleColor,
  toggleSize,
  setMaxPrice,
  clearAllFilters,
} from "../redux/slices/shopSlice";

import { selectHasActiveFilters } from "../redux/slices/shopSlice";


function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100 py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 mb-1"
      >
        {title}
        {open ? <FiChevronUp size={15} /> : <FiChevronDown size={15} />}
      </button>
      {open && <div className="mt-2 space-y-2">{children}</div>}
    </div>
  );
}

function CheckItem({ label, checked, onToggle }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-gray-800">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="accent-[#088178] w-3.5 h-3.5"
      />
      {label}
    </label>
  );
}

export default function FilterSidebar() {
  const dispatch = useDispatch();
  const { selectedCategories, selectedColors, selectedSizes, maxPrice } = useSelector(
    (state) => state.shop
  );
  const hasActive = useSelector(selectHasActiveFilters);

  return (
    <div className="w-52 shrink-0">
      <h2 className="text-base font-bold text-gray-800 mb-1">Filters</h2>

      <FilterSection title="Category">
        {["T-Shirts", "Shirts", "Shorts"].map((c) => (
          <CheckItem
            key={c}
            label={c}
            checked={selectedCategories.includes(c)}
            onToggle={() => dispatch(toggleCategory(c))}
          />
        ))}
      </FilterSection>

      <FilterSection title="Color">
        {["Yellow", "Green", "Red", "White", "Blue", "Grey", "Brown", "Black"].map((c) => (
          <CheckItem
            key={c}
            label={c}
            checked={selectedColors.includes(c)}
            onToggle={() => dispatch(toggleColor(c))}
          />
        ))}
      </FilterSection>

      <FilterSection title="Size">
        {["S", "M", "L", "XL"].map((s) => (
          <CheckItem
            key={s}
            label={s}
            checked={selectedSizes.includes(s)}
            onToggle={() => dispatch(toggleSize(s))}
          />
        ))}
      </FilterSection>

      <FilterSection title="Price">
        <input
          type="range"
          min={500}
          max={10000}
          step={100}
          value={maxPrice}
          onChange={(e) => dispatch(setMaxPrice(Number(e.target.value)))}
          className="accent-[#088178] w-full"
        />
        <span className="text-xs text-gray-500">Up to ₹{maxPrice.toLocaleString()}</span>
      </FilterSection>

      {hasActive && (
        <button
          onClick={() => dispatch(clearAllFilters())}
          className="mt-3 text-xs text-[#088178] underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}