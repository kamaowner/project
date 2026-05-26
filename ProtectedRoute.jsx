import { Navigate } from "react-router-dom";

function ProtectedRoute({ element }) {
  const user = localStorage.getItem("user");

  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If user is logged in, show the component
  return element;
}

export default ProtectedRoute;
