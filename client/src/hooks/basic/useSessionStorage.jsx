import toast from "react-hot-toast";

const useSessionStorage = () => {
  const getSessionData = (key) => {
    // Handling errors when browser doesn't support sessionStorage (or) sessionStorage is out of space
    try {
      let data =
        sessionStorage.getItem(key) && JSON.parse(sessionStorage.getItem(key));

      return data;
    } catch (err) {
      toast.error(err?.message);
    }
  };

  const setSessionData = (key, value) => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      toast.error(err?.message);
    }
  };

  const removeSessionData = (key) => {
    try {
      sessionStorage.removeItem(key);
    } catch (err) {
      toast.error(err?.message);
    }
  };

  return { getSessionData, setSessionData, removeSessionData };
};

export default useSessionStorage;
