// Waits for specified time and returns a promise
export const wait = (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};
