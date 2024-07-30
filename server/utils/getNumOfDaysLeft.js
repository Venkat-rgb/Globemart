// Gives number of days left between startDate and endDate
export const getNumOfDaysLeft = (startDate, endDate) => {
  try {
    const timeDifference = startDate - endDate;

    // Calculates one day time in seconds
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculates number of days left
    const numOfDaysLeft = Math.floor(timeDifference / oneDay);

    return numOfDaysLeft;
  } catch (err) {
    console.log("getNumOfDaysLeft function error: ", err?.message);
  }
};
