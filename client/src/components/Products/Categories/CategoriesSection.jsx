import { Slider } from "@mui/material";
import { motion } from "framer-motion";
import Select from "react-select";
import { FiChevronRight } from "react-icons/fi";
import { memo, useEffect, useState } from "react";
import { productCategories } from "../../../utils/general/productCategories";
import { sortCategories } from "../../../utils/general/sortCategories";
import useSessionStorage from "../../../hooks/basic/useSessionStorage";

/*
initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
*/

const CategoriesSection = ({
  page,
  setPage,
  setUrl,
  setFilters,
  selectedCategory,
  setSelectedCategory,
  currencyDataConversion,
}) => {
  const { getSessionData } = useSessionStorage();

  const userCurrency = getSessionData("userCurrency");

  // const userCurrency =
  //   sessionStorage.getItem("userCurrency") &&
  //   JSON.parse(sessionStorage.getItem("userCurrency"));

  // Calculating first and second price which is used for filtering through price
  const firstPrice = Number((50 / currencyDataConversion).toFixed(2)),
    secondPrice = Number((300000 / currencyDataConversion).toFixed(2));

  // Keeps track of price range which can help in price-wise sorting
  const [priceRange, setPriceRange] = useState([firstPrice, secondPrice]);

  // Keeps track of product rating sorting
  const [productRating, setProductRating] = useState(0);
  const [startPrice, setStartPrice] = useState(priceRange[0]);
  const [endPrice, setEndPrice] = useState(priceRange[1]);

  // Keeps track of type of sorting
  const [sort, setSort] = useState({ value: "-createdAt", label: "Newest" });

  // Sets the price range for the product
  const priceRangeHandler = (e, newValue) => {
    setPriceRange(newValue);
    setStartPrice(newValue[0]);
    setEndPrice(newValue[1]);
  };

  // Sets the start price of the product
  const startPriceHandler = (e) => {
    setPriceRange([+e.target.value, endPrice]);
    setStartPrice(+e.target.value);
  };

  // Sets the end price of the product
  const endPriceHandler = (e) => {
    setPriceRange([startPrice, +e.target.value]);
    setEndPrice(+e.target.value);
  };

  // Clears all the filters applied for the product
  const clearFiltersHandler = () => {
    setSelectedCategory("");
    setPriceRange([firstPrice, secondPrice]);
    setStartPrice(firstPrice);
    setEndPrice(secondPrice);
    setProductRating(0);
    setFilters("");
    setPage(1);
    setSort({ value: "-createdAt", label: "Newest" });
  };

  useEffect(() => {
    // Implementing debouncing for 200ms
    const timeout = setTimeout(() => {
      setUrl(selectedCategory, priceRange, productRating, page, sort.value);
    }, 200);
    return () => clearTimeout(timeout);
  }, [selectedCategory, priceRange, productRating, page, sort.value, setUrl]);

  return (
    <motion.div
      className="flex-1 shadow-lg rounded-md p-4 space-y-3"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-6">
          <p className="font-semibold text-lg text-neutral-500 underline underline-offset-4 font-public-sans decoration-neutral-300">
            Categories
          </p>

          {/* Clearing product filters */}
          <motion.button
            className="font-inter bg-neutral-100 rounded-md py-1 px-3 font-semibold text-neutral-400 text-sm max-[1230px]:text-xs max-[1230px]:whitespace-nowrap drop-shadow-md"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={clearFiltersHandler}
          >
            Clear Filters
          </motion.button>
        </div>

        {/* Displaying all the productCategories */}
        <div className="space-y-2">
          {productCategories?.map((category, i) => (
            <motion.p
              className={`flex items-center justify-between font-inter capitalize ${
                selectedCategory === category && "font-semibold"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              key={`${category}-${i}`}
              onClick={() => setSelectedCategory(category)}
            >
              <motion.span
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer"
              >
                {category}
              </motion.span>
              <FiChevronRight className="text-[1.2rem]" />
            </motion.p>
          ))}
        </div>
      </div>

      <div className="border-t pt-3 space-y-2">
        {/* Price range based on user location currency */}
        <p className="font-semibold text-lg text-neutral-500 underline underline-offset-4 font-public-sans decoration-neutral-300">
          Price ({userCurrency?.currency})
        </p>
        <Slider
          value={priceRange}
          onChange={priceRangeHandler}
          color="secondary"
          size="small"
          min={firstPrice}
          max={secondPrice}
        />

        {/* Entering start and end price */}
        <div className="flex items-center font-inter gap-4 justify-evenly ">
          <input
            type="number"
            // value={Number(
            //   (startPrice / currencyData?.conversion).toFixed(2)
            // )}
            value={startPrice}
            className="border w-20 text-center outline-none rounded-md text-sm py-1 px-2"
            onChange={startPriceHandler}
          />

          <input
            type="number"
            // value={Number((endPrice / currencyData?.conversion).toFixed(2))}
            value={endPrice}
            className="border w-20 text-center rounded-md outline-none text-sm py-1 px-2"
            onChange={endPriceHandler}
          />
        </div>
      </div>

      {/* Product Rating */}
      <div className="border-t pt-3 space-y-2">
        <p className="font-semibold text-lg text-neutral-500 underline underline-offset-4 font-public-sans decoration-neutral-300">
          Rating
        </p>
        <Slider
          value={productRating}
          onChange={(e, newRating) => setProductRating(newRating)}
          valueLabelDisplay="auto"
          min={0}
          max={5}
          step={0.1}
          size="small"
          color="secondary"
        />
      </div>

      {/* Product Sorting options */}
      <div className="border-t pt-3 space-y-2">
        <p className="font-semibold text-lg text-neutral-500 underline underline-offset-4 font-public-sans decoration-neutral-300">
          Sort
        </p>
        <Select
          options={sortCategories}
          placeholder="Select sort type..."
          className="font-inter"
          onChange={(newValue) => setSort(newValue)}
          value={sort}
        />
      </div>
    </motion.div>
  );
};

export default memo(CategoriesSection);

// const CategoriesSection = ({
//   selectedCategory,
//   setSelectedCategory,
//   clearFiltersHandler,
//   productCategories,
//   priceRange,
//   priceRangeHandler,
//   firstPrice,
//   secondPrice,
//   startPrice,
//   startPriceHandler,
//   endPrice,
//   endPriceHandler,
//   productRating,
//   setProductRating,
//   sortCategories,
//   sort,
//   setSort,
// }) => {
//   const userCurrency =
//     sessionStorage.getItem("userCurrency") &&
//     JSON.parse(sessionStorage.getItem("userCurrency"));

//   /*
// initial={{ opacity: 0, x: -10 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: i * 0.1 }}
// */

//   console.log("Categories rendered!");

//   return (
//     <motion.div
//       className="flex-1 shadow-lg rounded-md p-4 space-y-3"
//       initial={{ opacity: 0, x: -100 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ delay: 0.2 }}
//     >
//       <div className="space-y-4">
//         <div className="flex items-center justify-between gap-6">
//           <p className="font-semibold text-lg text-neutral-500 underline underline-offset-4 font-public-sans decoration-neutral-300">
//             Categories
//           </p>
//           <motion.button
//             className="font-inter bg-neutral-100 rounded-md py-1 px-3 font-semibold text-neutral-400 text-sm drop-shadow-md"
//             whileTap={{ scale: 0.95 }}
//             whileHover={{ scale: 1.05 }}
//             onClick={clearFiltersHandler}
//           >
//             Clear Filters
//           </motion.button>
//         </div>
//         <div className="space-y-2">
//           {productCategories.map((category, i) => (
//             <motion.p
//               className={`flex items-center justify-between font-inter capitalize ${
//                 selectedCategory === category && "font-semibold"
//               }`}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: i * 0.1 }}
//               key={i}
//               onClick={() => setSelectedCategory(category)}
//             >
//               <motion.span
//                 whileHover={{ scale: 1.07 }}
//                 whileTap={{ scale: 0.98 }}
//                 className="cursor-pointer"
//               >
//                 {category}
//               </motion.span>
//               <FiChevronRight className="text-[1.2rem]" />
//             </motion.p>
//           ))}
//         </div>
//       </div>
//       <div className="border-t pt-3 space-y-2">
//         <p className="font-semibold text-lg text-neutral-500 underline underline-offset-4 font-public-sans decoration-neutral-300">
//           Price ({userCurrency?.currency})
//         </p>
//         <Slider
//           value={priceRange}
//           onChange={priceRangeHandler}
//           color="secondary"
//           size="small"
//           min={firstPrice}
//           max={secondPrice}
//         />
//         <div className="flex items-center font-inter gap-4 justify-evenly ">
//           <input
//             type="number"
//             // value={Number(
//             //   (startPrice / currencyData?.conversion).toFixed(2)
//             // )}
//             value={startPrice}
//             className="border w-20 text-center outline-none rounded-md text-sm py-1 px-2"
//             onChange={startPriceHandler}
//           />

//           <input
//             type="number"
//             // value={Number((endPrice / currencyData?.conversion).toFixed(2))}
//             value={endPrice}
//             className="border w-20 text-center rounded-md outline-none text-sm py-1 px-2"
//             onChange={endPriceHandler}
//           />
//         </div>
//       </div>
//       <div className="border-t pt-3 space-y-2">
//         <p className="font-semibold text-lg text-neutral-500 underline underline-offset-4 font-public-sans decoration-neutral-300">
//           Rating
//         </p>
//         <Slider
//           value={productRating}
//           onChange={(e, newRating) => setProductRating(newRating)}
//           valueLabelDisplay="auto"
//           min={0}
//           max={5}
//           step={0.1}
//           size="small"
//           color="secondary"
//         />
//       </div>
//       <div className="border-t pt-3 space-y-2">
//         <p className="font-semibold text-lg text-neutral-500 underline underline-offset-4 font-public-sans decoration-neutral-300">
//           Sort
//         </p>
//         <Select
//           options={sortCategories}
//           placeholder="Select sort type..."
//           className="font-inter"
//           onChange={(newValue) => setSort(newValue)}
//           value={sort}
//         />
//       </div>
//     </motion.div>
//   );
// };
