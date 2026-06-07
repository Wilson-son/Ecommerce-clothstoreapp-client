import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// ================= AUTH =================

// login
export const loginUser = (data) => API.post("/auth/login", data);

// register
export const registerUser = (data) => API.post("/auth/register", data);


// forgot password
export const forgotPassword = (email) =>
  API.post("/auth/forgot-password", { email });

// reset password
export const resetPassword = ({ token, password }) =>
  API.put(`/auth/reset-password/${token}`, { password });

// resend verification
export const resendVerification = (email) =>
  API.post("/auth/resend-verification", { email });



// ================= SESSION =================

// get current logged-in user (USED BY REDUX HYDRATION)
export const getCurrentUser = () => API.get("/auth/me");


// logout (works for BOTH oauth + normal login)
export const logoutUser = () => API.post("/auth/logout");

export default API;