import { getMockUser } from '@/mocks/users.mock'
import { apiService, type ApiResponse } from './api'

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
    fullName: string
    role: string
  }
}

export interface RegisterPayload {
  fullName: string
  username: string
  email: string
  phone: string
  password: string
}

export interface RegisterResponse {
  user: {
    id: string
    email: string
    fullName: string
    username: string
  }
  token?: string
}

class AuthService {
  async login(payload: LoginPayload): Promise<ApiResponse<LoginResponse>> {
    // Check for dummy test accounts
    const mockUser = getMockUser(payload.email)

    if (mockUser) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      return {
        success: true,
        data: mockUser,
      }
    }

    return apiService.post<LoginResponse>('/auth/login', payload)
  }

  async register(payload: RegisterPayload): Promise<ApiResponse<RegisterResponse>> {
    return apiService.post<RegisterResponse>('/auth/register', payload)
  }

  async logout(): Promise<ApiResponse<void>> {
    const isMock = !!localStorage.getItem('auth_token')?.startsWith('dummy-token-')
    if (isMock) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return { success: true }
    }
    return apiService.post<void>('/auth/logout', {})
  }

  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>('/auth/forgot-password', { email })
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>('/auth/reset-password', { token, password })
  }
}

export const authService = new AuthService()
