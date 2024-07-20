import { BsStars } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { setCouponModal } from "../../redux/features/slices/couponSlice";
import { RxCross2 } from "react-icons/rx";
import { memo } from "react";

const CouponModal = ({ couponText = "" }) => {
  const dispatch = useDispatch();

  return (
    <div className="bg-indigo-600 py-1.5 relative flex items-center justify-center">
      <div className="flex items-center gap-4 px-2">
        <BsStars style={{ color: "#f1f1f1", flexShrink: 0 }} />
        <p className="text-white font-inter text-sm text-center max-[500px]:text-xs">
          {couponText}
        </p>
        <BsStars style={{ color: "#f1f1f1", flexShrink: 0 }} />
      </div>

      <div
        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
        onClick={() => dispatch(setCouponModal(false))}
      >
        <RxCross2 className="text-white text-xl" />
      </div>
    </div>
  );
};

export default memo(CouponModal);
