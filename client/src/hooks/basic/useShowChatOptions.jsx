import { useLocation } from "react-router-dom";

const useShowChatOptions = () => {
  const { pathname } = useLocation();

  // Showing chatOptions only in these pages
  const enabledRoutes = ["/", "/products"];

  if (enabledRoutes.includes(pathname)) {
    return true;
  }

  if (pathname.startsWith("/product/")) {
    return true;
  }

  return false;
};

export default useShowChatOptions;
