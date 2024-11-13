import { useSelector, useDispatch } from "react-redux";
import { setAuthData, clearAuthData } from "../slices/authSlice";
import { RootTypes } from "../types";
import { AppDispatch } from "../store";
import { User } from "../types/auth";

const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, accessToken, refreshToken } = useSelector((state: RootTypes) => state.auth);

  const handleAuth = (
    data: Partial<{
      accessToken: string;
      refreshToken: string;
      user: User;
    }>,
  ) => {
    const newAccessToken = data.accessToken ?? accessToken ?? "";
    const newRefreshToken = data.refreshToken ?? refreshToken ?? "";
    const newUser = data.user ?? user;

    dispatch(
      setAuthData({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: newUser,
      }),
    );
  };

  const logout = () => {
    dispatch(clearAuthData());
  };

  return {
    user,
    accessToken,
    refreshToken,
    setAuth: handleAuth,
    logout,
  };
};

export default useAuth;
