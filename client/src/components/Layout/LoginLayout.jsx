import { motion } from "framer-motion";
import LazyImage from "../LazyImage";
import { useMediaQuery } from "@mui/material";

const LoginLayout = ({ image, children }) => {
  const matches = useMediaQuery("(max-width:500px)");

  const skeletonDimensions = matches ? 300 : 512;

  return (
    <div className="max-w-6xl flex items-center gap-10 mx-auto pt-20 px-8 max-[900px]:flex-wrap max-[900px]:justify-center max-[900px]:gap-7 max-[900px]:pb-6">
      <motion.div
        className="max-w-lg"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.2 }}
      >
        {/* <img
          src={image}
          className="object-cover"
          alt="login-register-image"
          // loading="lazy"
        /> */}

        <LazyImage
          imageProps={{
            src: image,
            alt: "login-register-image",
          }}
          skeletonWidth={skeletonDimensions}
          skeletonHeight={skeletonDimensions}
        />
      </motion.div>
      {children}
    </div>
  );
};

export default LoginLayout;
