import { useNavigate } from "react-router-dom";
import LazyImage from "../LazyImage";

const SearchCard = ({ title, description, image, id }) => {
  const navigate = useNavigate();

  return (
    <>
      <div
        className="flex items-center justify-center gap-4 cursor-pointer"
        onClick={() => navigate(`/product/${id}`)}
      >
        {/* Product image */}
        <div className="w-20 h-[60px] border border-gray-100 rounded-md flex-shrink-0">
          {/* <LazyImage
            imageProps={{
              src: image,
              alt: `product-image-${id}`,
              className: "rounded w-full h-full object-cover",
            }}
            skeletonWidth={80}
            skeletonHeight={60}
            placeOfUse="SearchCard"
          /> */}
          <LazyImage
            imageProps={{
              src: image,
              alt: `product-image-${id}`,
              // className: "rounded w-full h-full object-cover",
            }}
            styleProp="rounded-md"
            skeletonWidth={80}
            skeletonHeight={60}
            // placeOfUse="SearchCard"
          />
        </div>

        {/* Product title and description */}
        <div className="space-y-1">
          <p className="line-clamp-1 text-sm font-semibold text-neutral-600">
            {title}
          </p>
          <p className="line-clamp-2 text-[0.75rem] text-neutral-500">
            {description}
          </p>
        </div>
      </div>
      <hr />
    </>
  );
};

export default SearchCard;
