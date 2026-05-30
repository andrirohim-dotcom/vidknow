import { create } from 'zustand';
import type { Export } from '@/types';

interface ExportState {
  exports: Export[];
  currentExport: Export | null;
  isExporting: boolean;
  progress: number;
  error: string | null;
  setExports: (exports: Export[]) => void;
  setCurrentExport: (exportItem: Export | null) => void;
  addExport: (exportItem: Export) => void;
  updateExport: (id: string, updates: Partial<Export>) => void;
  setExporting: (exporting: boolean) => void;
  setProgress: (progress: number) => void;
  setError: (error: string | null) => void;
}

export const useExportStore = create<ExportState>((set) => ({
  exports: [],
  currentExport: null,
  isExporting: false,
  progress: 0,
  error: null,
  setExports: (exports) => set({ exports }),
  setCurrentExport: (exportItem) => set({ currentExport: exportItem }),
  addExport: (exportItem) =>
    set((state) => ({ exports: [...state.exports, exportItem] })),
  updateExport: (id, updates) =>
    set((state) => ({
      exports: state.exports.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    })),
  setExporting: (isExporting) => set({ isExporting }),
  setProgress: (progress) => set({ progress }),
  setError: (error) => set({ error }),
}));