import EcommerceImage from "../assets/images/basic/ecommerce-image.jpg";
import { BiChevronsDown } from "react-icons/bi";
import { motion } from "framer-motion";
import LazyImage from "./LazyImage";
import Button from "./UI/Button";
import { useMediaQuery } from "@mui/material";

const LandingPage = ({ featuredProductsRef }) => {
  const matches = useMediaQuery("(max-width:500px)");

  const skeletonDimensions = matches ? 250 : 450;

  // Scrolling to featured products section
  const handleClick = () => {
    window.scrollTo({
      top: featuredProductsRef?.current?.offsetTop,
      behavior: "smooth",
    });
  };

  return (
    <header className="relative flex items-center gap-4 w-full mt-11 max-[1024px]:mt-0 max-[1024px]:flex-wrap-reverse max-[1024px]:justify-center">
      <div className="space-y-10 max-[1024px]:space-y-7 font-inter w-1/2 max-[1024px]:w-full max-[1024px]:px-5 max-[550px]:px-2">
        <p className="font-bold text-4xl max-[550px]:text-[1.45rem] max-[550px]:leading-8 max-[1024px]:text-3xl text-neutral-700 drop-shadow">
          Your Ultimate Shopping Hub for Everything You Need
        </p>

        <p className="text-lg max-[550px]:text-base drop-shadow">
          Shopping is a bit of a relaxing hobby for me, which is sometimes
          troubling for the bank balance. Explore our vast collection and
          indulge in the joy of finding the perfect items at irresistible
          prices.
        </p>

        <Button
          moreStyles="gap-2 hover:bg-white hover:text-black border border-neutral-500 max-[550px]:w-full"
          onClick={handleClick}
        >
          <span className="font-medium max-[550px]:text-sm">Shop Now</span>
          <motion.span
            initial={{ opacity: 1, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              repeat: Infinity,
              duration: 0.7,
              repeatType: "reverse",
            }}
          >
            <BiChevronsDown className="text-xl" />
          </motion.span>
        </Button>
      </div>

      {/* Landing page image */}

      <div className="max-w-1/2 h-[415px] max-[1024px]:max-w-[80%] max-[550px]:w-full max-[1024px]:h-auto">
        <LazyImage
          imageProps={{
            src: EcommerceImage,
            alt: "landing-page-image",
          }}
          skeletonVariant="circular"
          skeletonWidth={skeletonDimensions}
          skeletonHeight={skeletonDimensions}
        />
      </div>
    </header>
  );
};

export default LandingPage;
