import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { ThemeProvider } from './theme/ThemeProvider';
import store from './store';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/dashboard/Dashboard';
import Profile from './pages/profile/Profile';
import Calendar from './pages/calendar/Calendar';
import Tasks from './pages/tasks/Tasks';
import Chat from './pages/chat/Chat';
import Employee from './pages/employee/Employee';
// import EmployeeManagement from './pages/admin/EmployeeManagement';
// import HolidayManagement from './pages/admin/HolidayManagement';
import PrivateRoute from './components/auth/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { checkAuthStatus } from './store/slices/authSlice';

// Wrapper component to check auth status
const AuthCheck = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Only check auth status if we have a token and role in localStorage
    if (localStorage.getItem('token') && localStorage.getItem('role')) {
      dispatch(checkAuthStatus());
    }
  }, [dispatch]);

  return children;
};

// Wrapper component to initialize theme
const ThemeInitializer = ({ children }) => {
  useEffect(() => {
    // Initialize theme from localStorage if not already set
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'light'); // Default theme
    }
  }, []);

  return children;
};

const AppRoutes = () => {
  return (
    <Router>
      <ThemeInitializer>
        <AuthCheck>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes with Layout */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/employees" element={<Employee />} />
              {/* <Route path="/admin">
                <Route path="employees" element={<EmployeeManagement />} />
                <Route path="holidays" element={<HolidayManagement />} />
              </Route> */}
            </Route>
          </Routes>
        </AuthCheck>
      </ThemeInitializer>
    </Router>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
