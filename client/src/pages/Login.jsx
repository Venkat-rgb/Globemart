import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button, Input, MetaData } from "../components";
import { setCredentials } from "../redux/features/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLoginUserMutation } from "../redux/features/auth/authApiSlice";
import toast from "react-hot-toast";
import jwt_decode from "jwt-decode";
import LoginImage from "../assets/images/basic/login.jpg";
import { CircularProgress } from "@mui/material";
import LoginLayout from "../components/Layout/LoginLayout";

const Login = () => {
  const dispatch = useDispatch();
  const { state } = useLocation();

  const [userData, setUserData] = useState({ email: "", password: "" });
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const { token } = useSelector((state) => state?.auth);

  const loginChangeHandler = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Logging in the user
  const loginSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      // Making API request to login the user
      const res = await loginUser(userData).unwrap();

      // Getting accessToken if user logged in successfully
      const decodedRes = jwt_decode(res?.accessToken);

      // Saving accessToken and userInfo in redux
      dispatch(
        setCredentials({
          token: res?.accessToken,
          userInfo: {
            username: decodedRes?.username,
            role: decodedRes?.role,
            id: decodedRes?.id,
          },
        })
      );

      // Display welcome login message
      toast(res?.message, {
        icon: "👏",
      });
    } catch (err) {
      console.log("Login error bro: ", err);
      toast.error(err?.data?.message || err?.data || err?.message);
    }
  };

  // if (isUserLoggedIn) {
  //   return <Navigate to={state ? state : "/"} replace={true} />;
  // }

  // Redirecting user to previous page he was before logging in (or) home page if he is already logged in
  if (token) {
    return <Navigate to={state ? state : "/"} replace={true} />;
  }

  return (
    // <Suspense
    //   fallback={
    //     <Loader styleProp="flex items-center justify-center h-[90vh]" />
    //   }
    // >
    <LoginLayout image={LoginImage}>
      <motion.div
        className="max-w-md w-full shadow-lg rounded-xl p-5 space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: 0.2 }}
      >
        <MetaData title="Login" />
        <p className="font-public-sans font-bold text-2xl max-[500px]:text-[1.4rem] text-center drop-shadow">
          Sign In
        </p>
        <form
          onSubmit={loginSubmitHandler}
          className={`flex font-inter flex-col space-y-5`}
        >
          <Input
            inputData={{
              type: "email",
              id: "email",
              name: "email",
              value: userData.email,
              placeholder: "Enter your Email...",
              required: true,
            }}
            onChange={loginChangeHandler}
            title="Email"
          />
          <Input
            inputData={{
              type: "password",
              id: "password",
              name: "password",
              value: userData.password,
              placeholder: "Must contain a number and special character...",
              required: true,
            }}
            onChange={loginChangeHandler}
            title="Password"
          />
          <div className="flex items-center justify-between gap-4">
            <Link
              className="underline underline-offset-4 decoration-neutral-300 hover:text-neutral-400 transition-all duration-300 text-sm max-[500px]:text-xs font-medium"
              to="/password/forgot"
            >
              Forgot password?
            </Link>
            <Link
              to="/register"
              className="underline underline-offset-4 decoration-neutral-300 hover:text-neutral-400 transition-all duration-300 text-sm max-[500px]:text-xs font-medium"
            >
              Don&apos;t have an account?
            </Link>
          </div>
          <Button isLoading={isLoading} moreStyles="w-full">
            {isLoading ? (
              <CircularProgress
                sx={{ color: "white", opacity: 0.8 }}
                size={20}
              />
            ) : (
              "Log In"
            )}
          </Button>
        </form>
      </motion.div>
    </LoginLayout>
    // </Suspense>
  );
};

export default Login;
