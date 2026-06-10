import React, { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDropzone } from "react-dropzone";
import {
  FiX,
  FiUpload,
  FiCheck,
  FiChevronDown,
  FiAlertCircle,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { categories } from "./adminData";

import { useUpdateProductMutation } from "../../redux/api/productApiSlice";
import { useUploadImageMutation } from "../../redux/api/productApiSlice";

// Zod Validation Schema matching the extended product model
const productSchema = z.object({
  name: z.string().min(3, "Product name is required"),
  brand: z.string().min(2, "Brand name is required"),
  description: z.string().min(5, "Description is required"),
  category: z.string().min(1, "Please select a category"),
  gender: z.string().min(1, "Please select a gender"),
  colors: z.string().min(1, "Please specify colors"),
  sizes: z.string().min(1, "Please specify sizes"),
  price: z.number({ invalid_type_error: "Price must be a number" }).positive(),
  discountPrice: z
    .number({ invalid_type_error: "Discount price must be a number" })
    .nonnegative()
    .optional()
    .or(z.literal("")),
  stock: z
    .number({ invalid_type_error: "Stock must be a number" })
    .int()
    .nonnegative(),
  rating: z.number().min(1).max(5).default(4),
  image: z.string().min(1, "Product image is required"),
});

export default function EditProduct({ product, onClose }) {
  const [imgPreview, setImgPreview] = useState(product?.image || null);
  const [imageFile, setImageFile] = useState(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const dropdownRef = useRef(null);

  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      brand: product?.brand || "",
      description: product?.description || "",
      category: product?.category || categories[0] || "Kurtas",
      gender: product?.gender || "",
      colors: product?.colors || "",
      sizes: product?.sizes || "",
      price: product?.price || "",
      discountPrice: product?.discountPrice || "",
      stock: product?.stock || "",
      rating: product?.rating || 4,
      image: product?.image || "",
    },
  });

  const currentCategory = watch("category");
  const currentRating = watch("rating");

  // Sync form values if product prop dynamically changes
  useEffect(() => {
    if (product) {
      reset(product);
      setImgPreview(product.image);
    }
  }, [product, reset]);

  // React Dropzone integration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setImageFile(file);

      const blobUrl = URL.createObjectURL(file);
      setImgPreview(blobUrl);

      // Mark image as validated since a new file is staged
      setValue("image", "selected", {
        shouldValidate: true,
      });
    },
  });

  useEffect(() => {
    return () => {
      if (typeof imgPreview === "string" && imgPreview.startsWith("blob:")) {
        URL.revokeObjectURL(imgPreview);
      }
    };
  }, [imgPreview]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onSubmit = async (data) => {
    try {
      let imageUrl = product?.image || "";

      // If a brand new file was chosen, upload it first
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const res = await uploadImage(formData).unwrap();
        imageUrl = res.imageUrl;
      }

      await updateProduct({
        id: product._id,
        data: {
          ...data,
          image: imageUrl,
        },
      }).unwrap();

      alert("Product updated successfully!");
      onClose();
    } catch (err) {
      console.error("Product update failed:", err);
      alert("Update failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-800">Edit Product</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* SCROLLABLE FORM BODY */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-y-auto p-6 space-y-4 flex-1"
        >
          {/* IMAGE DROPZONE */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
              isDragActive
                ? "border-teal-500 bg-teal-50/30"
                : errors.image
                  ? "border-rose-300 bg-rose-50/20"
                  : "border-slate-200 bg-slate-50 hover:bg-slate-100/70"
            }`}
          >
            <input {...getInputProps()} />
            {imgPreview ? (
              <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 bg-white">
                <img
                  src={imgPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="text-center py-2">
                <FiUpload size={16} className="text-teal-600 mx-auto mb-1" />
                <p className="text-xs font-medium text-slate-600">
                  Upload Image
                </p>
              </div>
            )}
          </div>
          {errors.image && (
            <p className="text-xs text-rose-600 flex items-center gap-1">
              <FiAlertCircle /> {errors.image.message}
            </p>
          )}

          {/* FIELDS GRID */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <input
                {...register("name")}
                placeholder="Product Name"
                className={`w-full px-3.5 py-2 border rounded-lg text-sm outline-none transition-all ${
                  errors.name
                    ? "border-rose-300 focus:border-rose-500"
                    : "border-slate-200 focus:border-teal-500"
                }`}
              />
              {errors.name && (
                <p className="text-xs text-rose-600 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <textarea
                {...register("description")}
                placeholder="Description"
                rows={2}
                className={`w-full px-3.5 py-2 border rounded-lg text-sm outline-none transition-all resize-none ${
                  errors.description
                    ? "border-rose-300 focus:border-rose-500"
                    : "border-slate-200 focus:border-teal-500"
                }`}
              />
              {errors.description && (
                <p className="text-xs text-rose-600 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register("brand")}
                placeholder="Brand"
                className={`w-full px-3.5 py-2 border rounded-lg text-sm outline-none transition-all ${
                  errors.brand
                    ? "border-rose-300 focus:border-rose-500"
                    : "border-slate-200 focus:border-teal-500"
                }`}
              />
              {errors.brand && (
                <p className="text-xs text-rose-600 mt-1">
                  {errors.brand.message}
                </p>
              )}
            </div>

            <div className="relative " ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsCategoryOpen((prev) => !prev)}
                className="w-full px-3.5 py-2 border border-slate-200 bg-white text-slate-800 text-sm rounded-lg flex items-center justify-between"
              >
                <span>{currentCategory || "Select Category"}</span>
                <FiChevronDown
                  className={`transition-transform duration-200 ${
                    isCategoryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isCategoryOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 p-2">
                  <div className="flex flex-col gap-1">
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => {
                          setValue("category", category, {
                            shouldValidate: true,
                          });
                          setIsCategoryOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          currentCategory === category
                            ? "bg-teal-100 text-teal-700"
                            : "hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <select
                {...register("gender")}
                className="w-full px-3.5 py-2 border border-slate-200 bg-white text-slate-800 text-sm rounded-lg outline-none"
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
                <option value="Kids">Kids</option>
              </select>
            </div>

            <div>
              <input
                {...register("colors")}
                placeholder="Colors (e.g. Red, Blue)"
                className={`w-full px-3.5 py-2 border rounded-lg text-sm outline-none transition-all ${
                  errors.colors
                    ? "border-rose-300 focus:border-rose-500"
                    : "border-slate-200 focus:border-teal-500"
                }`}
              />
              {errors.colors && (
                <p className="text-xs text-rose-600 mt-1">
                  {errors.colors.message}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <input
                {...register("sizes")}
                placeholder="Sizes (e.g. S, M, L, XL)"
                className={`w-full px-3.5 py-2 border rounded-lg text-sm outline-none transition-all ${
                  errors.sizes
                    ? "border-rose-300 focus:border-rose-500"
                    : "border-slate-200 focus:border-teal-500"
                }`}
              />
              {errors.sizes && (
                <p className="text-xs text-rose-600 mt-1">
                  {errors.sizes.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="number"
                step="any"
                placeholder="Original Price"
                {...register("price", { valueAsNumber: true })}
                className={`w-full px-3.5 py-2 border rounded-lg text-sm outline-none transition-all ${
                  errors.price
                    ? "border-rose-300 focus:border-rose-500"
                    : "border-slate-200 focus:border-teal-500"
                }`}
              />
              {errors.price && (
                <p className="text-xs text-rose-600 mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="number"
                step="any"
                placeholder="Discount Price"
                {...register("discountPrice", { valueAsNumber: true })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-teal-500"
              />
            </div>

            <div className="col-span-2">
              <input
                type="number"
                placeholder="Stock Units"
                {...register("stock", { valueAsNumber: true })}
                className={`w-full px-3.5 py-2 border rounded-lg text-sm outline-none transition-all ${
                  errors.stock
                    ? "border-rose-300 focus:border-rose-500"
                    : "border-slate-200 focus:border-teal-500"
                }`}
              />
              {errors.stock && (
                <p className="text-xs text-rose-600 mt-1">
                  {errors.stock.message}
                </p>
              )}
            </div>

            {/* QUALITY RATING */}
            <div className="col-span-2 flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg w-max">
              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => field.onChange(s)}
                        className="hover:scale-105 transition-transform"
                      >
                        <FaStar
                          size={16}
                          className={
                            s <= currentRating
                              ? "text-amber-400"
                              : "text-slate-200"
                          }
                        />
                      </button>
                    ))}
                  </>
                )}
              />
            </div>
          </div>

          {/* ACTIONS BAR */}
          <div className="flex gap-3 pt-4 border-t border-slate-100 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 text-slate-600 font-medium rounded-lg py-2 text-xs hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || isUploading}
              className="flex-1 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-2 text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              <FiCheck size={14} />
              {isUploading
                ? "Uploading..."
                : isLoading
                  ? "Saving Updates..."
                  : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
