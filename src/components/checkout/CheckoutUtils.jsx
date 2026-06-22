export const FREE_SHIPPING_THRESHOLD = 999;
export const SHIPPING_FEE = 99;

export const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3C/svg%3E";

export const validateShipping = (form) => {
  const errs = {};
  if (!form.fullName.trim()) errs.fullName = "Full name is required";
  if (!/^\d{10}$/.test(form.phone)) errs.phone = "Enter a valid 10-digit phone number";
  if (!form.address.trim()) errs.address = "Address is required";
  if (!form.city.trim()) errs.city = "City is required";
  if (!/^\d{6}$/.test(form.pincode)) errs.pincode = "Enter a valid 6-digit PIN code";
  if (!form.state.trim()) errs.state = "State is required";
  return errs; // empty object = valid
};