// src/pages/auth/ForgotPassword.jsx
import { useState, useEffect } from "react";
import { Mail, ArrowLeft, CheckCircle, Loader2, RefreshCw } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPasswordThunk,
  clearMessages,
} from "../../redux/slices/authSlice";

import bglogo from "../../assets/bglogo.png";

// Fix 1 — schema outside component
const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export default function ForgotPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [submittedEmail, setSubmittedEmail] = useState("");

  // Fix 4 — use `success` not `message` (matches your authSlice)
  const { loading, error, success } = useSelector((state) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setSubmittedEmail(data.email);
    await dispatch(forgotPasswordThunk(data));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: `url('${bglogo}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/*  Fix 2 — removed nested duplicate card div */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="bg-white/2 backdrop-blur-3xl border border-white/2 rounded-[24px] p-9 w-full max-w-[380px] shadow-xl"
      >
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[13px] text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <h1 className="text-[22px] font-bold text-gray-900 text-center mb-2">
          Forgot Password
        </h1>
        <p className="text-[13px] text-gray-500 text-center mb-6">
          Enter your email and we'll send you a reset link
        </p>

        {/* Fix 3 — success state shows message, hides form */}
        {success ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-[52px] h-[52px] bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>

            <p className="text-[14px] font-semibold text-gray-800 text-center">
              Reset link sent!
            </p>

            <p className="text-[13px] text-gray-500 text-center">
              We've sent a reset link to <strong>{submittedEmail}</strong>.
            </p>

            <button
              type="button"
              onClick={() =>
                dispatch(
                  forgotPasswordThunk({
                    email: submittedEmail,
                  }),
                )
              }
              className="mt-3 flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              <RefreshCw className="w-4 h-4" />
              Resend Reset Link
            </button>

            <Link
              to="/login"
              className="text-[13px] text-gray-900 font-semibold hover:underline mt-2"
            >
              Back to login →
            </Link>
          </div>
        ) : (
          <>
            {/* API error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] rounded-[10px] px-4 py-2.5 mb-4 text-center">
                {error}
              </div>
            )}

            {/* Email field */}
            <div
              className={`flex items-center gap-2.5 bg-[#f2f4f6] border rounded-[12px] px-3.5 h-12 mb-1 transition-all focus-within:bg-white ${
                errors.email
                  ? "border-red-400"
                  : "border-gray-200 focus-within:border-gray-400"
              }`}
            >
              <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                {...register("email")}
                type="email"
                placeholder="Email"
                className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-[11px] mb-3 ml-1">
                {errors.email.message}
              </p>
            )}

            {/* Fix 2 — single className, type="submit" */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gray-900 hover:bg-gray-800 disabled:opacity-60 active:scale-[0.98] text-white rounded-[12px] font-semibold text-[15px] transition-all mt-3 mb-5 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                </>
              ) : (
                "Send Reset Link"
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
          </>
        )}
      </form>
    </div>
  );
}
