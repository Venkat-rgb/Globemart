import { useSelector } from "react-redux";
import NavbarContent from "./NavbarContent";
import { memo } from "react";

const Sidebar = () => {
  const { isCustomerSidebarOpen } = useSelector(
    (state) => state?.customerSidebar
  );

  return (
    <NavbarContent
      styleProp={`mt-[50px] w-44 shadow-xl font-inter fixed z-40 h-[calc(100vh-48.375px)] bg-[#f1f1f1]/95 px-4 text-center flex items-center flex-col gap-7 pt-20 transition-all duration-300 ${
        isCustomerSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      placeOfUse="sidebar"
    />
  );
};

export default memo(Sidebar);
{
  {
    /* <div className="mt-14 w-44 shadow-xl font-inter fixed z-40 h-[90vh] bg-neutral-50 py-3 px-4 text-center space-y-4"></div> */
  }

  /* <motion.div
        className="flex items-center justify-center cursor-pointer"
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate("/search-products", { state: pathname })}
      >
        <BiSearchAlt className="flex-shrink-0 text-xl" />
      </motion.div>

      <motion.p
        className="cursor-pointer"
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.98 }}
      >
        {userInfo?.role === "admin" && (
          <Link
            className="hover:text-neutral-400 text-[0.96rem] tracking-tight transition-all duration-300"
            to="/admin"
            onClick={() => dispatch(setCouponModal(false))}
          >
            Dashboard
          </Link>
        )}
      </motion.p>

      <motion.p
        className="cursor-pointer text-[0.96rem] tracking-tight"
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link to="/products">Products</Link>
      </motion.p>

      <motion.p
        className="cursor-pointer text-[0.96rem] tracking-tight"
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.98 }}
      >
        My Wishlist
      </motion.p>

      <motion.p
        className="cursor-pointer text-[0.96rem] tracking-tight"
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.98 }}
      >
        My Orders
      </motion.p> */
}
