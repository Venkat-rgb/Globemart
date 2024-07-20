import { NavLink } from "react-router-dom";
import { sidebarCategories } from "../../utils/dashboard/sidebarCategories";
import { useDispatch, useSelector } from "react-redux";
import { setSideBar } from "../../redux/features/slices/adminSidebarSlice";
import { useMediaQuery } from "@mui/material";

const Sidebar = () => {
  const { isSidebarOpen } = useSelector((state) => state?.sidebar);
  const dispatch = useDispatch();
  const matches = useMediaQuery(`(max-width:1100px)`);

  // className={`w-52 fixed left-0 top-[3.1rem] transition-all duration-300 h-full border-r pl-3 pt-5 space-y-9 bg-white z-50  ${
  //   isSidebarOpen ? "translate-x-0" : "max-[1024px]:-translate-x-full"
  // } `}

  return (
    <div
      className={`w-52 fixed left-0 top-[2.8rem] transition-all duration-300 border-r pl-3 pt-5 space-y-9 bg-white z-40 h-full ${
        isSidebarOpen ? "translate-x-0 overflow-y-scroll" : "-translate-x-full"
      } `}
    >
      {/* Admin dashboard sidebar categories  */}
      {sidebarCategories.map((category) => (
        <NavLink
          key={category.url}
          to={category.url}
          className="flex items-center gap-4 py-2 hover:bg-neutral-200  transition-all duration-200 rounded-l-md"
          // closing the sidebar onClick only when screen size is less than 1100px
          onClick={() =>
            isSidebarOpen && matches && dispatch(setSideBar(false))
          }
        >
          <div className="flex-shrink-0 pl-2">{category.icon}</div>
          <p className="font-inter text-sm">{category.title}</p>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
