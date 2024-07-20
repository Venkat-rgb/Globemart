// Calculates GST based on Subtotal amount
export const gstCalculation = (price) => {
  if (price < 10000) {
    return 0.02;
  } else if (price > 10000 && price < 50000) {
    return 0.03;
  } else if (price > 50000 && price < 200000) {
    return 0.04;
  } else if (price > 200000) {
    return 0.05;
  }
};
