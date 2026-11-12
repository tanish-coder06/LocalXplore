import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../services/api";

function Login() {
  // ========================================
  // REACT ROUTER
  // ========================================

  const navigate = useNavigate();

  // ========================================
  // FORM STATE
  // ========================================

  // Store login form information
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Store success and error messages
  const [message, setMessage] = useState("");

  // Track login request
  const [loading, setLoading] = useState(false);

  // ========================================
  // ROLE-BASED DASHBOARD ROUTES
  // ========================================

  const dashboardRoutes = {
    tourist: "/tourist/dashboard",
    guide: "/guide/dashboard",
    admin: "/admin/dashboard",
  };

  // ========================================
  // HANDLE INPUT CHANGES
  // ========================================

  const handleChange = (e) => {
    setFormData((previousData) => ({
      ...previousData,
      [e.target.name]: e.target.value,
    }));
  };

  // ========================================
  // HANDLE LOGIN
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent duplicate login requests
    if (loading) {
      return;
    }

    // Clear previous messages
    setMessage("");

    // Show loading state
    setLoading(true);

    try {
      // Send login credentials to backend
      const response = await api.post(
        "/auth/login",
        formData
      );

      // ========================================
      // EXTRACT RESPONSE DATA
      // ========================================

      const { token, user } = response.data;

      // ========================================
      // VALIDATE LOGIN RESPONSE
      // ========================================

      // Check if token and user information exist
      if (!token || !user || !user.role) {
        throw new Error(
          "Invalid login response from server."
        );
      }

      // Find dashboard route based on user role
      const dashboardRoute = dashboardRoutes[user.role];

      // Reject unsupported user roles
      if (!dashboardRoute) {
        throw new Error(
          "Your account has an unsupported user role."
        );
      }

      // ========================================
      // SAVE AUTHENTICATION INFORMATION
      // ========================================

      // Store JWT token
      localStorage.setItem("token", token);

      // Store logged-in user information
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      // ========================================
      // CLEAR PASSWORD FIELD
      // ========================================

      setFormData((previousData) => ({
        ...previousData,
        password: "",
      }));

      // ========================================
      // REDIRECT USER BASED ON ROLE
      // ========================================

      navigate(dashboardRoute, {
        replace: true,
      });

    } catch (error) {
      // ========================================
      // HANDLE LOGIN ERRORS
      // ========================================

      console.error("Login error:", error);

      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again."
      );

    } finally {
      // Stop loading
      setLoading(false);
    }
  };

  // ========================================
  // JSX
  // ========================================

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">

      {/* ========================================
          LOGIN CARD
      ======================================== */}

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

        {/* ========================================
            HEADING
        ======================================== */}

        <h1 className="text-3xl font-bold text-center mb-2">
          Welcome Back
        </h1>

        <p className="text-gray-600 text-center mb-6">
          Login to your LocalXplore account
        </p>

        {/* ========================================
            LOGIN FORM
        ======================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* Email Input */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Password Input */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* ========================================
            ERROR MESSAGE
        ======================================== */}

        {message && (
          <p
            role="alert"
            className="mt-4 text-center text-red-600 text-sm"
          >
            {message}
          </p>
        )}

      </div>
    </div>
  );
}

export default Login;