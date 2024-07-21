import { MetaData } from "../components";
import { useSelector } from "react-redux";
import { BsFillChatDotsFill } from "react-icons/bs";
import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LandingPage from "../components/LandingPage";
import Benefits from "../components/Benefits/Benefits";
import FeaturedProducts from "../components/Products/FeaturedProducts";
import ErrorBoundaryComponent from "../components/ErrorBoundary/ErrorBoundaryComponent";
import { useRef } from "react";

const Home = () => {
  const featuredProductsRef = useRef(null);

  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state?.auth);

  return (
    <div className={`pt-28 pb-16 space-y-32 max-w-7xl mx-auto px-4 relative`}>
      <MetaData title="Home" />

      <LandingPage featuredProductsRef={featuredProductsRef} />

      {/* Showing ChatIcon only if user's role is not admin */}
      {userInfo?.username && userInfo?.role !== "admin" && (
        <Tooltip
          title="Have any queries? Chat with us!"
          placement="left-start"
          arrow
        >
          <div
            className="fixed z-50 bottom-9 right-14 max-[1024px]:right-7 bg-[#f1f1f1] rounded-t-full rounded-br-full p-3 cursor-pointer"
            style={{ boxShadow: "0px 0px 30px rgba(0,0,0,0.3)" }}
            onClick={() => navigate("/chat")}
          >
            <BsFillChatDotsFill className="text-[2rem] cursor-pointer max-[640px]:text-[1.5rem]" />
          </div>
        </Tooltip>
      )}

      {/* Showing all benefits of the ecommerce */}
      <Benefits />

      {/* Showing Top Featured Products and handling synchronous errors using error boundary */}
      <ErrorBoundaryComponent errorMessage="We're experiencing difficulties loading the Featured Products. Please try again later!">
        <FeaturedProducts featuredProductsRef={featuredProductsRef} />
      </ErrorBoundaryComponent>
    </div>
  );
};

export default Home;
