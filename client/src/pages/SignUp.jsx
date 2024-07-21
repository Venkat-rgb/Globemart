import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button, Input, MetaData } from "../components";
import { motion } from "framer-motion";
import { FaUserAlt } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../redux/features/slices/authSlice";
import { useRegisterUserMutation } from "../redux/features/auth/authApiSlice";
import toast from "react-hot-toast";
import jwt_decode from "jwt-decode";
import LoginImage from "../assets/images/basic/login.jpg";
import { Avatar, CircularProgress } from "@mui/material";
import LoginLayout from "../components/Layout/LoginLayout";

const SignUp = () => {
  // Keeps track of signup credentials
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Stores base64encoded format of profile image
  const [profileImg, setProfileImg] = useState("");

  const { username, email, password } = userData;

  const dispatch = useDispatch();

  const { token } = useSelector((state) => state?.auth);

  const [registerUser, { isLoading }] = useRegisterUserMutation();

  // Setting values for input fields while they are changing
  const signUpChangeHandler = (e) => {
    // Reading and storing base64encoded of profileImg
    if (e.target.name === "profileImg") {
      const reader = new FileReader();

      reader.onload = () => {
        // readyState = 2, means image has been successfully read
        if (reader.readyState === 2) {
          setProfileImg(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      // Setting username, email, password
      setUserData({
        ...userData,
        [e.target.name]: e.target.value,
      });
    }
  };

  // Registering user
  const signUpSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      // Storing register credentials into FormData
      const formData = new FormData();
      formData.set("username", username);
      formData.set("email", email);
      formData.set("password", password);
      formData.set("profileImg", profileImg);

      // Making API request to register the user
      const res = await registerUser(formData).unwrap();

      // Getting accessToken once user successfully registered
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

      // Displaying successfully registered message
      toast.success(res?.message);
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  // Redirecting to Home page if user is already logged in
  if (token) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <LoginLayout image={LoginImage}>
      <motion.div
        className="max-w-md w-full shadow-lg rounded-xl p-5 space-y-2 max-[900px]:space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: 0.2 }}
      >
        <MetaData title="SignUp" />
        <p className="font-public-sans font-bold text-2xl max-[500px]:text-[1.4rem] text-center drop-shadow">
          Sign Up
        </p>
        <form
          onSubmit={signUpSubmitHandler}
          className="flex font-inter flex-col space-y-5"
          encType="multipart/form-data"
        >
          <Input
            inputData={{
              type: "text",
              id: "username",
              name: "username",
              value: username,
              placeholder: "Enter your name...",
              required: true,
            }}
            onChange={signUpChangeHandler}
            title="Username"
          />

          <Input
            inputData={{
              type: "email",
              id: "email",
              name: "email",
              value: email,
              placeholder: "Enter your email...",
              required: true,
            }}
            onChange={signUpChangeHandler}
            title="Email"
          />

          <Input
            inputData={{
              type: "password",
              id: "password",
              name: "password",
              value: password,
              placeholder: "Enter your password...",
              required: true,
            }}
            onChange={signUpChangeHandler}
            title="Password"
          />

          {/* Chossing profileImg */}
          <input
            type="file"
            className="hidden"
            id="profileImg"
            name="profileImg"
            onChange={signUpChangeHandler}
          />
          {profileImg ? (
            <div className="flex items-center gap-4">
              <Avatar
                alt="uploaded-profile-img"
                src={profileImg}
                sx={{ width: 56, height: 56, flexShrink: 0 }}
              />
              <FiEdit
                className="cursor-pointer"
                onClick={() => document.getElementById("profileImg").click()}
              />
            </div>
          ) : (
            <motion.div
              className="flex items-center gap-3 cursor-pointer"
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById("profileImg").click()}
            >
              <FaUserAlt className="flex-shrink-0" />
              <p>Choose Avatar</p>
            </motion.div>
          )}

          <Link
            to="/login"
            className="underline underline-offset-4 decoration-neutral-300 hover:text-neutral-400 transition-all duration-300 text-sm font-medium"
          >
            Already have an account?
          </Link>

          <Button isLoading={isLoading} moreStyles="w-full">
            {isLoading ? (
              <CircularProgress
                sx={{ color: "white", opacity: 0.8 }}
                size={20}
              />
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </motion.div>
    </LoginLayout>
  );
};

export default SignUp;
