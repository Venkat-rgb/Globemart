import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSessionStorage from "../basic/useSessionStorage";

const useGetUserLocation = () => {
  const { getSessionData, setSessionData } = useSessionStorage();

  const [userCurrency, setUserCurrency] = useState(
    getSessionData("userCurrency")
  );

  // Getting users location based on IP
  useEffect(() => {
    if (!userCurrency) {
      const getUserCurrency = async () => {
        try {
          const res = await fetch(import.meta.env.VITE_APP_USER_LOCATION);

          const data = await res.json();

          setSessionData("userCurrency", {
            countryCode: data?.countryCode,
            currency: data?.currency,
          });

          setSessionData("userLocation", {
            latitude: data?.lat,
            longitude: data?.lon,
          });

          setUserCurrency({
            countryCode: data?.countryCode,
            currency: data?.currency,
          });
        } catch (err) {
          toast.error(err?.message);
        }
      };
      getUserCurrency();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCurrency]);

  return { userCurrency };
};

export default useGetUserLocation;
