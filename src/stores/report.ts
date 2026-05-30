import { create } from 'zustand';
import type { KnowledgeReport } from '@/types';

interface ReportState {
  reports: KnowledgeReport[];
  currentReport: KnowledgeReport | null;
  isLoading: boolean;
  error: string | null;
  setReports: (reports: KnowledgeReport[]) => void;
  setCurrentReport: (report: KnowledgeReport | null) => void;
  addReport: (report: KnowledgeReport) => void;
  updateReport: (id: string, updates: Partial<KnowledgeReport>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useReportStore = create<ReportState>((set) => ({
  reports: [],
  currentReport: null,
  isLoading: false,
  error: null,
  setReports: (reports) => set({ reports }),
  setCurrentReport: (report) => set({ currentReport: report }),
  addReport: (report) =>
    set((state) => ({ reports: [...state.reports, report] })),
  updateReport: (id, updates) =>
    set((state) => ({
      reports: state.reports.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));