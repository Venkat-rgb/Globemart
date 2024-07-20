import { useState } from "react";
import { motion } from "framer-motion";
import { Button, MetaData, Input } from "../components";
import forgotPasswordImage from "../assets/images/basic/forgotPassword.jpg";
import { useForgotPasswordMutation } from "../redux/features/auth/authApiSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import LoginLayout from "../components/Layout/LoginLayout";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  // Making API request to send password reset token to user email
  const forgotPasswordSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword({ email }).unwrap();

      // Showing token sent successfully message
      toast?.success(res?.message);

      // Redirecting user to Home page
      navigate("/");
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  return (
    <LoginLayout image={forgotPasswordImage}>
      <motion.div
        className="max-w-md w-full shadow-lg rounded-xl p-5 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: 0.2 }}
      >
        <MetaData title="Forgot-Password" />

        <p className="font-public-sans font-bold text-2xl max-[500px]:text-[1.4rem] text-center drop-shadow">
          Forgot Password
        </p>
        <form
          onSubmit={forgotPasswordSubmitHandler}
          className="flex font-inter flex-col space-y-5"
        >
          <Input
            inputData={{
              type: "email",
              id: "email",
              value: email,
              placeholder: "Enter your Email...",
              required: true,
            }}
            onChange={(e) => setEmail(e.target.value)}
            title="Email"
          />

          <p className="text-sm font-medium">
            *** Please enter your email address above. We&apos;ll send you a
            verification link to your email address to reset your password. This
            link will be valid for a limited time period! ***
          </p>

          <Button isLoading={isLoading} moreStyles="w-full">
            {isLoading ? (
              <CircularProgress
                sx={{ color: "white", opacity: 0.8 }}
                size={20}
              />
            ) : (
              "Send Verification Link"
            )}
          </Button>
        </form>
      </motion.div>
    </LoginLayout>
  );
};

export default ForgotPassword;

// {
/* <motion.div whileTap={{ scale: 0.97 }}>
            <button
              className="bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 px-4 py-2 rounded shadow-lg transition-all duration-300 font-medium text-neutral-600 w-full flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                "Send Verification Link"
              )}
            </button>
          </motion.div> */
// }
