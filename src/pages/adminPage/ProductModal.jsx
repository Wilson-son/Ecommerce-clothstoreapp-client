import React, { useState, useEffect } from "react";
import { FiX, FiUpload, FiCheck, FiChevronDown } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { categories } from "./adminData";

export default function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(
    product || {
      name: "",
      brand: "",
      category: "Kurtas",
      price: "",
      stock: "",
      rating: 4,
      image: "",
    }
  );

  const [imgPreview, setImgPreview] = useState(product?.image || null);

  // ✅ FIX: cleanup blob memory
  useEffect(() => {
    return () => {
      if (imgPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imgPreview);
      }
    };
  }, [imgPreview]);

  // ✅ FIX: number conversion
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]:
        name === "price" || name === "stock"
          ? Number(value)
          : value,
    });
  };

  // Image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImgPreview(url);

    setForm({
      ...form,
      image: url,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-7 relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700"
        >
          <FiX size={20} />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {product ? "Edit Product" : "Add New Product"}
        </h2>

        {/* Image Upload */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-20 h-20 rounded-2xl bg-[#f0f7f6] border-2 border-dashed border-[#b2d8d5] flex items-center justify-center overflow-hidden">
            {imgPreview ? (
              <img
                src={imgPreview}
                alt="preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <FiUpload size={22} className="text-[#01796F]" />
            )}
          </div>

          <label className="cursor-pointer bg-[#e8f6ea] border border-[#c8eacb] text-[#01796F] text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2">
            <FiUpload size={14} />
            Upload Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-4">

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="col-span-2 border rounded-xl px-3 py-2 text-sm"
          />

          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="Brand"
            className="border rounded-xl px-3 py-2 text-sm"
          />

          <div className="relative">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded-xl px-3 py-2 text-sm appearance-none"
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-3 text-gray-400" />
          </div>

          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="border rounded-xl px-3 py-2 text-sm"
          />

          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="border rounded-xl px-3 py-2 text-sm"
          />

          {/* Rating */}
          <div className="col-span-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setForm({ ...form, rating: s })}
              >
                <FaStar
                  size={20}
                  className={s <= form.rating ? "text-yellow-400" : "text-gray-200"}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-7">
          <button
            onClick={onClose}
            className="flex-1 border rounded-xl py-2 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={() => onSave(form)}
            className="flex-1 bg-[#01796F] text-white rounded-xl py-2 text-sm flex items-center justify-center gap-2"
          >
            <FiCheck size={15} />
            {product ? "Save Changes" : "Add Product"}
          </button>
        </div>

      </div>
    </div>
  );
}