import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
  resendVerification,
} from "../../api/authApi";

// LOGIN
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginUser(data);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message|| "Login failed.");
    }
  },
);

// REGISTER
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await registerUser(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration failed.");
    }
  },
);

// LOAD USER (VERY IMPORTANT - COOKIE AUTH RESTORE)
export const loadUserThunk = createAsyncThunk(
  "auth/loadUser",
  async (_, thunkAPI) => {
    try {
      const res = await getCurrentUser();
      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue("Unauthorized");
    }
  },
);

// PASSWORD / EMAIL THUNKS (UNCHANGED LOGIC)
export const forgotPasswordThunk = createAsyncThunk(
  "auth/forgot-password",
  async (data, { rejectWithValue }) => {
    try {
      const res = await forgotPassword(data.email);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const resetPasswordThunk = createAsyncThunk(
  "auth/reset-password",
  async (data, { rejectWithValue }) => {
    try {
      const res = await resetPassword(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const resendVerificationThunk = createAsyncThunk(
  "auth/resend-verification",
  async (email, { rejectWithValue }) => {
    try {
      const res = await resendVerification(email);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

// ─── SLICE ─────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    success: null,
  },

  reducers: {
    logout(state) {
      state.user = null;
    },

    clearMessages(state) {
      state.error = null;
      state.success = null;
    },
  },

  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    };

    const rejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    // LOGIN
    builder
      .addCase(loginThunk.pending, pending)
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginThunk.rejected, rejected);

    // REGISTER
    builder
      .addCase(registerThunk.pending, pending)
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(registerThunk.rejected, rejected);

    // LOAD USER (COOKIE RESTORE)
    builder
      .addCase(loadUserThunk.pending, pending)
      .addCase(loadUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loadUserThunk.rejected, (state) => {
        state.loading = false;
        state.user = null;
      });

    // OTHER THUNKS (same pattern)
    
    builder
      .addCase(forgotPasswordThunk.pending, pending)
      .addCase(forgotPasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message; // ← your backend sends "message" not "msg"
      })
      .addCase(forgotPasswordThunk.rejected, rejected);

    builder
      .addCase(resetPasswordThunk.pending, pending)
      .addCase(resetPasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(resetPasswordThunk.rejected, rejected);

    builder
      .addCase(resendVerificationThunk.pending, pending)
      .addCase(resendVerificationThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(resendVerificationThunk.rejected, rejected);
  },
});

export const { logout, clearMessages } = authSlice.actions;
export default authSlice.reducer;
