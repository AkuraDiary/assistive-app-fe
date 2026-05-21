<script setup lang="ts">
/**
 * ForgotPasswordView.vue
 * Step 1 of the password-reset flow.
 * On success, navigates to the OTP verification page.
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { AtSign, ArrowLeft } from 'lucide-vue-next'
import { validators } from '@/utils/validators'
import { usePasswordReset } from '@/composable/usePasswordReset'

const router = useRouter()
const { sendResetEmail, isLoading, error, clearMessages } = usePasswordReset()

const email = ref('')
const localError = ref<string | null>(null)

const isFormValid = computed(() => email.value.trim().length > 0)

function validateEmail(): boolean {
  localError.value = null
  const requiredCheck = validators.required('Email')(email.value)
  if (requiredCheck !== true) {
    localError.value = requiredCheck
    return false
  }
  const emailCheck = validators.email(email.value)
  if (emailCheck !== true) {
    localError.value = emailCheck
    return false
  }
  return true
}

async function handleSubmit() {
  if (!validateEmail()) return
  clearMessages()

  const result = await sendResetEmail(email.value)

  if (result.success) {
    router.push({ name: 'verify-otp' })
  }
  // API error is surfaced via `error` from composable
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-[#F2F2F7] px-4">
    <div
      class="w-full max-w-[480px] rounded-3xl border-primary border-2 bg-white px-10 py-12 shadow-sm"
    >
      <!-- Title -->
      <h1 class="text-center text-3xl font-bold text-neutral-800">Lupa Sandi?</h1>
      <p class="mt-3 text-center text-sm text-neutral-500">
        Masukkan Email Anda untuk atur ulang sandi
      </p>

      <!-- API / network error banner -->
      <div
        v-if="error"
        class="mt-6 rounded-lg bg-red-100 px-4 py-3 text-sm font-medium text-red-700"
      >
        {{ error }}
      </div>

      <div class="mt-8 space-y-4">
        <!-- Email Field -->
        <BaseTextField
          v-model="email"
          label="Email"
          placeholder="Masukkan Email Anda"
          color="primary"
          :error="localError ?? undefined"
          @blur="validateEmail"
        >
          <template #leading>
            <AtSign class="h-4 w-4 text-primary" />
          </template>
        </BaseTextField>

        <!-- Submit -->
        <BaseButton
          color="primary"
          size="lg"
          class="w-full"
          :disabled="!isFormValid || isLoading"
          @click="handleSubmit"
        >
          {{ isLoading ? 'Mengirim...' : 'KIRIM' }}
        </BaseButton>

        <!-- Back to login -->
        <div class="flex justify-center pt-1">
          <RouterLink
            to="/login"
            class="flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <ArrowLeft class="h-4 w-4" />
            Kembali ke Halaman Login
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
