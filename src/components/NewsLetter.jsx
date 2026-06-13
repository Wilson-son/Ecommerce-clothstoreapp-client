import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubscribeMutation } from "../redux/api/newsletterApiSlice";
import { FiCheckCircle, FiAlertCircle, FiLoader } from "react-icons/fi";

const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required.")
    .email("Please enter a valid email address."),
});

// status: "idle" | "loading" | "success" | "error" | "duplicate"
export default function Newsletter() {
  const [subscribe] = useSubscribeMutation();
  const [uiStatus, setUiStatus] = useState("idle");
  const [serverMsg, setServerMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async ({ email }) => {
    setUiStatus("loading");
    setServerMsg("");

    try {
      const res = await subscribe(email.trim().toLowerCase()).unwrap();
      console.log(" Subscribe response:", res); 
      setUiStatus("success");
      reset();

      // auto-reset after 6s
      setTimeout(() => setUiStatus("idle"), 6000);
    } catch (err) {
      console.error("❌ Subscribe error:", err); // check what error looks like
      const msg = err?.data?.message || "";

      // detect "already subscribed" from your backend message
      if (
        msg.toLowerCase().includes("already") ||
        msg.toLowerCase().includes("exist")
      ) {
        setUiStatus("duplicate");
        setServerMsg(msg);
      } else {
        setUiStatus("error");
        setServerMsg(msg || "Something went wrong. Please try again.");
      }

      setTimeout(() => setUiStatus("idle"), 6000);
    }
  };

  const isLoading = uiStatus === "loading";

  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">
        Newsletter
      </h3>
      <p className="text-[13.5px] text-gray-500 mb-4 leading-relaxed">
        Get email updates about our latest shop and{" "}
        <span className="text-[#008073] font-semibold cursor-pointer hover:underline">
          special offers.
        </span>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full">
        <div className="flex items-center gap-2">
          <input
            type="email"
            placeholder="Your email address"
            disabled={isLoading}
            {...register("email")}
            aria-label="Email address"
            className={`flex-1 h-[44px] px-4 text-sm text-gray-800 bg-white border rounded outline-none transition-colors placeholder-gray-400
              disabled:opacity-70 disabled:cursor-not-allowed focus:border-[#008073]
              ${errors.email ? "border-red-300" : "border-gray-300"}`}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="h-[44px] px-5 bg-[#008073] hover:bg-[#00665c] text-white text-sm font-semibold rounded transition-colors duration-200 disabled:opacity-75 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center gap-2 flex-shrink-0 min-w-[120px]"
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full animate-spin border-2 border-white/30 border-t-white" />
                Subscribing...
              </>
            ) : (
              "Subscribe"
            )}
          </button>
        </div>

      
        {errors.email && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-200">
            <FiAlertCircle className="text-red-500 w-3.5 h-3.5 flex-shrink-0" />
            <p className="text-xs text-red-600 font-medium">
              {errors.email.message}
            </p>
          </div>
        )}

      
        {uiStatus === "success" && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
            <FiCheckCircle className="text-emerald-500 w-3.5 h-3.5 flex-shrink-0" />
            <p className="text-xs text-emerald-700 font-semibold">
              You're subscribed! Thanks for joining.
            </p>
          </div>
        )}

     
        {uiStatus === "duplicate" && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
            <FiAlertCircle className="text-amber-500 w-3.5 h-3.5 flex-shrink-0" />
            <p className="text-xs text-amber-700 font-medium">
              {serverMsg || "This email is already subscribed."}
            </p>
          </div>
        )}

       
        {uiStatus === "error" && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-200">
            <FiAlertCircle className="text-red-500 w-3.5 h-3.5 flex-shrink-0" />
            <p className="text-xs text-red-600 font-medium">{serverMsg}</p>
          </div>
        )}
      </form>
    </div>
  );
}