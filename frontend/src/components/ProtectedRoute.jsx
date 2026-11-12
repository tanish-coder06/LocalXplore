import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {

  // Get JWT token from localStorage
  const token = localStorage.getItem("token");

  // Get saved user information
  const storedUser = localStorage.getItem("user");

  // Convert stored user information into an object
  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    // Handle invalid stored user information
    user = null;
  }

  // Check whether the user is logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check whether the user has permission
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Allow access to the protected page
  return children;
}

export default ProtectedRoute;