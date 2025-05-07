import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../API';

// Create async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API}/auth/login`, credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Create async thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/auth/logout`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Clear all auth data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('status');
      localStorage.removeItem('attendanceStatus');
      localStorage.removeItem('user');
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

// Create async thunk for updating profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // Simulating API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ...profileData,
            id: 1, // Mock user ID
          });
        }, 1000);
      });

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Check if user is authenticated on app load
export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const role = localStorage.getItem('role');
      
      if (!token || !user || !role) {
        return { isAuthenticated: false };
      }
      
      // Verify token with backend (optional)
      // const response = await axios.get(`${API}/auth/verify`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      return { 
        isAuthenticated: true,
        token,
        user,
        role
      };
    } catch (error) {
      return { isAuthenticated: false };
    }
  }
);

const initialState = {
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  loading: false,
  error: null,
  role: localStorage.getItem('role'),
  status: localStorage.getItem('status'),
  attendanceStatus: localStorage.getItem('attendanceStatus'),
  isAuthenticated: !!localStorage.getItem('token') && !!localStorage.getItem('role'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.role = action.payload.user.role;
        state.status = action.payload.user.status;
        state.attendanceStatus = action.payload.attendance.status;
        state.error = null;
        state.isAuthenticated = true;
        
        // Store in localStorage
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('role', action.payload.user.role);
        localStorage.setItem('status', action.payload.user.status);
        localStorage.setItem('attendanceStatus', action.payload.attendance.status);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.token = null;
        state.user = null;
        state.role = null;
        state.status = null;
        state.attendanceStatus = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.token = null;
        state.user = null;
        state.role = null;
        state.status = null;
        state.attendanceStatus = null;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
        // Update user in localStorage
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.isAuthenticated;
        if (action.payload.isAuthenticated) {
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.role = action.payload.role;
        }
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer; 