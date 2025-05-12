// apiService.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_URL =
  "https://bccf-2405-201-303a-2043-5aa5-a226-57be-d9ed.ngrok-free.app/";

export const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  // Before sending a request, check if we have an access token stored
  const accessToken = await AsyncStorage.getItem("access_token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle token expiration error (usually 401)
    if (error.response.status === 401) {
      // Attempt to refresh the token
      const refreshToken = await AsyncStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          // Request a new access token using the refresh token
          const response = await axios.post(`${API_URL}/api/refresh/`, {
            refresh: refreshToken,
          });

          // Store the new access token
          await AsyncStorage.setItem("access_token", response.data.access);

          // Retry the original request with the new access token
          error.config.headers.Authorization = `Bearer ${response.data.access}`;
          return axiosInstance(error.config);
        } catch (refreshError) {
          // If refresh fails, log the user out
          console.error("Token refresh failed:", refreshError);
          // You can navigate to login screen here
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);
