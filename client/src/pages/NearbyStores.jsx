import { useParams } from "react-router-dom";
import { useGetNearbyStoresMutation } from "../redux/features/nearbyStores/nearbyStoresApiSlice";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Pagination } from "@mui/material";
import MetaData from "../components/MetaData";
import NearbyStore from "../components/NearbyStores/NearbyStore";
import StoresMap from "../components/NearbyStores/StoresMap";
import useSessionStorage from "../hooks/basic/useSessionStorage";
import PageTransistion from "../components/UI/PageTransistion";
import { SmallLoader } from "../components";

const NearbyStores = () => {
  // Getting product category from url
  const { category } = useParams();

  // Keeps track of all the nearby stores available near users's location
  const [stores, setStores] = useState([]);

  // Keeps track of count of total number of stores available nearby
  const [storesTotalCount, setStoresTotalCount] = useState(0);

  // Pagination of stores
  const [page, setPage] = useState(1);

  // Stores the selected store information
  const [selectedStoreInfo, setSelectedStoreInfo] = useState(null);

  const { getSessionData } = useSessionStorage();

  // const userLocation =
  //   sessionStorage.getItem("userLocation") &&
  //   JSON.parse(sessionStorage.getItem("userLocation"));

  // Getting userLocation
  const userLocation = getSessionData("userLocation");

  const memoizedUserLocation = useMemo(() => {
    return {
      latitude: userLocation?.latitude,
      longitude: userLocation?.longitude,
    };
  }, [userLocation?.latitude, userLocation?.longitude]);

  const [getNearbyStores, { isLoading: isStoresDataLoading }] =
    useGetNearbyStoresMutation();

  // Getting all the stores which are nearby you
  const getStores = async () => {
    try {
      const storesRes = await getNearbyStores({
        latitude: userLocation?.latitude,
        longitude: userLocation?.longitude,
        category,
        page,
      }).unwrap();

      setStores(storesRes?.stores);
      setStoresTotalCount(storesRes?.totalStores);
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  // Setting store info when user selects particular store
  const storeInfoHandler = (storeInfo) => {
    const { storeCoordinates, name, distance, id } = storeInfo;

    setSelectedStoreInfo({
      coordinates: storeCoordinates,
      name,
      distance,
      id,
    });
  };

  useEffect(() => {
    // If userLocation contains latitude and longitude then only we will get stores
    if (userLocation) {
      getStores();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // className="w-full pt-[3.34rem] h-full font-inter"

  return (
    <PageTransistion styleProp="w-full h-full font-inter">
      {/* <section className="w-full pt-[3.34rem] h-full font-inter"> */}
      <MetaData title="Nearby-Stores" />
      <div className="grid grid-cols-10 max-[650px]:grid-cols-1 sm:h-full max-w-[86rem] mx-auto">
        <div className="border-r col-span-3 max-[900px]:col-span-4 max-[650px]:col-span-1 max-[650px]:order-2 px-4 space-y-4 max-[550px]:space-y-2.5 overflow-y-scroll">
          <div className="pt-4">
            <p className="text-xl text-center font-bold text-neutral-500/80 font-public-sans">
              Nearby Stores To You
            </p>
          </div>

          {/* If stores are loading then showing loader */}
          {isStoresDataLoading && (
            <div className="flex items-center justify-center h-1/2">
              <SmallLoader />
            </div>
          )}

          {/* Displaying all stores to user */}

          {!isStoresDataLoading && storesTotalCount > 1 && (
            <div className="space-y-4 pb-5">
              {stores?.map((store) => (
                <NearbyStore
                  key={store?._id}
                  id={store?._id}
                  name={store?.name}
                  address={store?.address}
                  categories={store?.categories}
                  ratingInfo={store?.ratingInfo}
                  distance={store?.distanceInKM}
                  storeCoordinates={[
                    store?.location?.coordinates[1],
                    store?.location?.coordinates[0],
                  ]}
                  selectedStoreInfo={selectedStoreInfo}
                  storeInfoHandler={storeInfoHandler}
                />
              ))}
            </div>
          )}

          {/* Displaying only 6 stores per page */}
          {!isStoresDataLoading && storesTotalCount > 6 && (
            <div className="flex items-center justify-center pb-4">
              <Pagination
                count={Math.ceil(storesTotalCount / 6)}
                page={page}
                onChange={(e, value) => setPage(value)}
              />
            </div>
          )}

          {/* Showing message, if we dont find any store with particular category */}
          {!isStoresDataLoading && stores?.length === 0 && (
            <p className="font-medium text-lg max-[550px]:text-base text-neutral-500 text-center pt-10 max-[550px]:pt-4">
              Sorry we couldn&apos;t find any stores of category: &apos;
              {category}&apos; nearby!
            </p>
          )}
        </div>

        {/* Displaying the selected store on the map */}
        <div className="col-span-7 max-[900px]:col-span-6 max-[650px]:col-span-1 max-[650px]:order-1 w-full h-[90vh] max-[650px]:h-[40vh] z-0">
          <StoresMap
            userCoordinates={memoizedUserLocation}
            storeInfo={selectedStoreInfo}
          />
        </div>
      </div>
      {/* </section> */}
    </PageTransistion>
  );
};

export default NearbyStores;

// const NearbyStores = () => {
//   // Getting product category from url
//   const { category } = useParams();

//   // Keeps track of all the nearby stores available near users's location
//   const [stores, setStores] = useState([]);

//   // Keeps track of count of total number of stores available nearby
//   const [storesTotalCount, setStoresTotalCount] = useState(0);

//   // Pagination of stores
//   const [page, setPage] = useState(1);

//   // Stores the selected store information
//   const [selectedStoreInfo, setSelectedStoreInfo] = useState(null);

//   const { getSessionData } = useSessionStorage();

//   // const userLocation =
//   //   sessionStorage.getItem("userLocation") &&
//   //   JSON.parse(sessionStorage.getItem("userLocation"));

//   // Getting userLocation
//   const userLocation = getSessionData("userLocation");

//   console.log("stores data: ", stores);

//   const [getNearbyStores, { isLoading: isStoresDataLoading }] =
//     useGetNearbyStoresMutation();

//   console.log("current store page: ", page);

//   // Getting all the stores which are nearby you
//   const getStores = async () => {
//     try {
//       const storesRes = await getNearbyStores({
//         latitude: userLocation?.latitude,
//         longitude: userLocation?.longitude,
//         category,
//         page,
//       }).unwrap();

//       console.log("storesRes: ", storesRes);

//       setStores(storesRes?.stores);
//       setStoresTotalCount(storesRes?.totalStores);
//     } catch (err) {
//       toast.error(err?.message || err?.data?.message);
//     }
//   };

//   // Setting store info when user selects particular store
//   const storeInfoHandler = (storeInfo) => {
//     const { storeCoordinates, name, distance, id } = storeInfo;

//     setSelectedStoreInfo({
//       coordinates: storeCoordinates,
//       name,
//       distance,
//       id,
//     });
//   };

//   useEffect(() => {
//     // If userLocation contains latitude and longitude then only we will get stores
//     if (userLocation) {
//       getStores();
//     }
//   }, [page]);

//   // className="w-full pt-[3.34rem] h-full font-inter"

//   return (
//     <PageTransistion styleProp="w-full h-full font-inter">
//       {/* <section className="w-full pt-[3.34rem] h-full font-inter"> */}
//       <MetaData title="Ecommercy | Nearby-Stores" />
//       <div className="grid grid-cols-10 max-[650px]:grid-cols-1 h-full max-w-[86rem] mx-auto">
//         <div className="border-r col-span-3 max-[900px]:col-span-4 max-[650px]:col-span-1 max-[650px]:order-2 px-4 space-y-4 max-[550px]:space-y-2.5 overflow-y-scroll">
//           <div className="pt-4 max-[550px]:pt-2">
//             <p className="text-xl max-[550px]:text-lg text-center font-bold text-neutral-500/80 font-public-sans">
//               Nearby Stores To You
//             </p>
//           </div>

//           {/* If stores are loading then showing loader */}
//           {isStoresDataLoading && (
//             <div className="flex items-center justify-center h-1/2">
//               <SmallLoader />
//             </div>
//           )}

//           {/* Displaying all stores to user */}
//           <div className="space-y-4 pb-5">
//             {!isStoresDataLoading &&
//               stores?.map((store) => (
//                 <NearbyStore
//                   key={store?._id}
//                   id={store?._id}
//                   name={store?.name}
//                   address={store?.address}
//                   categories={store?.categories}
//                   ratingInfo={store?.ratingInfo}
//                   distance={store?.distanceInKM}
//                   storeCoordinates={[
//                     store?.location?.coordinates[1],
//                     store?.location?.coordinates[0],
//                   ]}
//                   selectedStoreInfo={selectedStoreInfo}
//                   storeInfoHandler={storeInfoHandler}
//                 />
//               ))}
//           </div>

//           {/* Displaying only 6 stores per page */}
//           {!isStoresDataLoading && storesTotalCount > 6 && (
//             <div className="flex items-center justify-center pb-4">
//               <Pagination
//                 count={Math.ceil(storesTotalCount / 6)}
//                 page={page}
//                 onChange={(e, value) => setPage(value)}
//               />
//             </div>
//           )}

//           {/* Showing message, if we dont find any store with particular category */}
//           {!isStoresDataLoading && stores?.length === 0 && (
//             <p className="font-medium text-lg text-neutral-500 text-center pt-10 max-[550px]:pt-0">
//               Sorry we couldn't find any stores of category: '{category}'
//               nearby!
//             </p>
//           )}
//         </div>

//         {/* Displaying the selected store on the map */}
//         <div className="col-span-7 max-[900px]:col-span-6 max-[650px]:col-span-1 max-[650px]:order-1 w-full h-[90vh] max-[650px]:h-[40vh]">
//           <StoresMap
//             userCoordinates={userLocation}
//             storeInfo={selectedStoreInfo}
//           />
//         </div>
//       </div>
//       {/* </section> */}
//     </PageTransistion>
//   );
// };
