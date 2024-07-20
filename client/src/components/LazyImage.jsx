import { useState } from "react";
import Skeleton from "@mui/material/Skeleton";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
import DummyProfile from "../assets/images/basic/dummy-profile.jpg";

const LazyImage = ({
  imageProps,
  // skeletonWidth,
  skeletonHeight,
  styleProp = "",
  skeletonVariant = "rounded",
}) => {
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  const { src, alt } = imageProps;

  // flex items-center justify-center

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

// <div className={`relative w-[${skeletonWidth}px] h-[${skeletonHeight}px]`}>
//       {!isImgLoaded && (
//         <Skeleton
//           animation="wave"
//           variant={skeletonVariant}
//           width="100%"
//           height={skeletonHeight}
//           className="absolute inset-0"
//         />
//       )}

//       <img
//         src={src ? src : DummyProfile}
//         alt={alt}
//         className={`w-full overflow-hidden ${styleProp} object-cover transition-all duration-1000 cursor-pointer ${
//           isImgLoaded ? "opacity-100" : "opacity-0"
//         }`}
//         onLoad={() => setIsImgLoaded(true)}
//       />
//     </div>

// {
/* <img
        {...imageProps}
        className={`w-full ${styleProp} absolute inset-0 object-cover transition-all duration-1000 cursor-pointer ${
          isImgLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setIsImgLoaded(true)}
      /> */
// }

// {
/* { && !isLoading ? (
        <img {...imageProps} loading="lazy" />
      ) : (
        )} */
// }

// const LazyImage = ({
//   imageProps,
//   placeOfUse,
//   skeletonWidth,
//   skeletonHeight,
//   isLoading,
// }) => {
//   const [inView, setInView] = useState(false);
//   const ref = useRef(null);

//   const callback = ([entry]) => {
//     if (entry.isIntersecting) {
//       setInView(true);
//     }
//   };

//   useEffect(() => {
//     const observer = new IntersectionObserver(callback, {
//       rootMargin: placeOfUse ? "-20px" : "-100px",
//     });

//     if (ref?.current) {
//       observer.observe(ref.current);
//     }

//     return () => observer.disconnect();

//     // return () => {
//     //   if (ref?.current) {
//     //     observer.unobserve(ref.current);
//     //   }
//     // };
//   }, []);

//   return (
//     <>
//       {inView && !isLoading ? (
//         <img {...imageProps} loading="lazy" />
//       ) : (
//         <Skeleton
//           ref={ref}
//           animation="wave"
//           variant="rectangular"
//           width="100%"
//           height={skeletonHeight}
//         />
//       )}
//     </>
//   );
// };

// export default LazyImage;

/*
<Skeleton
          ref={ref}
          animation="wave"
          variant="rectangular"
          sx={{
            width: "100%",
            height: "100%",
          }}
        />


*/
