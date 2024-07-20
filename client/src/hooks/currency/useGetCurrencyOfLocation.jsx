import { useEffect } from "react";
import toast from "react-hot-toast";
import useSessionStorage from "../basic/useSessionStorage";

const useGetCurrencyOfLocation = (userCurrency) => {
  const { getSessionData, setSessionData, removeSessionData } =
    useSessionStorage();

  const currencyData = getSessionData("currencyData");

  // Fetching currency data
  const getCurrencyData = async () => {
    try {
      const fetchCurrencyRates = await fetch(
        `https://api.freecurrencyapi.com/v1/latest?apikey=${
          import.meta.env.VITE_APP_CURRENCY_API_KEY
        }&base_currency=${userCurrency?.currency}&currencies=INR`
      );

      const data = await fetchCurrencyRates.json();

      if (data?.message === "Validation error") {
        setSessionData("currencyData", {
          conversion: 1,
        });
      } else {
        // Setting currency conversion rate and expiration time (4 days) in session storage
        setSessionData("currencyData", {
          conversion: Number(Object.values(data?.data)[0].toFixed(2)),
          expirationTime: new Date().getTime() + 4 * 24 * 60 * 60 * 1000,
        });
      }
    } catch (err) {
      toast.error(err?.message);

      setSessionData("currencyData", {
        conversion: 1,
      });
    }
  };

  // Updating new currency every 5 days
  useEffect(() => {
    // Implementing Dynamic currencies based on user location

    if (currencyData) {
      // checking if currencyData is expired
      if (new Date().getTime() > currencyData?.expirationTime) {
        removeSessionData("currencyData");

        // sessionStorage.removeItem("currencyData");

        // Here we are refetching the new currency rate if its changed.
        getCurrencyData();
      }
    } else {
      // If user is present in india then currency will be INR so we dont make api request as the base_currency is INR

      if (userCurrency && userCurrency?.currency !== "INR") {
        getCurrencyData();
      } else if (userCurrency && userCurrency?.currency === "INR") {
        setSessionData("currencyData", {
          conversion: 1,
        });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCurrency?.countryCode, userCurrency?.currency]);
};

export default useGetCurrencyOfLocation;

// sessionStorage.setItem(
//   "currencyData",
//   JSON.stringify({
//     conversion: Number(Object.values(data?.data)[0].toFixed(2)),
//     expirationTime: new Date().getTime() + 5 * 24 * 60 * 60 * 1000,
//   })
// );

// sessionStorage.setItem(
//   "currencyData",
//   JSON.stringify({
//     conversion: 1,
//   })
// );
