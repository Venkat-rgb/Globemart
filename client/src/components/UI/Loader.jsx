import Lottie from "lottie-react";
import Circles from "../../assets/loader.json";

const Loader = ({ styleProp = "", dimensions = "w-24 h-24" }) => {
  return (
    <div className={styleProp}>
      <Lottie animationData={Circles} className={dimensions} />
    </div>
  );
};

export default Loader;
