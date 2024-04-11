import create from 'zustand';
import { Product } from '../types/product.types';

interface ProductListStore {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  scrollPosition: number;
  setScrollPosition: (position: number) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
  skip: number;
  setSkip: (skip: number) => void;
  totalProducts: number;
  setTotalProducts: (totalProducts: number) => void;
}

const useListStore = create<ProductListStore>((set) => ({
  searchTerm: '',
  setSearchTerm: (term: string) => set({ searchTerm: term }),
  scrollPosition: 0,
  setScrollPosition: (position: number) => set({ scrollPosition: position }),
  products: [],
  setProducts: (products: Product[]) => set({ products }),
  skip: 0,
  setSkip: (skip: number) => set({ skip }),
  totalProducts: 0,
  setTotalProducts: (totalProducts: number) => set({ totalProducts }),
}));

export default useListStore;
