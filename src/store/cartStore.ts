import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/lib/products";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedPrice: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, size: string, price: number) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product, size, price) =>
        set((state) => {
          const existing = state.items.find(
            (item) => item.product.id === product.id && item.selectedSize === size
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id && item.selectedSize === size
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { items: [...state.items, { product, quantity: 1, selectedSize: size, selectedPrice: price }] };
        }),
      removeItem: (productId, size) =>
        set((state) => ({
          items: state.items.filter((item) => !(item.product.id === productId && item.selectedSize === size)),
        })),
      updateQuantity: (productId, size, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (item) => !(item.product.id === productId && item.selectedSize === size)
              ),
            };
          }
          return {
            items: state.items.map((item) =>
              item.product.id === productId && item.selectedSize === size ? { ...item, quantity } : item
            ),
          };
        }),
      clearCart: () => set({ items: [] }),
      getTotalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
      getTotalPrice: () =>
        get().items.reduce(
          (sum, item) => sum + item.selectedPrice * item.quantity,
          0
        ),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: "amx-cart-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
