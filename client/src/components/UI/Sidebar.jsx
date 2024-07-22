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
