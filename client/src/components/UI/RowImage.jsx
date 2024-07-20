import LazyImage from "../LazyImage";

const RowImage = ({ title = "", image = "" }) => {
  // Image displayed with text for each row inside table
  return (
    <div className="flex items-center gap-5">
      <div className="flex-shrink-0 rounded-md w-[47px] h-[45px]">
        {/* <Avatar
          src={image}
          alt={title}
          sx={{
            width: 45,
            height: 45,
            cursor: "pointer",
          }}
          className="drop-shadow-md"
          variant="rounded"
        /> */}

        <LazyImage
          imageProps={{
            src: image,
            alt: title,
          }}
          styleProp="drop-shadow-md rounded-md"
          skeletonWidth={47}
          skeletonHeight={45}
        />

        {/* <LazyImage
          imageProps={{
            src: image,
            alt: title,
            className: `cursor-pointer drop-shadow-md rounded w-[45px] h-[45px] object-cover`,
          }}
          skeletonWidth={45}
          skeletonHeight={45}
          placeOfUse="Dashboard"
        /> */}
      </div>
      <span className="line-clamp-1">{title}</span>
    </div>
  );
};

export default RowImage;
