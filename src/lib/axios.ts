import axios from 'axios'
import { handleApiResponse, toApiError } from './handleApiResponse'
// import { useAuthStore } from "@/stores/authStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL_DEV ?? 'http://localhost:5136',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (res) => {
    // Kasus HTTP 200 tapi meta.success = false: dilempar sebagai ApiError
    handleApiResponse(res.data)
    return res
  },
  async (error) => {
    console.log('RESPONSE =', error)
    // const logout = useAuthStore.getState().logout;

    if (error.response?.status === 401) {
      console.log('logOut')
      // logout();
    }

    return Promise.reject(toApiError(error))
  },
)
