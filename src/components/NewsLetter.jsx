// src/components/Newsletter.jsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import {
  subscribeNewsletter,
  resetNewsletter,
} from "../redux/slices/newsletterSlice";

import newsletterBg from "../assets/newsletterbg.png";

// ── Zod schema ──────────────────────────────────────────────
const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required.")
    .email("Please enter a valid email address."),
});

// ── Component ────────────────────────────────────────────────
export default function Newsletter() {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.newsletter);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
    if (status === "succeeded") {
      reset();
    }
  }, [status, reset]);

  const onSubmit = ({ email }) => {
    dispatch(subscribeNewsletter(email));
  };

  return (
    <section
  className="relative  overflow-hidden py-12"
  style={{
    backgroundImage: `url(${newsletterBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>

  <div className="max-w-6xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-8">
    {/* Left — heading + subtext */}
    <div className="flex-1">
      <h2 className="text-white text-2xl md:text-[28px] font-bold font-serif mb-2 leading-tight">
        Sign Up For Newsletters
      </h2>

      <p className="text-sm text-blue-200">
        Get E-mail updates about our latest shop and{" "}
        <span className="font-medium text-[#e8b84b]">
          special offers.
        </span>
      </p>
    </div>

    {/* Right — form */}
    <div className="flex-1 w-full max-w-lg">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex h-[52px] rounded overflow-hidden shadow-lg">
          <input
            type="email"
            placeholder="Your email address"
            disabled={status === "loading"}
            {...register("email")}
            aria-label="Email address"
            className={`flex-1 min-w-0 px-5 text-sm text-gray-800 outline-none placeholder-gray-400
              disabled:opacity-70 disabled:cursor-not-allowed
              ${
                errors.email
                  ? "bg-red-50"
                  : "bg-white focus:bg-gray-50"
              }
              transition-colors duration-150`}
          />

          <button
            type="submit"
            disabled={status === "loading"}
            className="flex-shrink-0 min-w-[110px] px-7 text-sm font-bold tracking-wide
              flex items-center justify-center
              hover:brightness-90 active:scale-95
              transition-all duration-200
              disabled:opacity-75 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "#e8b84b",
              color: "#1a2744",
            }}
          >
            {status === "loading" ? (
              <span
                className="w-[18px] h-[18px] rounded-full animate-spin border-2"
                style={{
                  borderColor: "rgba(26,39,68,0.25)",
                  borderTopColor: "#1a2744",
                }}
                aria-label="Loading"
              />
            ) : (
              "Sign Up"
            )}
          </button>
        </div>

        {errors.email && (
          <p className="mt-1.5 text-xs text-red-400 pl-1" role="alert">
            {errors.email.message}
          </p>
        )}

        {status === "failed" && error && (
          <p className="mt-1.5 text-xs text-red-400 pl-1" role="alert">
            {error}
          </p>
        )}

        {status === "succeeded" && (
          <p
            className="mt-1.5 text-xs text-teal-300 font-medium pl-1"
            role="status"
          >
            ✓ You've successfully subscribed!
          </p>
        )}
      </form>
    </div>
  </div>
</section>
  );
}
