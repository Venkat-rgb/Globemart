import { motion } from "framer-motion";
import numeral from "numeral";
import LazyImage from "../../LazyImage";
import RevenueIcon from "../../../assets/images/basic/revenueImage.jpg";

const TotalRevenue = ({ statsData }) => {
  // Calculating today's sales
  const todaySales = numeral(statsData?.todaySales[0]?.sales).format("0.0a");

  // Calculating last week sales
  const lastWeekSales = statsData?.pastWeekSales?.reduce(
    (acc, item) => acc + item?.sales,
    0
  );

  return (
    <div className="p-3 drop-shadow-xl h-auto rounded-xl bg-neutral-50 md:col-span-2 space-y-3">
      <div className="flex items-center flex-col space-y-2">
        <p className="font-semibold font-inter text-neutral-500">
          Total Revenue
        </p>

        {/* Total Revenue image */}
        <div className="max-w-xs h-full">
          <LazyImage
            imageProps={{
              src: RevenueIcon,
              alt: "revenue-img",
            }}
            styleProp="rounded-xl"
            skeletonWidth={320}
            skeletonHeight={200}
          />
        </div>
      </div>
      <div className="flex items-center justify-around gap-4">
        {/* Showing today sales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 0.3 }}
          className="space-y-1"
        >
          <p className="font-inter text-sm">Today</p>
          <p className="font-inter text-neutral-500 text-lg">
            {`₹${todaySales}`}
          </p>
        </motion.div>

        {/* Showing last week sales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 0.5 }}
          className="space-y-1"
        >
          <p className="font-inter text-sm">Last Week</p>
          <p className="font-inter text-neutral-500 text-lg">{`₹${numeral(
            lastWeekSales
          ).format("0.0a")}`}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default TotalRevenue;
