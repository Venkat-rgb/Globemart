import { motion } from "framer-motion";

const ProductFeatures = ({ description, productFeatures }) => {
  const formattedFeatures = productFeatures
    ?.split("\r\n")
    ?.map((feature) => feature.split(":"));

  return (
    <motion.div
      className="max-w-4xl mx-auto space-y-8 py-4 px-2 max-[500px]:py-1"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ delay: 0.1 }}
    >
      {/* Showing product description */}
      <p className="leading-loose font-inter text-neutral-500 font-medium border-b pb-10">
        {description}
      </p>

      <div className="space-y-5">
        <p className="font-public-sans text-center text-xl drop-shadow font-semibold text-neutral-600">
          About this item
        </p>

        {/* Showing all Features of the product */}
        <div className="space-y-4">
          {formattedFeatures?.map((feature, i) => (
            <div key={i}>
              <span className="leading-loose font-public-sans text-neutral-600 font-bold">
                {feature[0]} :
              </span>
              <span className="leading-loose font-inter text-neutral-500 font-medium">
                {feature[1]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductFeatures;
