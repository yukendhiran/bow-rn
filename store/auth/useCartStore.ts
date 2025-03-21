import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';
import axiosInstance from '@/config/axios';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  getTotalItems: () => number;
  fetchCart: () => Promise<void>;
  removeCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],

  addToCart: async (item) => {
    console.log(item);
    const { token } = useAuthStore.getState();
    await axiosInstance
      .post(
        '/cart/add',
        { item_id: item.id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        console.log(response.data);
      });
    set((state) => {
      const existingItem = state.cart.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          cart: state.cart.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { cart: [...state.cart, { ...item, quantity: 1 }] };
    });
  },

  removeFromCart: async (id) => {
    const { token } = useAuthStore.getState();
    await axiosInstance
      .delete(`/cart/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response.data);
      });
    set((state) => ({ cart: state.cart.filter((item) => item.id !== id) }));
  },

  increaseQuantity: async (id) => {
    const { token } = useAuthStore.getState();
    await axiosInstance.patch(
      `/cart/increase/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      ),
    }));
  },

  decreaseQuantity: async (id) => {
    const { token } = useAuthStore.getState();
    await axiosInstance.patch(
      `/cart/decrease/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    set((state) => ({
      cart: state.cart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0), // Remove item if quantity reaches 0
    }));
  },

  getTotalItems: () => {
    return get().cart.reduce((total, item) => total + item.quantity, 0);
  },

  fetchCart: async () => {
    const { token } = useAuthStore.getState();
    const response = await axiosInstance.get('/cart', {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Transform cart items to match CartItem interface
    const cartItems = response.data.cart.map((item: any) => ({
      id: item.id,
      image: item.full_image_url,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      // Spread the food item properties
    }));

    set({ cart: cartItems });
  },
  removeCart: async () => {
    const { token } = useAuthStore.getState();
    await axiosInstance.post(
      '/cart/clear',
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    set({ cart: undefined });
  },
}));
