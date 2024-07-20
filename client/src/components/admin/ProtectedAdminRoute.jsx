import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

const ProtectedAdminRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state?.auth);
  const [isPermissionErrorDisplayed, setIsPermissionErrorDisplayed] =
    useState(false);

  // If user is not admin then he can't access the admin dashboard
  useEffect(() => {
    if (userInfo?.role !== "admin" && !isPermissionErrorDisplayed) {
      // Showing error
      toast.error("You don't have permission to perform restricted actions!");

      setIsPermissionErrorDisplayed(true);
    }
  }, [userInfo?.role, isPermissionErrorDisplayed]);

  // Redirecting to home page only after permission defined error is displayed
  if (userInfo?.role !== "admin" && isPermissionErrorDisplayed) {
    // Redirecting user to home page
    return <Navigate to="/" replace={true} />;
  }

  return children;
};

export default ProtectedAdminRoute;
