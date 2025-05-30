export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  name: string
  password: string
  username: string
}

export interface AuthResponse {
  accessToken: string
  avatar_url: string
  email: string
  exp: number
  extend: string
  id: number
  last_login: string
  name: string
  username: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}
