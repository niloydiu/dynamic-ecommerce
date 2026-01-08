import { create } from "zustand"

interface AdminState {
  // State
  isLoading: boolean
  error: string | null
  successMessage: string | null

  // Actions
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSuccessMessage: (message: string | null) => void
}

export const useAdminStore = create<AdminState>((set) => ({
  // Initial state
  isLoading: false,
  error: null,
  successMessage: null,

  // Actions
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSuccessMessage: (successMessage) => set({ successMessage }),
}))
