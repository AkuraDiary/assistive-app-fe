/**
 * passwordResetAPI.ts
 * Handles all password-reset related API calls.
 * Extend the base URL or swap the implementation when the backend is ready.
 */

import type { ApiResponse } from './api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api'

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  const token = localStorage.getItem('auth_token')
  if (token) headers['Authorization'] = `Bearer ${token}`

  const response = await fetch(url, { ...options, headers })
  const data = await response.json()

  if (!response.ok) throw { status: response.status, data }

  return data
}

// ─── Payload & Response Types ─────────────────────────────────────────────────

export interface ForgotPasswordPayload {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
  /** Masked email returned by backend, e.g. "ari*******@gmail.com" */
  maskedEmail?: string
}

export interface VerifyOtpPayload {
  email: string
  otp: string
}

export interface VerifyOtpResponse {
  /** Short-lived token used to authorise the reset-password call */
  resetToken: string
}

export interface ResetPasswordPayload {
  resetToken: string
  newPassword: string
}

export interface ResetPasswordResponse {
  message: string
}

export interface ResendOtpPayload {
  email: string
}

// ─── API Methods ──────────────────────────────────────────────────────────────

export const passwordResetAPI = {
  /**
   * Step 1 — request a reset code be sent to the given email.
   */
  forgotPassword(payload: ForgotPasswordPayload) {
    return request<ForgotPasswordResponse>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  /**
   * Step 2 — verify the 6-digit OTP code.
   * On success the backend returns a short-lived `resetToken`.
   */
  verifyOtp(payload: VerifyOtpPayload) {
    return request<VerifyOtpResponse>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  /**
   * Step 2b — resend the OTP to the same email.
   */
  resendOtp(payload: ResendOtpPayload) {
    return request<ForgotPasswordResponse>('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  /**
   * Step 3 — set the new password using the `resetToken` from step 2.
   */
  resetPassword(payload: ResetPasswordPayload) {
    return request<ResetPasswordResponse>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}