import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  showPreviewPanel: boolean;
  candidatesPerPage: number;
  togglePreviewPanel: () => void;
  setCandidatesPerPage: (count: number) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      showPreviewPanel: true,
      candidatesPerPage: 25,
      togglePreviewPanel: () => set((state) => ({ showPreviewPanel: !state.showPreviewPanel })),
      setCandidatesPerPage: (count) => set({ candidatesPerPage: count }),
    }),
    {
      name: 'ui-storage',
    }
  )
);