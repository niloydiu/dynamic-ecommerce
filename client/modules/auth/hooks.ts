"use client"

import { useCallback } from "react"
import { useAuthStore } from "./store"
import { signIn as signInAction, signUp as signUpAction, signOut as signOutAction } from "./actions.server"
import type { SignInRequest, SignUpRequest } from "./types"

export function useAuth() {
  const store = useAuthStore()

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
  }
}

export function useSignIn() {
  const store = useAuthStore()

  const signIn = useCallback(
    async (credentials: SignInRequest) => {
      store.setIsLoading(true)
      store.setError(null)

      const result = await signInAction(credentials)

      if (result.error) {
        store.setError(result.error.message)
        store.setIsLoading(false)
        return { success: false, error: result.error }
      }

      if (result.data) {
        store.setSession(result.data)
        store.setIsLoading(false)
        return { success: true }
      }

      store.setIsLoading(false)
      return { success: false }
    },
    [store],
  )

  return { signIn }
}

export function useSignUp() {
  const store = useAuthStore()

  const signUp = useCallback(
    async (data: SignUpRequest) => {
      store.setIsLoading(true)
      store.setError(null)

      const result = await signUpAction(data)

      if (result.error) {
        store.setError(result.error.message)
        store.setIsLoading(false)
        return { success: false, error: result.error }
      }

      if (result.data) {
        store.setSession(result.data)
        store.setIsLoading(false)
        return { success: true }
      }

      store.setIsLoading(false)
      return { success: false }
    },
    [store],
  )

  return { signUp }
}

export function useSignOut() {
  const store = useAuthStore()

  const signOut = useCallback(async () => {
    store.setIsLoading(true)
    await signOutAction()
    store.logout()
    store.setIsLoading(false)
  }, [store])

  return { signOut }
}
