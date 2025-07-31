import { create } from "zustand"
import { persist } from "zustand/middleware"

interface LanguageState {
  currentLanguage: "en" | "zh"
  setLanguage: (language: "en" | "zh") => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      currentLanguage: "zh",
      setLanguage: (language) => set({ currentLanguage: language }),
    }),
    {
      name: "language-storage",
    }
  )
)
