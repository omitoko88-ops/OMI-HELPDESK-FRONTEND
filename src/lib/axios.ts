import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL_DEV,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const logout = useAuthStore.getState().logout;

    if (error.response?.status === 401) {
      logout();
      console.log("logOut");
    }

    return Promise.reject(error);
  }
);
