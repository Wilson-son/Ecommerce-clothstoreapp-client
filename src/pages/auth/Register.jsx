// src/pages/auth/Register.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, User, UserPlus, Loader2 } from "lucide-react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { registerThunk } from "../../redux/slices/authSlice";

import bglogo from "../../assets/bglogo.png";

const registerSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),

    email: z.string().email("Enter a valid email address"),

    password: z.string().min(6, "Password must be at least 6 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data) => {
    const { confirmPassword, ...payload } = data; // don't send confirmPassword to API
    const res = await dispatch(registerThunk(payload));
      if (registerThunk.fulfilled.match(result)) {
      navigate("/verify-email", {
        state: { email: payload.email },
      });
    }
  };

  const fieldCls = (hasErr) =>
    `flex items-center gap-2.5 bg-[#f2f4f6] border rounded-[12px] px-3.5 h-12 mb-3 transition-all focus-within:bg-white ${
      hasErr ? "border-red-400" : "border-gray-200 focus-within:border-gray-400"
    }`;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        background: `url('${bglogo}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="bg-white/2 backdrop-blur-3xl border border-white/2 rounded-[24px] p-9 w-full max-w-[380px] shadow-xl"
      >
        {/* Icon */}
        <div className="w-[52px] h-[52px] bg-white rounded-[14px] shadow-md flex items-center justify-center mx-auto mb-5">
          <UserPlus className="w-6 h-6 text-gray-800" />
        </div>

        <h1 className="text-[22px] font-bold text-gray-900 text-center mb-2">
          Create an account
        </h1>
        <p className="text-[13px] text-gray-500 text-center leading-relaxed mb-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-gray-900 font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>

        {/* API error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] rounded-[10px] px-4 py-2.5 mb-4 text-center">
            {error}
          </div>
        )}

        {/* Username */}
        <div className={fieldCls(!!errors.username)}>
          <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            {...register("username")}
            type="text"
            placeholder="Username"
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"
          />
        </div>
        {errors.username && (
          <p className="text-red-500 text-[11px] mb-2 ml-1">
            {errors.username.message}
          </p>
        )}

        {/* Email */}
        <div className={fieldCls(!!errors.email)}>
          <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-[11px] mb-2 ml-1">
            {errors.email.message}
          </p>
        )}

        {/* Password */}
        <div className={fieldCls(!!errors.password)}>
          <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            {...register("password")}
            type={showPw ? "text" : "password"}
            placeholder="Password"
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="text-gray-400 hover:text-gray-600"
          >
            {showPw ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-[11px] mb-2 ml-1">
            {errors.password.message}
          </p>
        )}

        {/* Fix 2 — Confirm Password uses its own showConfirm state */}
        <div className={fieldCls(!!errors.confirmPassword)}>
          <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            {...register("confirmPassword")}
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="text-gray-400 hover:text-gray-600"
          >
            {showConfirm ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-[11px] mb-2 ml-1">
            {errors.confirmPassword.message}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-gray-900 hover:bg-gray-800 disabled:opacity-60 active:scale-[0.98] text-white rounded-[12px] font-semibold text-[15px] transition-all mt-4 mb-5 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Creating account...
            </>
          ) : (
            "Get Started"
          )}
        </button>

        
      </form>
    </div>
  );
}
