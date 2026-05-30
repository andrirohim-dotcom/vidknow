import { create } from 'zustand';
import type { KnowledgeExtraction } from '@/types';

interface ExtractionState {
  extractions: KnowledgeExtraction[];
  currentExtraction: KnowledgeExtraction | null;
  isExtracting: boolean;
  progress: number;
  error: string | null;
  setExtractions: (extractions: KnowledgeExtraction[]) => void;
  setCurrentExtraction: (extraction: KnowledgeExtraction | null) => void;
  addExtraction: (extraction: KnowledgeExtraction) => void;
  updateExtraction: (id: string, updates: Partial<KnowledgeExtraction>) => void;
  setExtracting: (extracting: boolean) => void;
  setProgress: (progress: number) => void;
  setError: (error: string | null) => void;
}

export const useExtractionStore = create<ExtractionState>((set) => ({
  extractions: [],
  currentExtraction: null,
  isExtracting: false,
  progress: 0,
  error: null,
  setExtractions: (extractions) => set({ extractions }),
  setCurrentExtraction: (extraction) => set({ currentExtraction: extraction }),
  addExtraction: (extraction) =>
    set((state) => ({ extractions: [...state.extractions, extraction] })),
  updateExtraction: (id, updates) =>
    set((state) => ({
      extractions: state.extractions.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    })),
  setExtracting: (isExtracting) => set({ isExtracting }),
  setProgress: (progress) => set({ progress }),
  setError: (error) => set({ error }),
}));