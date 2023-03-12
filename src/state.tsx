import { create } from 'zustand';

export type AppViewMode = 'today' | 'yesterday' | 'last-week' | 'month'

export type AppState = {
  readonly title: string,
  readonly mode: AppViewMode,

  setTitle(title: string): void,
  getDateRange(): [number, number],
  setViewMode(type: AppViewMode): void,
}

export const useAppState = create<AppState>((set, get) => ({
  title: '',
  mode: 'today',

  setTitle(title: string) {
    set({ title })
  },

  getDateRange() {
    const today = new Date().getDate()
    let from, to

    switch (get().mode) {
      case 'today'    : from = to = today; break;
      case 'yesterday': from = to = today - 1; break;
      case 'last-week': from = today - 6; to = today; break;
      case 'month'    : from = 1; to = 31; break;
    }

    return [Math.max(0, from), Math.min(to, 31)]
  },

  setViewMode: (mode: AppViewMode) => {
    set({ mode })
  }
}))
