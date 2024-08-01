import { Rating } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

const NearbyStore = ({
  id,
  storeName,
  address,
  categories,
  ratingInfo,
  distance,
  storeCoordinates,
  selectedStoreInfo,
  storeInfoHandler,
}) => {
  const matches = useMediaQuery("(max-width:650px)");

  const selectNearbyStoreHandler = () => {
    if (matches) {
      window.scrollTo(0, 0);
    }

    storeInfoHandler({ storeCoordinates, storeName, distance, id });
  };

  return (
    <div
      className={`${
        selectedStoreInfo?.id === id ? "bg-neutral-700" : "bg-white"
      } shadow-lg rounded-xl p-4 space-y-2 cursor-pointer transition-all duration-150`}
      onClick={selectNearbyStoreHandler}
    >
      {/* Displaying store name */}
      <p
        className={`${
          selectedStoreInfo?.id === id
            ? "text-[#f1f1f1]"
            : "text-neutral-700/90"
        } text-lg font-semibold line-clamp-2 drop-shadow`}
      >
        {storeName}
      </p>

      {/* Displaying store categories */}
      <div className="flex items-center gap-2 flex-wrap font-medium">
        {categories?.map((category, i) => (
          <p
            className={`${
              selectedStoreInfo?.id === id
                ? "bg-white text-neutral-800"
                : "bg-black/70 text-[#f1f1f1]/95"
            } capitalize text-sm py-0.5 px-1.5 rounded shadow-md`}
            key={i}
          >
            {category}
          </p>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {/* Displaying store rating */}
        <div className="flex items-center gap-1">
          <p
            className={`${
              selectedStoreInfo?.id === id
                ? "text-[#f1f1f1]"
                : "text-neutral-400/80"
            } font-semibold text-[0.94rem]`}
          >
            {ratingInfo?.rating}
          </p>

          <Rating
            size="small"
            value={ratingInfo?.rating}
            precision={0.5}
            readOnly
          />
        </div>

        <span
          className={`${
            selectedStoreInfo?.id === id
              ? "text-[#f1f1f1]/90"
              : "text-neutral-400"
          }`}
        >
          •
        </span>

        {/* Displaying store reviews */}
        <div>
          <p
            className={`${
              selectedStoreInfo?.id === id
                ? "text-[#f1f1f1]"
                : "text-neutral-500/80"
            } font-semibold text-[0.94rem]`}
          >
            {ratingInfo?.reviewsCount} (reviews)
          </p>
        </div>
      </div>

      {/* Displaying store address */}
      <p
        className={`${
          selectedStoreInfo?.id === id
            ? "text-[#f1f1f1]/60"
            : "text-neutral-400"
        } text-sm`}
      >
        {address}
      </p>

      {/* Displaying distance from your location to store in KM */}
      <p className="text-sm">
        <span
          className={`${
            selectedStoreInfo?.id === id
              ? "text-[#f1f1f1]/90"
              : "text-neutral-500"
          } font-medium pr-1`}
        >
          Distance from your location{" "}
        </span>
        <span
          className={`${
            selectedStoreInfo?.id === id
              ? "bg-white text-black/70"
              : "bg-black/70 text-[#f1f1f1]"
          } font-semibold px-1.5 py-0.5 rounded text-xs`}
        >
          {distance} KM
        </span>
      </p>
    </div>
  );
};

export default NearbyStore;
