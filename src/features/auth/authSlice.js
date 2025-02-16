import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Register thunk
export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/registration", {
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        password: userData.password,
      });
      return response;
    } catch (error) {
      // Return the complete error object for proper handling
      return rejectWithValue({
        status: error.status,
        message: error.message,
        data: error.data,
      });
    }
  }
);

// Login thunk
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/login", credentials);
      localStorage.setItem("token", response.data.token);
      return response;
    } catch (error) {
      // Return the complete error object for proper handling
      return rejectWithValue({
        status: error.status,
        message: error.message,
        data: error.data,
      });
    }
  }
);

// Get profile thunk
export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue, getState }) => {
    const { auth } = getState();
    // Don't fetch if we already have user data
    if (auth.user) {
      return { data: auth.user };
    }
    try {
      const response = await api.get("/profile");
      return response;
    } catch (error) {
      return rejectWithValue({
        status: error.status,
        message: error.message,
        data: error.data,
      });
    }
  },
  {
    condition: (_, { getState }) => {
      const { auth } = getState();
      // Skip if we're already fetching or have user data
      if (!auth.isAuthenticated) {
        return false;
      }
      return true;
    },
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(register.pending, (state) => {
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        // No state changes needed
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Login cases
      .addCase(login.pending, (state) => {
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.token = action.payload.data.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Get profile cases
      .addCase(getProfile.pending, (state) => {
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload.data;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
