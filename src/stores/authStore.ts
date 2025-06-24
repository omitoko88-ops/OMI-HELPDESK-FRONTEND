import { User } from "@/interfaces/User";
import { fetchUser } from "@/service/getUser";
import { create } from "zustand";
import { useActiveBusinessStore } from "./activeBusinessStore";
import { queryClient } from "@/lib/queryClient";

const initialUser: User = {
  id: 0,
  first_name: "",
  last_name: "",
  country_code: "",
  phone_number: "",
  created_at: "",
  updated_at: "",
};

type AuthStore = {
  userInfo: User;
  isAuthenticated: boolean;
  checkingAuth: boolean;
  checkAuth: () => Promise<void>;
  login: (token: string, user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  userInfo: initialUser,
  isAuthenticated: false,
  checkingAuth: true,
  checkAuth: async () => {
    try {
      const user = await fetchUser();
      console.log("HASIL FETCH USER:", user);
      set({ isAuthenticated: true, userInfo: user.data });
    } catch (error) {
      console.error("GAGAL FETCH USER:", error);
      set({ isAuthenticated: false });
    } finally {
      set({ checkingAuth: false });
    }
  },
  login: async (token: string, user: User) => {
    console.log(`TOKENNYA = ${token}`);
    localStorage.setItem("access_token", token);
    set({ isAuthenticated: true, userInfo: user });
  },
  logout: () => {
    console.log("LOGOUT");
    localStorage.removeItem("access_token");
    useActiveBusinessStore.getState().reset();
    queryClient.clear();
    set({ isAuthenticated: false });
  },
}));
