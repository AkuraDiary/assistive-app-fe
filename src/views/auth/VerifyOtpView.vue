<script setup lang="ts">
/**
 * VerifyOtpView.vue
 * Step 2 of the password-reset flow.
 * Guards against direct access (redirects if no email in state).
 */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePasswordReset } from '@/composable/usePasswordReset'
import BaseOtpInput from '@/components/shared/input/BaseOtpInput.vue'

const router = useRouter()
const {
  maskedEmail,
  email,
  isLoading,
  error,
  successMessage,
  verifyOtp,
  resendOtp,
  clearMessages,
} = usePasswordReset()

const otpValue = ref('')
const otpInputRef = ref<InstanceType<typeof BaseOtpInput> | null>(null)

// Guard: if flow wasn't started, send back to forgot-password
onMounted(() => {
  if (!email.value) router.replace({ name: 'forgot-password' })
})

const isComplete = computed(() => otpValue.value.length === 6)

async function handleVerify() {
  if (!isComplete.value) return
  clearMessages()

  const result = await verifyOtp(otpValue.value)

  if (result.success) {
    router.push({ name: 'reset-password' })
  } else {
    // Clear OTP boxes on failure so user can retry cleanly
    otpValue.value = ''
    otpInputRef.value?.reset()
  }
}

async function handleResend() {
  clearMessages()
  otpValue.value = ''
  otpInputRef.value?.reset()
  await resendOtp()
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-[#F2F2F7]">
    <!-- Logo -->
    <div class="p-6">
      <AppLogo />
    </div>

    <!-- Content -->
    <div class="flex flex-1 flex-col items-center justify-center px-4 pb-20">
      <div class="w-full max-w-[640px] text-center">
        <!-- Title -->
        <h1 class="text-[32px] font-bold text-gray-900">2-Tahap Verifikasi</h1>
        <p class="mt-4 text-base text-gray-500 leading-relaxed">
          Kami telah mengirimkan kode verifikasi ke
          <span class="font-bold text-gray-900">{{ maskedEmail }}</span
          >, <br />masukkan kode tersebut di kolom di bawah ini.
        </p>

        <!-- Success banner (resend confirmation) -->
        <div
          v-if="successMessage"
          class="mx-auto mt-6 max-w-sm rounded-lg bg-green-100 px-4 py-3 text-sm font-medium text-green-700"
        >
          {{ successMessage }}
        </div>

        <!-- Error banner -->
        <div
          v-if="error"
          class="mx-auto mt-6 max-w-sm rounded-lg bg-red-100 px-4 py-3 text-sm font-medium text-red-700"
        >
          {{ error }}
        </div>

        <!-- OTP Input -->
        <div class="mt-10">
          <BaseOtpInput
            ref="otpInputRef"
            v-model="otpValue"
            :length="6"
            :disabled="isLoading"
            :has-error="!!error"
            @complete="handleVerify"
          />
        </div>

        <!-- Verify Button -->
        <div class="mt-8">
          <BaseButton
            color="primary"
            size="lg"
            class="w-full max-w-[560px] h-[48px] rounded-[16px] text-base font-bold shadow-sm"
            :disabled="!isComplete || isLoading"
            @click="handleVerify"
          >
            {{ isLoading ? 'Memverifikasi...' : 'Verifikasi Kode' }}
          </BaseButton>
        </div>

        <!-- Resend -->
        <p class="mt-6 text-sm text-gray-500">
          Belum menerima kode?
          <button
            class="font-bold text-primary hover:opacity-80 disabled:opacity-50 transition-opacity"
            :disabled="isLoading"
            @click="handleResend"
          >
            Kirim Ulang
          </button>
        </p>
      </div>
    </div>
  </div>
</template>
