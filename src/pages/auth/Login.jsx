import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from "lucide-react";

import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import {
  loginThunk,
  loadUserThunk,
  clearMessages,
} from "../../redux/slices/authSlice";

import bglogo from "../../assets/bglogo.png";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const dispatch = useDispatch();
  const nav = useNavigate();

  const [showPw, setShowPw] = useState(false);

  const { loading, error, success } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

 useEffect(() => {
  return () => dispatch(clearMessages());
}, [dispatch]);

  const onSubmit = async (data) => {
    const result = await dispatch(loginThunk(data));
    console.log("Login Result:", result);

    if (loginThunk.fulfilled.match(result)) {
      console.log("Login Success");
      

   

      setTimeout(() => {
        dispatch(clearMessages());
        nav("/");
      }, 1500);
    }
  };

  const fieldClass = (hasError) =>
    `flex items-center gap-2.5 bg-[#f2f4f6] border rounded-[12px] px-3.5 h-12 mb-3 transition-all focus-within:bg-white ${
      hasError
        ? "border-red-400 focus-within:border-red-400"
        : "border-gray-200 focus-within:border-gray-400"
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
        {/* Icon */}
        <div className="w-[52px] h-[52px] bg-white rounded-[14px] shadow-md flex items-center justify-center mx-auto mb-5">
          <LogIn className="w-6 h-6 text-gray-800" />
        </div>

        {/* Title */}
        <h1 className="text-[22px] font-bold text-gray-900 text-center mb-2">
          Sign in with email
        </h1>
        <p className="text-[13px] text-gray-500 text-center leading-relaxed mb-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-gray-900 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>

        {/* Global API error */}
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

        {/* ── Email ── */}
        <div className={fieldClass(!!errors.email)}>
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

        {/* ── Password ── */}
        <div className={fieldClass(!!errors.password)}>
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
            className="text-gray-400 hover:text-gray-600 transition-colors"
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

        {/* Forgot password */}
        <div className="text-right mb-4 mt-1">
          <Link
            to="/forgot-password"
            className="text-[13px] text-gray-700 hover:text-gray-900 hover:underline transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-gray-900 hover:bg-gray-800 disabled:opacity-60 active:scale-[0.98] text-white rounded-[12px] font-semibold text-[15px] transition-all mb-5 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Get Started"
          )}
        </button>
      </form>
    </div>
  );
}
