import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, Session } from "./types"

interface AuthState {
  // User data
  user: User | null
  token: string | null
  isAuthenticated: boolean

  // State
  isLoading: boolean
  error: string | null

  // Actions
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setIsAuthenticated: (authenticated: boolean) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSession: (session: Session | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setSession: (session) => {
        if (session) {
          set({
            user: session.user,
            token: session.token,
            isAuthenticated: true,
          })
        } else {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          })
        }
      },
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
