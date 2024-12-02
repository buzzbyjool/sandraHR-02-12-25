import { create } from 'zustand';

interface FilterState {
  skillFilter: string[];
  experienceFilter: number | null;
  setSkillFilter: (skills: string[]) => void;
  setExperienceFilter: (years: number | null) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  skillFilter: [],
  experienceFilter: null,
  setSkillFilter: (skills) => set({ skillFilter: skills }),
  setExperienceFilter: (years) => set({ experienceFilter: years }),
}));