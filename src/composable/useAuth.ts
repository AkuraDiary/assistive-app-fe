import { ref, computed } from 'vue'
import { authAPI, type LoginPayload, type RegisterPayload, type LoginResponse } from '@/services/api'

interface User {
  id: string
  email: string
  fullName: string
  username?: string
  role?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Singleton store
const state = ref<AuthState>({
  user: null,
  token: localStorage.getItem('auth_token'),
  isAuthenticated: !!localStorage.getItem('auth_token'),
  isLoading: false,
  error: null,
})

export function useAuth() {
  const login = async (payload: LoginPayload) => {
    state.value.isLoading = true
    state.value.error = null

    try {
      const response = await authAPI.login(payload)

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Login failed')
      }

      const { token, user } = response.data

      // Store token
      localStorage.setItem('auth_token', token)

      // Update state
      state.value = {
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }

      return { success: true, user }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMsg = error.data?.message || error.message || 'Login failed'
      state.value.error = errorMsg
      state.value.isLoading = false

      return {
        success: false,
        error: errorMsg,
        errors: error.data?.errors,
      }
    }
  }

  const register = async (payload: RegisterPayload) => {
    state.value.isLoading = true
    state.value.error = null

    try {
      const response = await authAPI.register(payload)

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Registration failed')
      }

      const { user, token } = response.data

      // Store token if provided
      if (token) {
        localStorage.setItem('auth_token', token)
        state.value.token = token
      }

      // Update state
      state.value = {
        user,
        token: token || null,
        isAuthenticated: !!token,
        isLoading: false,
        error: null,
      }

      return { success: true, user }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMsg = error.data?.message || error.message || 'Registration failed'
      state.value.error = errorMsg
      state.value.isLoading = false

      return {
        success: false,
        error: errorMsg,
        errors: error.data?.errors,
      }
    }
  }

  const logout = async () => {
    state.value.isLoading = true

    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear state regardless of API response
      localStorage.removeItem('auth_token')
      state.value = {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }
    }
  }

  const clearError = () => {
    state.value.error = null
  }

  const user = computed(() => state.value.user)
  const token = computed(() => state.value.token)
  const isAuthenticated = computed(() => state.value.isAuthenticated)
  const isLoading = computed(() => state.value.isLoading)
  const error = computed(() => state.value.error)

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    // Actions
    login,
    register,
    logout,
    clearError,
  }
}