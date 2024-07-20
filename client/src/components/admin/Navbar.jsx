import { useDispatch, useSelector } from "react-redux";
import { setSideBar } from "../../redux/features/slices/adminSidebarSlice";
import { useMediaQuery } from "@mui/material";
import LogoutOverlay from "../LogoutOverlay";
import { useGetProfileQuery } from "../../redux/features/profile/profileApiSlice";
import { useEffect } from "react";
import Logo from "../UI/Logo";
import { HiMenuAlt1 } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";

const Navbar = () => {
  const dispatch = useDispatch();
  const { isSidebarOpen } = useSelector((state) => state?.sidebar);
  const matches = useMediaQuery(`(max-width:1100px)`);

  const { data, isError, error } = useGetProfileQuery();

  // Hiding sidebar when screen size is less than 1100px
  useEffect(() => {
    dispatch(setSideBar(matches ? false : true));
  }, [dispatch, matches]);

  // Handling error during fetching user's profile information
  if (isError) {
    console.error("Admin Navbar profile error: ", error?.data?.message);
  }

  return (
    <div className="flex items-center justify-between px-5 py-2 fixed w-full top-0 z-50 shadow bg-white">
      <div className="flex items-center gap-4">
        {/* Controls whether dashboard sidebar should be open (or) closed */}
        {!isSidebarOpen && (
          <HiMenuAlt1
            size={24}
            className="text-neutral-600 flex-shrink-0 hidden max-[970px]:block cursor-pointer"
            onClick={() => dispatch(setSideBar(true))}
          />
        )}
        {isSidebarOpen && (
          <IoCloseOutline
            size={24}
            className="text-neutral-600 flex-shrink-0 hidden max-[970px]:block cursor-pointer"
            onClick={() => dispatch(setSideBar(false))}
          />
        )}

        {/* Logo which redirects to Home page on click */}
        <Logo />
      </div>

      {/* Displaying profileImg with user logout functionality */}
      <div className="flex-shrink-0">
        <LogoutOverlay profileImg={data?.user?.profileImg} />
      </div>
    </div>
  );
};

export default Navbar;
