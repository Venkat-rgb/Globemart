import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button, Input, MetaData } from "../components";
import { useUpdateProfileMutation } from "../redux/features/profile/profileApiSlice";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import lodash from "lodash";
import ProfileOverlay from "../components/Profile/ProfileOverlay";

const EditProfile = () => {
  const navigate = useNavigate();

  const { state: userInfo } = useLocation();

  const [updateProfile, { isLoading: isProfileUpdating }] =
    useUpdateProfileMutation();

  const [profileImg, setProfileImg] = useState("");
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
      if (!lodash.isEqual(isProfileImgChanged, profileImg)) {
        formData.set("profileImg", profileImg);
      }

      // Updating customer profile information
      const res = await updateProfile(formData).unwrap();

      toast.success(res?.message);

      // Redirecting to Profile page to see whether changes are reflected
      navigate("/profile");
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  const editProfileChangeHandler = (e) => {
    // Reading image and storing base64encoded address of image
    if (e.target.name === "profileImg") {
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
          className="max-w-xl mx-auto shadow-lg rounded-xl p-5 space-y-6"
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
        </motion.div>
      </div>
      <Outlet />
    </div>
  );
};

export default EditProfile;
