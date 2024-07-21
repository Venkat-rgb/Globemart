import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Input, MetaData } from "../components";
import { motion } from "framer-motion";
import SetNewPasswordImage from "../assets/images/basic/setNewPassword.jpg";
import toast from "react-hot-toast";
import { useResetPasswordMutation } from "../redux/features/auth/authApiSlice";
import { CircularProgress } from "@mui/material";
import LoginLayout from "../components/Layout/LoginLayout";

const SetForgotPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  // Keeps track of newPassword
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  // Resetting password
  const passwordSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const userInfo = {
        password: passwordData.newPassword,
        confirmPassword: passwordData.confirmNewPassword,
        token,
      };

      // Making API request to set new password
      const res = await resetPassword(userInfo).unwrap();

      // Showing password changed successfully message
      toast.success(res?.message);

      // Redirecting user to Login page
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  const passwordChangeHandler = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  return (
    <LoginLayout image={SetNewPasswordImage}>
      <MetaData title="Reset-Forgot-Password" />
      <motion.div
        className="max-w-md w-full shadow-lg rounded-xl p-5 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: 0.2 }}
      >
        <p className="font-public-sans text-neutral-600 font-bold text-2xl max-[500px]:text-[1.4rem] text-center drop-shadow">
          Set New Password
        </p>
        <form
          onSubmit={passwordSubmitHandler}
          className="flex font-inter flex-col space-y-5"
        >
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
              "Set Password"
            )}
          </Button>
        </form>
      </motion.div>
    </LoginLayout>
  );
};

export default SetForgotPassword;
