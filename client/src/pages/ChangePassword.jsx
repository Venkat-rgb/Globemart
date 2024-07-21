import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ProfileOverlay from "../components/Profile/ProfileOverlay";
import { useChangePasswordMutation } from "../redux/features/profile/profileApiSlice";
import { CircularProgress } from "@mui/material";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../redux/features/slices/authSlice";
import { deleteTotalCart } from "../redux/features/slices/cartSlice";
import { Button, Input, MetaData } from "../components";
import useLocalStorage from "../hooks/basic/useLocalStorage";
import useSessionStorage from "../hooks/basic/useSessionStorage";

const ChangePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Getting user profile image data by storing image in state prop in Profile Page
  const { state } = useLocation();

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const { token } = useSelector((state) => state?.auth);

  const { removeLocalData } = useLocalStorage();
  const { removeSessionData } = useSessionStorage();

  // Changing password
  const passwordSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await changePassword({ ...passwordData, token }).unwrap();

      // Showing password changed successfully message
      toast.success(res?.message);

      // Making user to login again once he changed his password, so logging him out
      dispatch(logOut());

      // Deleting the cart from redux as user is logged out
      dispatch(deleteTotalCart());

      // Deleting the persistent cartInfo from localStorage as user is logged out
      // localStorage.removeItem("cart");
      removeLocalData("cart");

      // Deleting the orderInfo from sessionStorage as user is logged out
      // sessionStorage.removeItem("orderInfo");
      removeSessionData("orderInfo");

      // Redirecting user to login again after password has been changed
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  const passwordChangeHandler = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-14 pb-16">
      <MetaData title="Change-Password" />
      <ProfileOverlay placeOfUse="forgotPassword" image={state?.profileImg} />
      <div className="px-3">
        <motion.div
          className="max-w-xl mx-auto shadow-lg rounded-xl p-5 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          // transition={{ delay: 0.2 }}
        >
          <p className="font-inter drop-shadow font-semibold text-2xl max-[500px]:text-[1.4rem] text-center">
            Change Password
          </p>
          <form
            onSubmit={passwordSubmitHandler}
            className="flex font-inter flex-col space-y-5"
          >
            <Input
              inputData={{
                type: "password",
                id: "oldPassword",
                name: "oldPassword",
                value: passwordData.oldPassword,
                placeholder: "Enter your Old Password...",
                required: true,
              }}
              onChange={passwordChangeHandler}
              title="Old Password"
            />
            <Input
              inputData={{
                type: "password",
                id: "newPassword",
                name: "newPassword",
                value: passwordData.newPassword,
                placeholder: "Enter your New Password...",
                required: true,
              }}
              onChange={passwordChangeHandler}
              title="New Password"
            />

            <Input
              inputData={{
                type: "password",
                id: "confirmNewPassword",
                name: "confirmNewPassword",
                value: passwordData.confirmNewPassword,
                placeholder: "Confirm New Password...",
                required: true,
              }}
              onChange={passwordChangeHandler}
              title="Confirm New Password"
            />

            <Button isLoading={isLoading} moreStyles="w-full">
              {isLoading ? (
                <CircularProgress
                  sx={{ color: "white", opacity: 0.8 }}
                  size={20}
                />
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ChangePassword;
