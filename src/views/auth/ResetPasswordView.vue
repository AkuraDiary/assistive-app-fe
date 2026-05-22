<script setup lang="ts">
/**
 * ResetPasswordView.vue
 * Step 3 of the password-reset flow.
 * Guards against direct access (redirects if no resetToken in state).
 */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { usePasswordReset } from '@/composable/usePasswordReset'
import { validators } from '@/utils/validators'

const router = useRouter()
const {
  maskedEmail,
  resetToken,
  isLoading,
  error,
  resetPassword,
  clearMessages,
} = usePasswordReset()

// Guard: must have gone through OTP step
onMounted(() => {
  if (!resetToken.value) router.replace({ name: 'forgot-password' })
})

interface FormData {
  newPassword: string
  confirmPassword: string
}

interface FormErrors {
  newPassword?: string
  confirmPassword?: string
}

const form = ref<FormData>({ newPassword: '', confirmPassword: '' })
const errors = ref<FormErrors>({})
const isSuccess = ref(false)

const isFormValid = computed(
  () => form.value.newPassword.trim() && form.value.confirmPassword.trim(),
)

function validateForm(): boolean {
  errors.value = {}

  // New password
  let v = validators.required('Kata sandi baru')(form.value.newPassword)
  if (v !== true) { errors.value.newPassword = v; }
  else {
    v = validators.password(form.value.newPassword)
    if (v !== true) errors.value.newPassword = v
  }

  // Confirm password
  v = validators.required('Konfirmasi kata sandi')(form.value.confirmPassword)
  if (v !== true) { errors.value.confirmPassword = v; }
  else {
    v = validators.match(form.value.newPassword, 'Kata sandi')(form.value.confirmPassword)
    if (v !== true) errors.value.confirmPassword = v
  }

  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validateForm()) return
  clearMessages()

  const result = await resetPassword(form.value.newPassword)
  if (result.success) {
    isSuccess.value = true
    // Give user a moment to read the success state, then go to login
    setTimeout(() => router.push({ name: 'login' }), 2000)
  }
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
      <div class="w-full max-w-[560px]">

        <!-- Success State -->
        <template v-if="isSuccess">
          <div class="text-center">
            <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <svg class="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 class="text-3xl font-bold text-neutral-800">Kata Sandi Diperbarui!</h1>
            <p class="mt-3 text-sm text-neutral-500">
              Kata sandi Anda berhasil diubah. Mengarahkan ke halaman login…
            </p>
          </div>
        </template>

        <!-- Form State -->
        <template v-else>
          <!-- Title -->
          <h1 class="text-center text-3xl font-bold text-neutral-800">Buat Sandi Baru</h1>
          <p class="mt-3 text-center text-sm text-neutral-500 leading-relaxed">
            Kami menerima permintaan atur ulang sandi. Silahkan masukkan sandi baru Anda!
          </p>

          <!-- API error -->
          <div
            v-if="error"
            class="mt-6 rounded-lg bg-red-100 px-4 py-3 text-sm font-medium text-red-700"
          >
            {{ error }}
          </div>

          <div class="mt-8 space-y-5">
            <!-- Masked email (read-only) -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-neutral-700">Email</label>
              <div class="flex h-[52px] w-full items-center rounded-2xl bg-purple-200/60 px-4 text-sm text-purple-400 font-medium select-none">
                {{ maskedEmail }}
              </div>
            </div>

            <!-- New password -->
            <BaseTextField
              v-model="form.newPassword"
              label="Kata sandi baru"
              placeholder="Kata sandi baru"
              type="password"
              color="primary"
              :error="errors.newPassword"
              @blur="validateForm"
            />

            <!-- Confirm password -->
            <BaseTextField
              v-model="form.confirmPassword"
              label="Konfirmasi kata sandi"
              placeholder="Konfirmasi ulang kata sandi"
              type="password"
              color="primary"
              :error="errors.confirmPassword"
              @blur="validateForm"
            />

            <!-- Submit -->
            <BaseButton
              color="primary"
              size="lg"
              class="w-full"
              :disabled="!isFormValid || isLoading"
              @click="handleSubmit"
            >
              {{ isLoading ? 'Memproses...' : 'Ubah kata sandi' }}
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
        </template>

      </div>
    </div>
  </div>
</template>