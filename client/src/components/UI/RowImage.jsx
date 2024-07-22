import LazyImage from "../LazyImage";

const RowImage = ({ title = "", image = "" }) => {
  // Image displayed with text for each row inside table
  return (
    <div className="flex items-center gap-5">
      <div className="flex-shrink-0 rounded-md w-[47px] h-[45px]">
        <LazyImage
          imageProps={{
            src: image,
            alt: title,
          }}
          styleProp="drop-shadow-md rounded-md"
          skeletonWidth={47}
          skeletonHeight={45}
        />
      </div>
      <span className="line-clamp-1">{title}</span>
    </div>
  );
};

export default RowImage;
