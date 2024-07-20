import LazyImage from "../LazyImage";
import moment from "moment";
import GradeIcon from "@mui/icons-material/Grade";
import { Rating } from "@mui/material";

const ReviewItem = ({ image, alt, customerName, time, rating, review }) => {
  return (
    <div className="flex items-start gap-4 max-[500px]:gap-3 border-b pb-3">
      {/* Reviewed customer profileImg */}
      <div className="flex-shrink-0 w-14 h-14 max-[500px]:w-12 max-[500px]:h-12 rounded-full border overflow-hidden">
        <LazyImage
          imageProps={{
            src: image,
            alt,
          }}
          styleProp="rounded-full"
          skeletonVariant="circular"
          skeletonWidth={56}
          skeletonHeight={56}
        />

        {/* <LazyImage
          imageProps={{
            src: image,
            alt,
            className: "object-cover rounded-full w-full h-full",
          }}
          skeletonWidth={64}
          skeletonHeight={64}
          placeOfUse="Product"
        /> */}
      </div>

      <div className="font-inter space-y-1.5">
        <p className="text-neutral-500 font-medium tracking-tight">
          <span className="font-semibold max-[500px]:text-[0.9rem]">
            {customerName} •
          </span>

          {/* Time when he posted the review of product */}
          <span className="pl-2 text-[0.8rem]">{moment(time).fromNow()}</span>
        </p>
        {/* <ReactStars
          count={5}
          isHalf={true}
          edit={false}
          value={rating}
          emptyIcon={<FaRegStar />}
          halfIcon={<FaStarHalfAlt />}
          filledIcon={<FaStar />}
          activeColor="#ffd700"
        /> */}

        {/* Customer Rating */}
        <Rating
          value={rating ? rating : 0}
          precision={0.5}
          readOnly
          emptyIcon={<GradeIcon style={{ opacity: 0.5 }} fontSize="inherit" />}
          size="small"
        />

        {/* Review text */}
        <p className="text-neutral-600 leading-relaxed text-[0.92rem] max-[500px]:text-sm">
          {review}
        </p>
      </div>
    </div>
  );
};

export default ReviewItem;
