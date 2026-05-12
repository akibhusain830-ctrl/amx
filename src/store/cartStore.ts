import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/lib/products";

export interface CustomSignDetails {
  text: string;
  fontName: string;
  fontFamily: string;
  color: string;
  colorHex: string;
  backing: string;
  dimensions: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedPrice: number;
  customDetails?: CustomSignDetails;
  cartItemId?: string; // unique id for custom signs to prevent merging
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, size: string, price: number, customDetails?: CustomSignDetails) => void;
  removeItem: (productId: string, size: string, cartItemId?: string) => void;
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
      addItem: (product, size, price, customDetails?) =>
        set((state) => {
          // Custom signs are always unique — never merge them
          if (customDetails) {
            const cartItemId = `custom-${Date.now()}-${Math.random()}`;
            return { items: [...state.items, { product, quantity: 1, selectedSize: size, selectedPrice: price, customDetails, cartItemId }] };
          }
          const existing = state.items.find(
            (item) => item.product.id === product.id && item.selectedSize === size && !item.customDetails
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id && item.selectedSize === size && !item.customDetails
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { items: [...state.items, { product, quantity: 1, selectedSize: size, selectedPrice: price }] };
        }),
      removeItem: (productId, size, cartItemId?) =>
        set((state) => ({
          items: state.items.filter((item) => {
            if (cartItemId) return item.cartItemId !== cartItemId;
            return !(item.product.id === productId && item.selectedSize === size && !item.customDetails);
          }),
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
