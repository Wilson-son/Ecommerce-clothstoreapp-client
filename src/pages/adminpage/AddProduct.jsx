import React, { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDropzone } from "react-dropzone";
import { FiX, FiUpload, FiCheck, FiChevronDown, FiAlertCircle } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { categories } from "./adminData";
import { useCreateProductMutation, useUploadImageMutation } from "../../redux/api/productApiSlice";

// ── Zod schema — mirrors the Product mongoose model exactly ──────────────────
// color is { name, hex } — single object, not array
const productSchema = z.object({
  name:          z.string().min(3, "Product name is required"),
  brand:         z.string().min(2, "Brand name is required"),
  description:   z.string().min(5, "Description is required"),
  category:      z.string().min(1, "Please select a category"),
  gender:        z.string().min(1, "Please select a gender"),
  colorName:     z.string().min(1, "Color name is required"),
  colorHex:      z.string().min(1, "Hex code is required").regex(/^#[0-9A-Fa-f]{3,6}$/, "Must be a valid hex e.g. #FF0000"),
  sizes:         z.string().min(1, "Please specify sizes"),
  price:         z.number({ invalid_type_error: "Price must be a number" }).positive(),
  discountPrice: z.number({ invalid_type_error: "Must be a number" }).nonnegative().optional().or(z.literal("")),
  stock:         z.number({ invalid_type_error: "Stock must be a number" }).int().nonnegative(),
  rating:        z.number().min(1).max(5).default(4),
  image:         z.string().min(1, "Product image is required"),
});

export default function AddProduct({ onClose }) {
  const [imgPreview, setImgPreview] = useState(null);
  const [imageFile,  setImageFile]  = useState(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [createProduct, { isLoading }]     = useCreateProductMutation();
  const [uploadImage,   { isLoading: isUploading }] = useUploadImageMutation();

  const {
    register, handleSubmit, control, setValue, watch, reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "", brand: "", description: "",
      category: categories[0] || "Kurtas",
      gender: "",
      colorName: "", colorHex: "#000000",
      sizes: "", price: "", discountPrice: "",
      stock: "", rating: 4, image: "",
    },
  });

  const currentCategory = watch("category");
  const currentRating   = watch("rating");

  // ── Dropzone ──────────────────────────────────────────────────────────────
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (files) => {
      const file = files[0];
      if (!file) return;
      setImageFile(file);
      setImgPreview(URL.createObjectURL(file));
      setValue("image", "selected", { shouldValidate: true });
    },
  });

  useEffect(() => {
    return () => { if (imgPreview?.startsWith("blob:")) URL.revokeObjectURL(imgPreview); };
  }, [imgPreview]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsCategoryOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Submit ────────────────────────────────────────────────────────────────
  const onSubmit = async (data) => {
    try {
      let images = [];
      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        const res = await uploadImage(fd).unwrap();
        images = [{ url: res.imageUrl, public_id: res.public_id }];
      }

      await createProduct({
        name:          data.name,
        brand:         data.brand,
        description:   data.description,
        category:      data.category,
        gender:        data.gender,
        // model expects: color: { name, hex }
        color:         { name: data.colorName, hex: data.colorHex },
        sizes:         data.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        price:         data.price,
        discountPrice: data.discountPrice || 0,
        stock:         data.stock,
        rating:        data.rating,
        images,
      }).unwrap();

      alert("Product created successfully!");
      reset();
      setImageFile(null);
      setImgPreview(null);
      onClose();
    } catch (err) {
      console.error(err);
      alert(err?.data?.message || "Failed to create product");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-800">Add New Product</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
            <FiX size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto p-6 space-y-4 flex-1">

          {/* Image dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
              isDragActive ? "border-teal-500 bg-teal-50/30"
              : errors.image ? "border-rose-300 bg-rose-50/20"
              : "border-slate-200 bg-slate-50 hover:bg-slate-100/70"
            }`}
          >
            <input {...getInputProps()} />
            {imgPreview ? (
              <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                <img src={imgPreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="text-center py-2">
                <FiUpload size={16} className="text-teal-600 mx-auto mb-1" />
                <p className="text-xs font-medium text-slate-600">Upload Image</p>
              </div>
            )}
          </div>
          {errors.image && <p className="text-xs text-rose-600 flex items-center gap-1"><FiAlertCircle />{errors.image.message}</p>}

          <div className="grid grid-cols-2 gap-4">

            {/* Name */}
            <div className="col-span-2">
              <input {...register("name")} placeholder="Product Name"
                className={`w-full px-3.5 py-2 border rounded-lg text-sm outline-none transition-all ${errors.name ? "border-rose-300 focus:border-rose-500" : "border-slate-200 focus:border-teal-500"}`} />
              {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name.message}</p>}
            </div>

            {/* Description */}
            <div className="col-span-2">
              <textarea {...register("description")} placeholder="Description" rows={2}
                className={`w-full px-3.5 py-2 border rounded-lg text-sm outline-none resize-none transition-all ${errors.description ? "border-rose-300 focus:border-rose-500" : "border-slate-200 focus:border-teal-500"}`} />
              {errors.description && <p className="text-xs text-rose-600 mt-1">{errors.description.message}</p>}
            </div>

            {/* Brand */}
            <div>
              <input {...register("brand")} placeholder="Brand"
                className={`w-full px-3.5 py-2 border rounded-lg text-sm outline-none transition-all ${errors.brand ? "border-rose-300 focus:border-rose-500" : "border-slate-200 focus:border-teal-500"}`} />
              {errors.brand && <p className="text-xs text-rose-600 mt-1">{errors.brand.message}</p>}
            </div>

            {/* Category dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button type="button" onClick={() => setIsCategoryOpen((p) => !p)}
                className="w-full px-3.5 py-2 border border-slate-200 bg-white text-slate-800 text-sm rounded-lg flex items-center justify-between">
                <span>{currentCategory || "Select Category"}</span>
                <FiChevronDown className={`transition-transform duration-200 ${isCategoryOpen ? "rotate-180" : ""}`} />
              </button>
              {isCategoryOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 p-2 max-h-48 overflow-y-auto">
                  {categories.map((cat) => (
                    <button key={cat} type="button"
                      onClick={() => { setValue("category", cat, { shouldValidate: true }); setIsCategoryOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${currentCategory === cat ? "bg-teal-100 text-teal-700" : "hover:bg-slate-100 text-slate-700"}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Gender */}
            <div>
              <select {...register("gender")} defaultValue=""
                className={`w-full px-3.5 py-2 border bg-white text-slate-800 text-sm rounded-lg outline-none ${errors.gender ? "border-rose-300" : "border-slate-200 focus:border-teal-500"}`}>
                <option value="" disabled>Select Gender</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
                <option value="Kids">Kids</option>
              </select>
              {errors.gender && <p className="text-xs text-rose-600 mt-1">{errors.gender.message}</p>}
            </div>

            {/* Color name */}
            <div>
              <input {...register("colorName")} placeholder="Color name (e.g. Navy)"
                className={`w-full px-3.5 py-2 border rounded-lg text-sm outline-none transition-all ${errors.colorName ? "border-rose-300 focus:border-rose-500" : "border-slate-200 focus:border-teal-500"}`} />
              {errors.colorName && <p className="text-xs text-rose-600 mt-1">{errors.colorName.message}</p>}
            </div>

            {/* Color hex — Controller keeps picker + text in sync */}
            <div>
              <Controller
                name="colorHex"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    {/* Native color picker — updates the text field on change */}
                    <input
                      type="color"
                      value={field.value || "#000000"}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white flex-shrink-0"
                    />
                    {/* Text input — also updates the picker via shared field.value */}
                    <input
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                      placeholder="#000000"
                      className={`flex-1 px-3.5 py-2 border rounded-lg text-sm outline-none transition-all ${
                        errors.colorHex ? "border-rose-300 focus:border-rose-500" : "border-slate-200 focus:border-teal-500"
                      }`}
                    />
                  </div>
                )}
              />
              {errors.colorHex && <p className="text-xs text-rose-600 mt-1">{errors.colorHex.message}</p>}
            </div>

            {/* Sizes */}
            <div className="col-span-2">
              <input {...register("sizes")} placeholder="Sizes (e.g. S, M, L, XL)"
                className={`w-full px-3.5 py-2 border rounded-lg text-sm outline-none transition-all ${errors.sizes ? "border-rose-300 focus:border-rose-500" : "border-slate-200 focus:border-teal-500"}`} />
              {errors.sizes && <p className="text-xs text-rose-600 mt-1">{errors.sizes.message}</p>}
            </div>

            {/* Price */}
            <div>
              <input type="number" step="any" placeholder="Price (₹)" {...register("price", { valueAsNumber: true })}
                className={`w-full px-3.5 py-2 border rounded-lg text-sm outline-none transition-all ${errors.price ? "border-rose-300 focus:border-rose-500" : "border-slate-200 focus:border-teal-500"}`} />
              {errors.price && <p className="text-xs text-rose-600 mt-1">{errors.price.message}</p>}
            </div>

            {/* Discount price */}
            <div>
              <input type="number" step="any" placeholder="Discount Price (₹)" {...register("discountPrice", { valueAsNumber: true })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-teal-500" />
            </div>

            {/* Stock */}
            <div className="col-span-2">
              <input type="number" placeholder="Stock Units" {...register("stock", { valueAsNumber: true })}
                className={`w-full px-3.5 py-2 border rounded-lg text-sm outline-none transition-all ${errors.stock ? "border-rose-300 focus:border-rose-500" : "border-slate-200 focus:border-teal-500"}`} />
              {errors.stock && <p className="text-xs text-rose-600 mt-1">{errors.stock.message}</p>}
            </div>

            {/* Rating */}
            <div className="col-span-2 flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg w-max">
              <Controller name="rating" control={control} render={({ field }) => (
                <>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => field.onChange(s)} className="hover:scale-105 transition-transform">
                      <FaStar size={16} className={s <= currentRating ? "text-amber-400" : "text-slate-200"} />
                    </button>
                  ))}
                </>
              )} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose}
              className="flex-1 border border-slate-200 text-slate-600 font-medium rounded-lg py-2 text-xs hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isLoading || isUploading}
              className="flex-1 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-2 text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors">
              <FiCheck size={14} />
              {isUploading ? "Uploading…" : isLoading ? "Creating…" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}