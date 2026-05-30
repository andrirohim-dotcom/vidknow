import { create } from 'zustand';
import type { KnowledgeExtraction, KnowledgeReport, KnowledgeCategory } from '@/types';

interface KnowledgeState {
  items: KnowledgeExtraction[];
  currentItem: KnowledgeExtraction | null;
  currentReport: KnowledgeReport | null;
  categories: KnowledgeCategory[];
  searchQuery: string;
  selectedCategory: string | null;
  isLoading: boolean;
  error: string | null;
  setItems: (items: KnowledgeExtraction[]) => void;
  setCurrentItem: (item: KnowledgeExtraction | null) => void;
  setCurrentReport: (report: KnowledgeReport | null) => void;
  setCategories: (categories: KnowledgeCategory[]) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  addItem: (item: KnowledgeExtraction) => void;
  removeItem: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useKnowledgeStore = create<KnowledgeState>((set) => ({
  items: [],
  currentItem: null,
  currentReport: null,
  categories: [],
  searchQuery: '',
  selectedCategory: null,
  isLoading: false,
  error: null,
  setItems: (items) => set({ items }),
  setCurrentItem: (item) => set({ currentItem: item }),
  setCurrentReport: (report) => set({ currentReport: report }),
  setCategories: (categories) => set({ categories }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));