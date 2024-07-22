import { useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import DummyProfile from "../assets/images/basic/dummy-profile.jpg";

const LazyImage = ({
  imageProps,
  skeletonHeight,
  styleProp = "",
  skeletonVariant = "rounded",
}) => {
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  const { src, alt } = imageProps;

  return (
    <div className={`relative w-full h-full`}>
      {!isImgLoaded && (
        <Skeleton
          animation="wave"
          variant={skeletonVariant}
          width="100%"
          height={skeletonHeight}
          className="absolute inset-0"
          style={{ backgroundColor: "#f0f0f0" }}
        />
      )}

      <img
        src={src ? src : DummyProfile}
        alt={alt}
        className={`w-full h-full ${styleProp} object-cover transition-all duration-1000 cursor-pointer ${
          isImgLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setIsImgLoaded(true)}
      />
    </div>
  );
};

export default LazyImage;
