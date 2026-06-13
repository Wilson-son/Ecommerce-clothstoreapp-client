import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
  resendVerification,
  getCurrentUser,
} from "../../api/authApi";

// LOGIN
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginUser(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed.");
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
      return rejectWithValue(
        err.response?.data?.message || "Registration failed."
      );
    }
  },
);

// LOAD USER (COOKIE AUTH RESTORE)
export const loadUserThunk = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getCurrentUser();
      return res.data.user;
    } catch (err) {
      // Silently reject — a 401 here is expected on first load
      return rejectWithValue(err.response?.data?.message || "Unauthorized");
    }
  },
);

// FORGOT PASSWORD
export const forgotPasswordThunk = createAsyncThunk(
  "auth/forgot-password",
  async (data, { rejectWithValue }) => {
    try {
      const res = await forgotPassword(data.email);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to send reset email."
      );
    }
  },
);

// RESET PASSWORD
export const resetPasswordThunk = createAsyncThunk(
  "auth/reset-password",
  async (data, { rejectWithValue }) => {
    try {
      const res = await resetPassword(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Password reset failed."
      );
    }
  },
);

// RESEND VERIFICATION
export const resendVerificationThunk = createAsyncThunk(
  "auth/resend-verification",
  async (email, { rejectWithValue }) => {
    try {
      const res = await resendVerification(email);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to resend verification email."
      );
    }
  },
);

// ─── SLICE ─────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,        // thunk-specific loading (not used for initial auth check)
    authInitialized: false, // true once loadUserThunk has settled (fulfilled or rejected)
    error: null,
    success: null,
  },

  reducers: {
    logout(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.success = null;
      // authInitialized stays true — the user was already verified, now logged out
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
        state.user = action.payload.user;
        state.success = action.payload.message;
      })
      .addCase(loginThunk.rejected, rejected);

    // REGISTER
    // Note: does not set state.user — adjust if backend auto-logs in on register
    builder
      .addCase(registerThunk.pending, pending)
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(registerThunk.rejected, rejected);

    // LOAD USER (COOKIE RESTORE)
    // Uses authInitialized, not loading, so unrelated UI doesn't flash a spinner
    builder
      .addCase(loadUserThunk.pending, (state) => {
        state.error = null;
        state.success = null;
        // Deliberately not setting loading: true here —
        // gate your app shell on authInitialized instead
      })
      .addCase(loadUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.authInitialized = true;
      })
      .addCase(loadUserThunk.rejected, (state) => {
        // A 401 on cookie restore is expected; don't surface it as an error
        state.user = null;
        state.authInitialized = true;
      });

    // FORGOT PASSWORD
    builder
      .addCase(forgotPasswordThunk.pending, pending)
      .addCase(forgotPasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(forgotPasswordThunk.rejected, rejected);

    // RESET PASSWORD
    builder
      .addCase(resetPasswordThunk.pending, pending)
      .addCase(resetPasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(resetPasswordThunk.rejected, rejected);

    // RESEND VERIFICATION
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