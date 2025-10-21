import { create } from "zustand";

interface StartState {
  title: boolean;
  loading: boolean;
  game: boolean;

  setTitle: () => void;
  setLoading: () => void;
}

export const useStart = create<StartState>((set) => ({
  title: true,
  loading: false,
  game: false,

  setTitle: () => set({ title: false, loading: true, game: false }),
  setLoading: () => set({ title: false, loading: false, game: true }),
}));
