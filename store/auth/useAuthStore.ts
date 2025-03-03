import {create} from 'zustand';

interface AuthState {
    phoneNumber: string;
    setPhoneNumber: (phoneNumber: string) => void;
    clearPhoneNumber: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    phoneNumber: '',
    setPhoneNumber: (phoneNumber: string) => set({ phoneNumber }),
    clearPhoneNumber: () => set({ phoneNumber: '' }),
}));