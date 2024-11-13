import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Create Axios instance with base URL
const axiosInstance = axios.create({
  // baseURL: "http://192.168.8.124:5000",
  baseURL: "http://16.171.34.240/api",
});

// Check if the token is expired
const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true; // Token is expired if it doesn't exist
  const { exp } = jwtDecode<{ exp: number }>(token);
  return Date.now() >= exp * 1000;
};

// Token refresh management
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

// Notify all subscribers with the new token
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// Add a subscriber to the refresh queue
const addRefreshSubscriber = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

// Refresh the authentication token
const refreshAuthToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  try {
    const { data } = await axios.post("/refresh", { token: refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    return accessToken;
  } catch (error) {
    console.error("Failed to refresh token", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return null;
  }
};

// Request interceptor to handle token expiration and refresh
axiosInstance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("accessToken");

    if (isTokenExpired(token)) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshAuthToken();
          isRefreshing = false;

          if (newToken) {
            onRefreshed(newToken);
            token = newToken;
          } else {
            return Promise.reject(new Error("Token refresh failed"));
          }
        } catch (error) {
          isRefreshing = false;
          return Promise.reject(error);
        }
      }

      // Wait for the token to be refreshed
      const retryOriginalRequest = new Promise<string>((resolve) => {
        addRefreshSubscriber((newToken) => resolve(newToken));
      });

      token = await retryOriginalRequest;
    }

    config.headers["Authorization"] = `Bearer ${token}`;
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => Promise.reject(error),
);

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Retry original request if token is expired
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       // Ensure token refresh is not in progress
//       if (!isRefreshing) {
//         isRefreshing = true;
//         try {
//           const newToken = await refreshAuthToken();
//           isRefreshing = false;

//           if (newToken) {
//             onRefreshed(newToken);
//             originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
//             return axiosInstance(originalRequest);
//           }
//         } catch (refreshError) {
//           isRefreshing = false;
//           return Promise.reject(refreshError);
//         }
//       }

//       // Wait for the token to be refreshed and retry the original request
//       return new Promise((resolve) => {
//         addRefreshSubscriber((newToken) => {
//           originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
//           resolve(axiosInstance(originalRequest));
//         });
//       });
//     }

//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
