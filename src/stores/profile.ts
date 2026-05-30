import { create } from 'zustand';
import type { Profile } from '@/types';

interface ProfileState {
  profiles: Profile[];
  currentProfile: Profile | null;
  isLoading: boolean;
  error: string | null;
  setProfiles: (profiles: Profile[]) => void;
  setCurrentProfile: (profile: Profile | null) => void;
  addProfile: (profile: Profile) => void;
  updateProfile: (id: string, updates: Partial<Profile>) => void;
  removeProfile: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profiles: [],
  currentProfile: null,
  isLoading: false,
  error: null,
  setProfiles: (profiles) => set({ profiles }),
  setCurrentProfile: (profile) => set({ currentProfile: profile }),
  addProfile: (profile) =>
    set((state) => ({ profiles: [...state.profiles, profile] })),
  updateProfile: (id, updates) =>
    set((state) => ({
      profiles: state.profiles.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),
  removeProfile: (id) =>
    set((state) => ({
      profiles: state.profiles.filter((p) => p.id !== id),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));