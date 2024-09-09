import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { token } = useSelector((state) => state?.auth);

  // Redirecting customer to login page if he is not logged in
  if (!token) {
    return <Navigate to="/login" state={location.pathname} replace={true} />;
  }

  // Allowing customer to access the page he requested as he is logged in
  return children;
};

export default ProtectedRoute;
