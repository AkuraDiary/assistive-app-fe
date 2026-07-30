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

// Only generic config and ApiService class remaining


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

  // Auth endpoints moved to AuthService.ts

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

export const apiService = new ApiService()

