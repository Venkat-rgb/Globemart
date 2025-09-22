import { MetaData } from "../components";
import LandingPage from "../components/LandingPage";
import Benefits from "../components/Benefits/Benefits";
import FeaturedProducts from "../components/Products/FeaturedProducts";
import ErrorBoundaryComponent from "../components/ErrorBoundary/ErrorBoundaryComponent";
import { useRef } from "react";

const Home = () => {
  const featuredProductsRef = useRef(null);

  return (
    <div className={`pt-28 pb-16 space-y-32 max-w-7xl mx-auto px-4 relative`}>
      <MetaData title="Home" />

      {/* Landing Page */}
      <LandingPage featuredProductsRef={featuredProductsRef} />

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
