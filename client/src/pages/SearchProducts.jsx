import { useCallback, useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { motion } from "framer-motion";
import {
  useLazyGetProductsByVoiceSearchQuery,
  useLazyGetSearchedProductsQuery,
} from "../redux/features/products/productsApiSlice";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { BiSearchAlt } from "react-icons/bi";
import SearchCard from "../components/Search/SearchCard";
import VoiceSearch from "../components/Search/VoiceSearch/VoiceSearch";
import ErrorBoundaryComponent from "../components/ErrorBoundary/ErrorBoundaryComponent";
import { MetaData, SmallLoader } from "../components";
import ErrorUI from "../components/UI/ErrorUI";

const SearchProducts = () => {
  // Keeps track of product name searched by user
  const [searchText, setSearchText] = useState("");

  // Keeps track of products available for that search text
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { state } = useLocation();

  const [
    getProducts,
    { isFetching: isProductsFetching, isError: productsError },
  ] = useLazyGetSearchedProductsQuery();

  const [
    getProductsByVoiceSearch,
    {
      isFetching: isVoiceSearchProductsFetching,
      isError: voiceSearchProductsError,
    },
  ] = useLazyGetProductsByVoiceSearchQuery();

  const setProductsHandler = useCallback((products) => {
    setProducts(products);
  }, []);

  // Fetching products based on product name
  const getSearchedProducts = async () => {
    try {
      const filters = `?search=${searchText}&fields=title,description`;
      const productsRes = await getProducts(filters).unwrap();
      setProducts(productsRes?.products);
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  // Implementing Debouncing for 200ms
  useEffect(() => {
    let timer = "";
    if (searchText?.trim()) {
      timer = setTimeout(() => {
        getSearchedProducts();
      }, 200);
    }
    return () => timer && clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  return (
    <div className="fixed bg-neutral-100 z-50 inset-0 font-inter h-full overflow-y-scroll">
      <MetaData title="Search Products" />
      <div className="relative">
        <div
          className="absolute right-10 max-[500px]:right-5 bg-white p-1 rounded-full shadow-md cursor-pointer z-20"
          onClick={() => navigate(state ? state : "/")}
        >
          <RxCross2 className="text-[1.7rem] max-[500px]:text-[1.3rem] rounded-full cursor-pointer" />
        </div>

        <div className="max-w-2xl mx-auto my-10 space-y-6 w-full">
          <p className="text-center text-2xl text-neutral-500 font-public-sans drop-shadow font-semibold max-[500px]:text-xl">
            Search Products
          </p>

          <div className="flex items-start justify-center gap-10 max-[700px]:flex-wrap-reverse max-[700px]:px-2 max-[700px]:gap-7">
            <div className="space-y-6 w-full">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{
                  delay: 0.2,
                }}
                className="flex items-center gap-3 py-2 px-4 bg-white rounded-lg shadow-lg"
              >
                <BiSearchAlt className="text-[1.3rem] text-neutral-500" />
                <input
                  type="text"
                  className="outline-none w-full"
                  placeholder="Search for products..."
                  onChange={(e) => setSearchText(e.target.value)}
                  value={searchText}
                />
              </motion.div>

              {/* Showing Loader while products are getting loaded */}
              {(isProductsFetching || isVoiceSearchProductsFetching) && (
                <div className="flex justify-center w-full">
                  <SmallLoader />
                </div>
              )}

              {/* Showing errorMsg, if an error occured during searching products */}
              {(productsError || voiceSearchProductsError) && (
                <ErrorUI message="Unable to fetch searched products!" />
              )}

              {/* Showing products once they are loaded successfully */}
              {(!isProductsFetching || !isVoiceSearchProductsFetching) &&
                products?.length > 0 && (
                  <motion.div
                    className="space-y-3 bg-white shadow-md rounded-lg p-3"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{
                      delay: 0.3,
                    }}
                  >
                    {products?.map((product) => (
                      <SearchCard
                        key={product?._id}
                        id={product?._id}
                        title={product?.title}
                        description={product?.description}
                        image={product?.images[0]?.url}
                      />
                    ))}
                  </motion.div>
                )}

              {/* No Products available for your search */}
              {!isProductsFetching &&
                !productsError &&
                !voiceSearchProductsError &&
                searchText &&
                products?.length === 0 && (
                  <p className="text-xl max-[500px]:text-base text-center font-medium text-neutral-500">
                    Products not found, Please modify your search!
                  </p>
                )}
            </div>

            <div>
              <ErrorBoundaryComponent
                errorMessage="We're sorry, you can't use voice feature at the moment due to some error, Please try again later."
                styles="w-[200px] text-sm"
              >
                <VoiceSearch
                  setProductsHandler={setProductsHandler}
                  getProductsByVoiceSearch={getProductsByVoiceSearch}
                />
              </ErrorBoundaryComponent>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchProducts;
