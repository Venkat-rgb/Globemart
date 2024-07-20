import Lottie from "lottie-react";
import NotFoundGif from "../assets/pageNotFound.json";
import MetaData from "../components/MetaData";

const NotFound = () => {
  // Displaying Gif if no valid page is found
  return (
    <div
      style={{ height: "calc(100vh - 52.375px)" }}
      className="flex items-center justify-center"
    >
      <MetaData title="404" />
      <Lottie
        animationData={NotFoundGif}
        className="w-2/3 max-[500px]:w-full"
        loop={false}
      />
    </div>
  );
};

export default NotFound;
