export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  avatar?: string
  createdAt?: string
  updatedAt?: string
}

export interface Session {
  user: User
  token: string
  expiresAt: string
  isAuthenticated: boolean
}

export interface SignInRequest {
  email: string
  password: string
}

export interface SignUpRequest {
  email: string
  password: string
  passwordConfirm: string
  firstName?: string
  lastName?: string
}

export interface AuthError {
  code: string
  message: string
  field?: string
}
