import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../redux/slices/cartSlice";
import {
  useCreateRazorpayOrderMutation,
  useVerifyPaymentMutation,
} from "../redux/api/orderApiSlice";
import { FiArrowLeft } from "react-icons/fi";

import Steps from "../components/checkout/Steps";
import ShippingStep from "../components/checkout/ShippingStep";
import PaymentStep from "../components/checkout/PaymentStep";
import ConfirmedStep from "../components/checkout/ConfirmedStep";
import OrderSummary from "../components/checkout/OrderSummary";
import {
  validateShipping,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
} from "../components/checkout/CheckoutUtils";

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const appliedCoupon = useSelector(
    (state) => state.cart.appliedCoupon || null,
  );

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [errors, setErrors] = useState({});

  const [shippingForm, setShippingForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
  });

  // ── Totals ─────────────────────────────────────────────────────────────────
  const subtotal = cartItems.reduce(
    (sum, i) => sum + (i.price || 0) * (i.qty || 0),
    0,
  );
  const discount = appliedCoupon
    ? (subtotal * appliedCoupon.discount) / 100
    : 0;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal - discount + shipping;

  // Redirect to cart if empty (unless on confirmed step)
  useEffect(() => {
    if (cartItems.length === 0 && step !== 3) navigate("/cart");
  }, [cartItems, step, navigate]);

  const handleChange = (field, value) => {
    setShippingForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleNextStep = () => {
    const errs = validateShipping(shippingForm);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setStep(2);
  };

  // ── Razorpay payment handler ───────────────────────────────────────────────
  const handlePayment = async () => {
    try {
      setIsLoading(true);

      // 1. Create Razorpay order on backend
      const order = await createRazorpayOrder({ amount: total }).unwrap();

      // 2. Map cartItems → orderItemSchema shape
      const orderItems = cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        image: item.image,
        qty: item.qty,
        price: item.price,
        size: item.size || "M",
        color:
          typeof item.color === "object"
            ? item.color
            : { name: item.color || "", hex: "" },
      }));

      console.log("Razorpay Key:", import.meta.env.VITE_RAZORPAY_KEY_ID);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Cloth Store",
        description: "Order Payment",
        prefill: {
          name: shippingForm.fullName,
          contact: shippingForm.phone,
        },
        handler: async (response) => {
          try {
            // 3. Verify payment + save order
            const result = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: {
                items: orderItems,
                shippingAddress: shippingForm,
                total,
                itemsPrice: subtotal,
                shippingPrice: shipping,
              },
            }).unwrap();

            setOrderId(result.order?.razorpayOrderId || order.id);
            dispatch(clearCart());
            setStep(3);
          } catch (err) {
            console.error("Verification failed:", err);
            alert("Payment verification failed. Please contact support.");
          }
        },
        theme: { color: "#088178" },
      };

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded. Add the script tag to index.html.");
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp) => {
        alert(`Payment failed: ${resp.error.description}`);
      });
      rzp.open();
    } catch (error) {
      console.error("Order creation failed:", error);
      alert("Could not initiate payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 hover:text-gray-700 transition-colors"
          >
            <FiArrowLeft size={12} /> Home
          </button>
          <span>›</span>
          <button
            onClick={() => navigate("/cart")}
            className="hover:text-gray-700 transition-colors"
          >
            Cart
          </button>
          <span>›</span>
          <span className="text-gray-600 font-medium">Checkout</span>
        </div>

        {/* Title + Steps */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight text-center mb-1">
            Checkout
          </h1>
          <Steps current={step} />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* LEFT: Active step */}
          <div className="flex-1 min-w-0">
            {step === 1 && (
              <ShippingStep
                form={shippingForm}
                onChange={handleChange}
                errors={errors}
                onNext={handleNextStep}
              />
            )}
            {step === 2 && (
              <PaymentStep
                shippingForm={shippingForm}
                total={total}
                onSuccess={handlePayment}
                onBack={() => setStep(1)}
                isLoading={isLoading}
              />
            )}
            {step === 3 && (
              <ConfirmedStep orderId={orderId} navigate={navigate} />
            )}
          </div>

          {/* RIGHT: Order summary — hidden on confirmed */}
          {step !== 3 && (
            <div className="w-full lg:w-[300px] flex-shrink-0 lg:sticky lg:top-24">
              <OrderSummary
                cartItems={cartItems}
                subtotal={subtotal}
                shipping={shipping}
                total={total}
                discount={discount}
                appliedCoupon={appliedCoupon}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
