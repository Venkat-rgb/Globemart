import { FaShopify } from "react-icons/fa";
import { Link } from "react-router-dom";
import { memo } from "react";

const Logo = () => {
  return (
    <Link to="/">
      <div className="flex items-center gap-4 flex-shrink-0">
        <FaShopify className="text-[1.5rem] max-[500px]:text-[1.4rem] text-indigo-500" />
        <p className="font-bold tracking-tight italic text-xl text-neutral-500 max-[500px]:text-lg">
          Globemart
        </p>
      </div>
    </Link>
  );
};

export default memo(Logo);
