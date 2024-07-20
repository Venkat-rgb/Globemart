import { useDispatch, useSelector } from "react-redux";
import { useLogoutUserMutation } from "../redux/features/auth/authApiSlice";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { CircularProgress, ListItemIcon, Menu, MenuItem } from "@mui/material";
import Person4Icon from "@mui/icons-material/Person4";
import LogoutIcon from "@mui/icons-material/Logout";
import { logOut } from "../redux/features/slices/authSlice";
import toast from "react-hot-toast";
import { deleteTotalCart } from "../redux/features/slices/cartSlice";
import LazyImage from "./LazyImage";
import useLocalStorage from "../hooks/basic/useLocalStorage";
import useSessionStorage from "../hooks/basic/useSessionStorage";

const LogoutOverlay = ({ profileImg }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state?.auth);

  const { removeLocalData } = useLocalStorage();
  const { removeSessionData } = useSessionStorage();

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const [logoutUser, { isLoading: isUserLoggingOut }] = useLogoutUserMutation();

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  // Closes the profile menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Logout's the user
  const logoutHandler = async () => {
    try {
      const res = await logoutUser({ token }).unwrap();

      // Making the token and userInfo to null in redux
      dispatch(logOut());

      // Deleting all items in the cart as user is logging out
      dispatch(deleteTotalCart());

      // Deleting the cart items from localStorage as user is logging out
      removeLocalData("cart");

      // Deleting the orderInfo from sessionStorage as user is logging out
      removeSessionData("orderInfo");

      // Displaying successfull logout message
      toast.success(res?.message);

      // Redirecting user to login page
      navigate("/login", { replace: true });
    } catch (err) {
      toast(err?.message || err?.data?.message, { icon: "🙏" });
    }
  };

  return (
    <>
      {/* User profile image */}

      {/* <Avatar
        src={profileImg}
        alt="profile-img"
        sx={{
          width: 30,
          height: 30,
          cursor: "pointer",
          border: "1px solid #f1f1f1",
        }}
        onClick={handleClick}
      /> */}

      <div className="w-[30px] h-[30px]" onClick={handleClick}>
        <LazyImage
          imageProps={{
            src: profileImg,
            alt: "profile-img",
          }}
          skeletonVariant="circular"
          styleProp="border border-neutral-100 rounded-full"
          skeletonWidth={30}
          skeletonHeight={30}
        />
      </div>

      {/* Opens below menu when user clicks on profile image */}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {/* Redirects to user profile */}
        <Link to="/profile">
          <MenuItem
            onClick={handleClose}
            dense
            sx={{ fontFamily: "Inter", letterSpacing: "-0.025em" }}
          >
            <ListItemIcon>
              <Person4Icon fontSize="small" />
            </ListItemIcon>
            My Profile
          </MenuItem>
        </Link>

        {/* Logouts the user */}
        <MenuItem
          onClick={handleClose}
          dense
          sx={{ fontFamily: "Inter", letterSpacing: "-0.025em" }}
        >
          <div
            className={`flex items-center ${
              isUserLoggingOut ? "pointer-events-none" : ""
            }`}
            onClick={logoutHandler}
          >
            <ListItemIcon>
              {isUserLoggingOut ? (
                <CircularProgress sx={{ color: "#aaa" }} size={20} />
              ) : (
                <LogoutIcon fontSize="small" />
              )}
            </ListItemIcon>
            Logout
          </div>
        </MenuItem>
      </Menu>
    </>
  );
};

export default LogoutOverlay;
