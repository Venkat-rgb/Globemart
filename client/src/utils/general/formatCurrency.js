import { localeToCurrencyCodes } from "./localeToCurrencyCodes";

export const formatCurrency = (price) => {
  const userCurrency =
    sessionStorage.getItem("userCurrency") &&
    JSON.parse(sessionStorage.getItem("userCurrency"));

  // Converting price into different currencies based on userLocation's currency
  const formmatedPrice = userCurrency?.currency
    ? new Intl.NumberFormat(localeToCurrencyCodes[userCurrency.currency], {
        style: "currency",
        currency: userCurrency?.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price)
    : new Intl.NumberFormat({
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price);

  return formmatedPrice;
};
