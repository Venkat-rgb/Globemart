import { useLocation, useNavigate } from "react-router-dom";
import { BiSearchAlt } from "react-icons/bi";
import { useGetProfileQuery } from "../redux/features/profile/profileApiSlice";
import LogoutOverlay from "./LogoutOverlay";
import { HiMenuAlt1 } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";
import NavbarContent from "./UI/NavbarContent";
import Logo from "./UI/Logo";
import { useDispatch, useSelector } from "react-redux";
import { setCustomerSidebar } from "../redux/features/slices/customerSidebarSlice";
import { memo } from "react";

const Navbar = () => {
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state?.auth);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { isCustomerSidebarOpen } = useSelector(
    (state) => state?.customerSidebar
  );

  // Getting userInfo only when he is logged in
  const { data, isError, error } = useGetProfileQuery(undefined, {
    skip: !token,
  });

  // Handling error when error occurs during fetching profile image
  if (isError) {
    console.error("Navbar profileImg error: ", error?.data?.message);
  }

  return (
    <nav className="bg-white shadow">
      <div className="flex items-center gap-4 justify-between px-5 py-[0.65rem] max-w-[84rem] mx-auto">
        <div className="flex items-center gap-5">
          {/* Sidebar opening and closing */}
          {!isCustomerSidebarOpen && (
            <HiMenuAlt1
              size={25}
              className="text-neutral-600 flex-shrink-0 hidden max-[970px]:block cursor-pointer"
              onClick={() => dispatch(setCustomerSidebar(true))}
            />
          )}
          {isCustomerSidebarOpen && (
            <IoCloseOutline
              size={25}
              className="text-neutral-600 flex-shrink-0 hidden max-[970px]:block cursor-pointer"
              onClick={() => dispatch(setCustomerSidebar(false))}
            />
          )}

          {/* Logo of ecommerce */}
          <Logo />
        </div>

        {/* Searching Products functionality */}
        <div className="border rounded flex items-center gap-2 font-inter py-[0.3rem] px-3 max-[970px]:hidden">
          <BiSearchAlt className="text-[1.1rem] text-neutral-600" />
          <p
            className="text-sm cursor-pointer text-neutral-500"
            onClick={() => navigate("/search-products", { state: pathname })}
          >
            Search for Products...
          </p>
        </div>

        <div className="font-inter flex items-center gap-10">
          {/* Showing links to all pages available */}
          <NavbarContent
            styleProp="transition-all flex items-center gap-10 max-[970px]:hidden"
            placeOfUse="navbar"
          />

          {/* Showing Logout button only when user has logged in */}
          {token && <LogoutOverlay profileImg={data?.user?.profileImg} />}
        </div>
      </div>
    </nav>
  );
};

export default memo(Navbar);
