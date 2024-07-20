import toast from "react-hot-toast";

const useLocalStorage = () => {
  const getLocalData = (key) => {
    // Handling errors when browser doesn't support localStorage (or) localStorage is out of space
    try {
      let data =
        localStorage.getItem(key) && JSON.parse(localStorage.getItem(key));
      return data;
    } catch (err) {
      toast.error(err?.message);
    }
  };

  const setLocalData = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      toast.error(err?.message);
    }
  };

  const removeLocalData = (key) => {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      toast.error(err?.message);
    }
  };

  return { getLocalData, setLocalData, removeLocalData };
};

export default useLocalStorage;
