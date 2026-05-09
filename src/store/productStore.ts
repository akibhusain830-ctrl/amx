import { create } from 'zustand';
import { Product, getProducts } from '@/lib/products';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  hasLoaded: boolean;
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  hasLoaded: false,
  fetchProducts: async () => {
    // If we already have products, don't show loading state again
    // but still refresh in background if needed.
    if (get().hasLoaded) return;

    set({ isLoading: true });
    try {
      const products = await getProducts();
      set({ products, isLoading: false, hasLoaded: true });
    } catch (error) {
      console.error('Failed to fetch products:', error);
      set({ isLoading: false });
    }
  },
}));
