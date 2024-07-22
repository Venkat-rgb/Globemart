import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import LazyImage from "../../LazyImage";
import { memo, useState } from "react";

const ProductImages = ({ images }) => {
  // Keeps track of product sub images index number
  const [imgIndex, setImgIndex] = useState(0);

  return (
    <div className="space-y-3">
      <div className="w-full rounded-xl max-h-96 border overflow-hidden relative">
        {/* Main product image with zoom-in, zoom-out, move features */}
        <TransformWrapper minScale={0.7}>
          <TransformComponent>
            <LazyImage
              imageProps={{
                src: images && images[imgIndex]?.url,
                alt: `product-img-${images && images[imgIndex]?._id}`,
              }}
              skeletonWidth={566}
              skeletonHeight={384}
            />
          </TransformComponent>
        </TransformWrapper>
        <p className="absolute top-2 right-2 text-[0.7rem] text-black/30">
          Zoom In, Out, Move
        </p>
      </div>

      {/* Showing all sub images of main image */}
      {images && images?.length > 1 && (
        <div className="w-full">
          <div className="flex items-center gap-10 max-[1050px]:gap-6 max-[600px]:gap-5 max-[500px]:gap-2.5 max-[500px]:overflow-x-scroll">
            {images?.map((image, i) => (
              <div
                className="w-28 h-28 max-[500px]:min-w-[80px] max-[500px]:h-[85px] cursor-pointer rounded-xl"
                key={image?._id}
                onClick={() => setImgIndex(i)}
              >
                <LazyImage
                  imageProps={{
                    src: image?.url,
                    alt: `product-img-${image?._id}`,
                  }}
                  styleProp="border rounded-xl"
                  skeletonHeight={112}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ProductImages);
