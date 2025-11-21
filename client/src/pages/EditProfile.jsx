import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button, Input, MetaData } from "../components";
import {
  useDeleteUserAccountMutation,
  useUpdateProfileMutation,
} from "../redux/features/profile/profileApiSlice";
import toast from "react-hot-toast";
import { CircularProgress, Tooltip } from "@mui/material";
import lodash from "lodash";
import ProfileOverlay from "../components/Profile/ProfileOverlay";
import { useDispatch } from "react-redux";
import { logOut } from "../redux/features/slices/authSlice";
import { deleteTotalCart } from "../redux/features/slices/cartSlice";
import useLocalStorage from "../hooks/basic/useLocalStorage";
import useSessionStorage from "../hooks/basic/useSessionStorage";

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { state: userInfo } = useLocation();

  const [updateProfile, { isLoading: isProfileUpdating }] =
    useUpdateProfileMutation();
  const [deleteUserAccount, { isLoading: isAccountDeleting }] =
    useDeleteUserAccountMutation();

  const { removeLocalData } = useLocalStorage();
  const { removeSessionData } = useSessionStorage();

  const [profileImg, setProfileImg] = useState("");
  const [profileImgFile, setProfileImgFile] = useState(null);

  const [userData, setUserData] = useState({
    username: "",
    email: "",
  });

  const { username, email } = userData;
  const isProfileImgChanged = userInfo?.user?.profileImg;

  // Editing profile
  const editProfileSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.set("username", username);
      formData.set("email", email);

      // Updating the image only if previous image and current image are not same
      if (profileImgFile && !lodash.isEqual(isProfileImgChanged, profileImg)) {
        formData.set("profileImg", profileImgFile);
      }

      // Updating customer profile information
      const res = await updateProfile(formData).unwrap();

      toast.success(res?.message);

      setProfileImgFile(null);

      // Redirecting to Profile page to see whether changes are reflected
      navigate("/profile");
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  // User account deletion
  const deleteUserAccountHandler = async () => {
    try {
      // Deleting the user account
      const res = await deleteUserAccount().unwrap();

      // Making the token and userInfo to null in redux as account is deleted
      dispatch(logOut());

      // Deleting all items in the cart as user account is deleted
      dispatch(deleteTotalCart());

      // Deleting the cart items from localStorage as user account is deleted
      removeLocalData("cart");

      // Deleting the orderInfo from sessionStorage as user account is deleted
      removeSessionData("orderInfo");

      // Displaying successful account deletion message
      toast.success(res?.message);

      // Redirecting to login page
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  const editProfileChangeHandler = (e) => {
    // Reading image and storing base64encoded address of image
    if (e.target.name === "profileImg") {
      setProfileImgFile(e.target.files[0]);

      const reader = new FileReader();

      reader.onload = () => {
        // readyState = 2, means image has been successfully read
        if (reader.readyState === 2) {
          setProfileImg(reader.result);
        }
      };

      // Passing image as argument to convert into base64encoded format
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUserData({
        ...userData,
        [e.target.name]: e.target.value,
      });
    }
  };

  // Setting customer's initial (or) updated information once it is loaded
  useEffect(() => {
    if (userInfo?.user) {
      setProfileImg(userInfo?.user?.profileImg);
      setUserData({
        username: userInfo?.user?.username,
        email: userInfo?.user?.email,
      });
    }
  }, [userInfo?.user]);

  return (
    <div className="space-y-20">
      <MetaData title="Edit-Profile" />
      <ProfileOverlay
        placeOfUse="editProfile"
        image={profileImg}
        onChange={editProfileChangeHandler}
      />
      <div className="px-3 pb-5">
        <motion.div
          className="max-w-xl mx-auto shadow-lg rounded-xl p-5 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <p className="font-public-sans drop-shadow font-semibold text-2xl max-[500px]:text-[1.4rem] text-center">
            Edit Profile
          </p>
          <form
            onSubmit={editProfileSubmitHandler}
            className="flex font-inter flex-col space-y-5"
            encType="multipart/form-data"
          >
            <Input
              inputData={{
                type: "text",
                id: "username",
                name: "username",
                value: username,
                placeholder: "Enter your Username...",
                required: true,
              }}
              onChange={editProfileChangeHandler}
              title="Username"
            />

            <Input
              inputData={{
                type: "email",
                id: "email",
                name: "email",
                value: email,
                placeholder: "Enter your Email...",
                required: true,
              }}
              onChange={editProfileChangeHandler}
              title="Email"
            />

            <Button isLoading={isProfileUpdating} moreStyles="w-full">
              {isProfileUpdating ? (
                <div className="flex items-center justify-center gap-2">
                  <p className="text-white/75">Updating Profile</p>
                  <CircularProgress
                    sx={{ color: "white", opacity: 0.8 }}
                    size={20}
                  />
                </div>
              ) : (
                "Update Profile"
              )}
            </Button>
          </form>

          <Button
            onClick={deleteUserAccountHandler}
            isLoading={isAccountDeleting}
            moreStyles="w-full bg-red-500"
          >
            {isAccountDeleting ? (
              <div className="flex items-center justify-center gap-2">
                <p className="text-white/75">Deleting Account</p>
                <CircularProgress
                  sx={{ color: "white", opacity: 0.8 }}
                  size={20}
                />
              </div>
            ) : (
              <Tooltip
                title="This action cannot be undone"
                placement="right-start"
                arrow
              >
                <p>Delete Account</p>
              </Tooltip>
            )}
          </Button>
        </motion.div>
      </div>
      <Outlet />
    </div>
  );
};

export default EditProfile;
