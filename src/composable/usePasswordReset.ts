/**
 * usePasswordReset.ts
 * Composable for the full forgot-password → verify-OTP → reset-password flow.
 *
 * State is kept in a module-level singleton so it persists across route
 * transitions without Pinia. Swap to a Pinia store if you need devtools support.
 */

import { ref, computed } from 'vue'
import { passwordResetAPI } from '@/services/passwordResetAPI'

// ─── Shared singleton state ───────────────────────────────────────────────────

const email = ref<string>('')
const maskedEmail = ref<string>('')
const resetToken = ref<string | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)

function clearMessages() {
  error.value = null
  successMessage.value = null
}

function reset() {
  email.value = ''
  maskedEmail.value = ''
  resetToken.value = null
  isLoading.value = false
  error.value = null
  successMessage.value = null
}

// ─── Composable ───────────────────────────────────────────────────────────────

export function usePasswordReset() {
  /**
   * Step 1 — send reset email.
   * Returns { success: true } on success so the view can navigate.
   */
  async function sendResetEmail(userEmail: string) {
    clearMessages()
    isLoading.value = true
    try {
      email.value = userEmail
      const response = await passwordResetAPI.forgotPassword({ email: userEmail })

      if (!response.success) throw new Error(response.message ?? 'Gagal mengirim email')

      maskedEmail.value = response.data?.maskedEmail ?? maskEmail(userEmail)
      successMessage.value = response.data?.message ?? 'Kode verifikasi telah dikirim'
      return { success: true }
    } catch (err: unknown) {
      const msg = extractErrorMessage(err, 'Email tidak terdaftar, periksa kembali!')
      error.value = msg
      return { success: false, error: msg }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Step 2 — verify OTP code.
   * On success, stores the resetToken for step 3.
   */
  async function verifyOtp(otp: string) {
    clearMessages()
    isLoading.value = true
    try {
      const response = await passwordResetAPI.verifyOtp({ email: email.value, otp })

      if (!response.success || !response.data)
        throw new Error(response.message ?? 'Kode verifikasi tidak valid')

      resetToken.value = response.data.resetToken
      return { success: true }
    } catch (err: unknown) {
      const msg = extractErrorMessage(err, 'Kode verifikasi tidak valid atau kadaluarsa')
      error.value = msg
      return { success: false, error: msg }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Step 2b — resend OTP.
   */
  async function resendOtp() {
    clearMessages()
    isLoading.value = true
    try {
      const response = await passwordResetAPI.resendOtp({ email: email.value })

      if (!response.success) throw new Error(response.message ?? 'Gagal mengirim ulang kode')

      successMessage.value = 'Kode verifikasi baru telah dikirim'
      return { success: true }
    } catch (err: unknown) {
      const msg = extractErrorMessage(err, 'Gagal mengirim ulang kode verifikasi')
      error.value = msg
      return { success: false, error: msg }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Step 3 — set new password.
   * Clears flow state on success.
   */
  async function resetPassword(newPassword: string) {
    if (!resetToken.value) {
      error.value = 'Sesi tidak valid, silakan mulai ulang'
      return { success: false, error: error.value }
    }

    clearMessages()
    isLoading.value = true
    try {
      const response = await passwordResetAPI.resetPassword({
        resetToken: resetToken.value,
        newPassword,
      })

      if (!response.success) throw new Error(response.message ?? 'Gagal mengubah kata sandi')

      successMessage.value = 'Kata sandi berhasil diubah!'
      reset() // clear sensitive state after success
      return { success: true }
    } catch (err: unknown) {
      const msg = extractErrorMessage(err, 'Gagal mengubah kata sandi, coba lagi')
      error.value = msg
      return { success: false, error: msg }
    } finally {
      isLoading.value = false
    }
  }

  return {
    // reactive state (read-only outside)
    email: computed(() => email.value),
    maskedEmail: computed(() => maskedEmail.value),
    resetToken: computed(() => resetToken.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    successMessage: computed(() => successMessage.value),
    // actions
    sendResetEmail,
    verifyOtp,
    resendOtp,
    resetPassword,
    clearMessages,
    reset,
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function maskEmail(raw: string): string {
  const [local, domain] = raw.split('@')
  if (!local || !domain) return raw
  return `${local.slice(0, 3)}${'*'.repeat(Math.max(local.length - 3, 4))}@${domain}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === 'object' && err !== null) {
    const e = err as { data?: { message?: string }; message?: string }
    return e.data?.message ?? e.message ?? fallback
  }
  return fallback
}