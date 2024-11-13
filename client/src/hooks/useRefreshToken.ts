import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { accessToken, refreshToken, setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.post(
      "/refresh",
      { token: refreshToken },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    // console.log(accessToken);
    // console.log(response.data.accessToken);

    setAuth({ accessToken: response.data.accessToken, refreshToken: response.data.refreshToken });

    return response.data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;
