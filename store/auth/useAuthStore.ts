import { create } from "zustand";
import AsyncStorage from '@react-native-async-storage/async-storage';


interface User {
  id: number;
  phoneNumber: string;
  name?: string | null;
  email?: string | null;
  address?: string | null;
}

interface AuthState {
  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;
  clearPhoneNumber: () => void;
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  phoneNumber: "",
  setPhoneNumber: (phoneNumber: string) => set({ phoneNumber }),
  clearPhoneNumber: () => set({ phoneNumber: "" }),
  token: null,
  user: null,

  login: async (token, user) => {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(user));
    set({ token, user });
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    set({ token: null, user: null });
  },

  loadUser: async () => {
    const token = await AsyncStorage.getItem("token");
    const user = await AsyncStorage.getItem("user");
    if (token && user) {
      set({ token, user: JSON.parse(user) });
    }
  },
}));
