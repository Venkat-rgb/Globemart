import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { setCouponModal } from "../../redux/features/slices/couponSlice";
import Badge from "@mui/material/Badge";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { motion } from "framer-motion";
import { BiSearchAlt } from "react-icons/bi";
import { setCustomerSidebar } from "../../redux/features/slices/customerSidebarSlice";
import { memo } from "react";

const NavbarContent = ({ styleProp, placeOfUse }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { token, userInfo } = useSelector((state) => state?.auth);
  const { totalProductsCount } = useSelector((state) => state?.cart);

  return (
    <div className={styleProp}>
      {/* Search icon for searching products */}
      {placeOfUse === "sidebar" && (
        <motion.div
          className="flex items-center justify-center cursor-pointer"
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            dispatch(setCustomerSidebar(false));
            navigate("/search-products", { state: pathname });
          }}
        >
          <BiSearchAlt className="flex-shrink-0 text-xl" />
        </motion.div>
      )}

      {/* Showing Dashboard link only when logged in user is admin */}
      {userInfo?.role === "admin" && (
        <Link
          className="hover:text-neutral-400 text-[0.96rem] tracking-tight transition-all duration-300 max-[500px]:text-sm"
          to="/admin"
          onClick={() => {
            dispatch(setCustomerSidebar(false));
            dispatch(setCouponModal(false));
          }}
        >
          Dashboard
        </Link>
      )}

      <Link
        to="/products"
        className="hover:text-neutral-400 text-[0.96rem] tracking-tight transition-all duration-300 max-[500px]:text-sm"
        onClick={() => dispatch(setCustomerSidebar(false))}
      >
        Products
      </Link>

      {/* Not showing Login page once user has logged in */}
      {!token && (
        <Link
          to="/login"
          className="hover:text-neutral-400 text-[0.96rem] tracking-tight transition-all duration-300 max-[500px]:text-sm"
          onClick={() => dispatch(setCustomerSidebar(false))}
        >
          Sign In
        </Link>
      )}

      {/* Showing Wishlist page only when user has logged in */}
      {token && (
        <Link
          to="/wishlist"
          className="hover:text-neutral-400 text-[0.96rem] tracking-tight transition-all duration-300 max-[500px]:text-sm"
          onClick={() => dispatch(setCustomerSidebar(false))}
        >
          My Wishlist
        </Link>
      )}

      {/* Showing Orders page only when user has logged in */}
      {token && (
        <Link
          to="/orders"
          className="hover:text-neutral-400 text-[0.96rem] tracking-tight transition-all duration-300 max-[500px]:text-sm"
          onClick={() => dispatch(setCustomerSidebar(false))}
        >
          My Orders
        </Link>
      )}

      <Link
        to="/cart"
        className="hover:text-neutral-400 text-[0.96rem] tracking-tight transition-all duration-300"
        onClick={() => dispatch(setCustomerSidebar(false))}
      >
        <Badge
          badgeContent={totalProductsCount}
          color="primary"
          sx={{ fontSize: "0.2rem" }}
        >
          <ShoppingCartOutlinedIcon />
        </Badge>
      </Link>
    </div>
  );
};

export default memo(NavbarContent);
