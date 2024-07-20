import { useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../redux/features/slices/authSlice";
import { useRefreshTokenMutation } from "../../redux/features/auth/authApiSlice";
import toast from "react-hot-toast";

const useSaveLoginCredentials = () => {
  const dispatch = useDispatch();

  const { token: accessToken } = useSelector((state) => state?.auth);

  const [refreshToken] = useRefreshTokenMutation();

  // Get the new access token when user refreshes the page
  const getUserInfo = async () => {
    try {
      const res = await refreshToken().unwrap();

      const token = res?.accessToken;

      // Decoding the new access token
      const decodedRes = token && jwt_decode(token);

      // If token is present, then storing the token and userInfo in redux store
      if (token) {
        dispatch(
          setCredentials({
            token,
            userInfo: {
              username: decodedRes?.username,
              role: decodedRes?.role,
              id: decodedRes?.id,
            },
          })
        );
      }
    } catch (err) {
      toast.error(err?.data?.message || err?.message);
    }
  };

  useEffect(() => {
    if (!accessToken) {
      getUserInfo();
    }
  }, []);
};

export default useSaveLoginCredentials;
