import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const useScrollToTop = () => {
  const { pathname } = useLocation();

  // Scrolling to the top of the screen when routes are changing
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return { pathname };
};

export default useScrollToTop;
