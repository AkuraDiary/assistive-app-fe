/* eslint-disable @typescript-eslint/no-explicit-any */

// API Configuration
import { getMockUser } from '@/mocks/users.mock'

// to this
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
export const USE_MOCK = !API_BASE_URL

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string>
}

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

class ApiService {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    // Add auth token if available
    const token = localStorage.getItem('auth_token')
    if (token) {
      ;(headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const text = await response.text()
      let data: any = {}
      try {
        data = text ? JSON.parse(text) : {}
      } catch (e) {
        data = { message: text || 'Invalid JSON response' }
      }

      if (!response.ok) {
        throw {
          status: response.status,
          data,
        }
      }

      return data
    } catch (error: any) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Auth endpoints
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

    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  register(payload: RegisterPayload): Promise<ApiResponse<RegisterResponse>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  logout(): Promise<ApiResponse<void>> {
    return this.request('/auth/logout', {
      method: 'POST',
    })
  }

  forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  resetPassword(token: string, password: string): Promise<ApiResponse<{ message: string }>> {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    })
  }

  // Generic GET request
  get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request(endpoint, { method: 'GET' })
  }

  // Generic POST request
  post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Generic PUT request
  put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Generic DELETE request
  delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request(endpoint, { method: 'DELETE' })
  }
}

export const authAPI = new ApiService()

