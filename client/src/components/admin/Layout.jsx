import { useSelector } from "react-redux";
import useMediaQuery from "@mui/material/useMediaQuery";

const Layout = ({ children }) => {
  const { isSidebarOpen } = useSelector((state) => state?.sidebar);
  const matches = useMediaQuery("(min-width:1100px)");

  // className={`max-[1024px]:ml-0 ml-52 p-2.5 pt-16`}
  return (
    <div
      className={`${isSidebarOpen && matches ? "ml-52" : "ml-0"} p-2.5 pt-16`}
    >
      {children}
    </div>
  );
};

export default Layout;
