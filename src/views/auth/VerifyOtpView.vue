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
        <h1 class="text-4xl font-bold text-neutral-800">2-Tahap Verifikasi</h1>
        <p class="mt-4 text-base text-neutral-500 leading-relaxed">
          Kami telah mengirimkan kode verifikasi ke
          <span class="font-semibold text-blue-500">{{ maskedEmail }}</span
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
            class="w-full max-w-[560px]"
            :disabled="!isComplete || isLoading"
            @click="handleVerify"
          >
            {{ isLoading ? 'Memverifikasi...' : 'Verifikasi & Login' }}
          </BaseButton>
        </div>

        <!-- Resend -->
        <p class="mt-6 text-sm text-neutral-600">
          Belum menerima kode?
          <button
            class="font-semibold text-blue-500 hover:underline disabled:opacity-50"
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
