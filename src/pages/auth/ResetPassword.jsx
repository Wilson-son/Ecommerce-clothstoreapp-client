// src/pages/auth/ResetPassword.jsx

import { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import {
  resetPasswordThunk,
  clearMessages,
} from "../../redux/slices/authSlice";

import bglogo from "../../assets/bglogo.png";

const schema = z
  .object({
    password: z.string().min(6, "Minimum 6 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.auth);
  
  const { token } = useParams();
  console.log("TOKEN FROM URL:", token);

  useEffect(() => {
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    console.log("SUBMITTING:", { token, password: data.password });
    const res = await dispatch(
      resetPasswordThunk({ token, password: data.password }),
    );
    console.log("RES:", res);

    if (resetPasswordThunk.fulfilled.match(res)) {
      setTimeout(() => {
        dispatch(clearMessages());
        navigate("/login");
      }, 1000);
    }
  };

  const fieldCls = (hasErr) =>
    `flex items-center gap-2.5 bg-[#f2f4f6] border rounded-[12px] px-3.5 h-12 mb-1 transition-all focus-within:bg-white ${
      hasErr ? "border-red-400" : "border-gray-200 focus-within:border-gray-400"
    }`;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
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
        <h1 className="text-[22px] font-bold text-gray-900 text-center mb-2">
          Reset Password
        </h1>
        <p className="text-[13px] text-gray-500 text-center mb-6">
          Enter your new password below
        </p>

        {/* API error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] rounded-[10px] px-4 py-2.5 mb-4 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-[13px] rounded-[10px] px-4 py-2.5 mb-4 text-center">
            {success}
          </div>
        )}

        {/* New Password */}
        <div className={fieldCls(!!errors.password)}>
          <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            {...register("password")}
            type={showPw ? "text" : "password"}
            placeholder="New Password"
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

        {/* Confirm Password */}
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

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-gray-900 hover:bg-gray-800 disabled:opacity-60 active:scale-[0.98] text-white rounded-[12px] font-semibold text-[15px] transition-all mt-4 mb-5 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Updating...
            </>
          ) : (
            "Update Password"
          )}
        </button>

        <p className="text-center text-[13px] text-gray-500">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-gray-900 font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
