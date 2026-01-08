"use server"

import type { Session, SignInRequest, SignUpRequest, AuthError } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:4000"

async function fetchFromAPI<T>(endpoint: string, options?: RequestInit): Promise<{ data?: T; error?: AuthError }> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        error: {
          code: error.code || "UNKNOWN_ERROR",
          message: error.message || "An error occurred",
          field: error.field,
        },
      }
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    console.error(`[v0] API Error at ${endpoint}:`, error)
    return {
      error: {
        code: "NETWORK_ERROR",
        message: "Failed to connect to the server",
      },
    }
  }
}

// Sign in with email and password
export async function signIn(credentials: SignInRequest) {
  if (!credentials.email || !credentials.password) {
    return {
      error: {
        code: "INVALID_INPUT",
        message: "Email and password are required",
      },
    }
  }

  return fetchFromAPI<Session>("/auth/sign-in", {
    method: "POST",
    body: JSON.stringify(credentials),
  })
}

// Sign up new user
export async function signUp(data: SignUpRequest) {
  // Validation
  if (!data.email || !data.password || !data.passwordConfirm) {
    return {
      error: {
        code: "INVALID_INPUT",
        message: "Email, password, and password confirmation are required",
      },
    }
  }

  if (data.password !== data.passwordConfirm) {
    return {
      error: {
        code: "PASSWORD_MISMATCH",
        message: "Passwords do not match",
        field: "password",
      },
    }
  }

  if (data.password.length < 8) {
    return {
      error: {
        code: "WEAK_PASSWORD",
        message: "Password must be at least 8 characters",
        field: "password",
      },
    }
  }

  return fetchFromAPI<Session>("/auth/sign-up", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// Sign out (client-side handled, but server action for cleanup)
export async function signOut() {
  try {
    await fetch(`${API_BASE_URL}/auth/sign-out`, {
      method: "POST",
    })
    return { success: true }
  } catch (error) {
    console.error("[v0] Sign out error:", error)
    return { success: true } // Fail open
  }
}

// Get current session
export async function getSession() {
  return fetchFromAPI<Session>("/auth/session")
}

// Validate token
export async function validateToken(token: string) {
  if (!token) {
    return {
      data: null,
      error: { code: "NO_TOKEN", message: "No token provided" },
    }
  }

  return fetchFromAPI<Session>("/auth/validate", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
