<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { AtSign, LockKeyhole, ArrowRight } from 'lucide-vue-next'
import { useAuth } from '@/composable/useAuth'
import { validators } from '@/utils/validators'

const router = useRouter()
const { login, error: authError } = useAuth()

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
}

const form = ref<FormData>({
  email: '',
  password: '',
})

const errors = ref<FormErrors>({})
const isLoading = ref(false)

const isFormValid = computed(() => {
  return form.value.email.trim() && form.value.password.trim()
})

const validateForm = (): boolean => {
  errors.value = {}

  const emailValidation = validators.required('Email')(form.value.email)
  if (emailValidation !== true) {
    errors.value.email = emailValidation
  } else {
    const emailCheck = validators.email(form.value.email)
    if (emailCheck !== true) {
      errors.value.email = emailCheck
    }
  }

  const passwordValidation = validators.required('Password')(form.value.password)
  if (passwordValidation !== true) {
    errors.value.password = passwordValidation
  }

  return Object.keys(errors.value).length === 0
}

const handleLogin = async () => {
  if (!validateForm()) return

  isLoading.value = true
  try {
    const result = await login({
      email: form.value.email,
      password: form.value.password,
    })

    if (result.success) {
      // TODO: Navigate to dashboard
      console.log('Login successful:', result.user)
      // router.push('/dashboard')
    } else {
      errors.value.email = result.error
    }
  } finally {
    isLoading.value = false
  }
}

const handleGoogleLogin = () => {
  // TODO: Implement Google OAuth
  console.log('Google login clicked')
}

const handleForgotPassword = () => {
  // TODO: Navigate to forgot password page
  router.push('/forgot-password')
}
</script>

<template>
  <AuthLayout>
    <template #left>
      <div class="w-full max-w-[340px]">
        <h1 class="mb-10 text-center text-5xl font-bold text-[#008BD8]">
          Selamat Datang!
        </h1>

        <AuthTabs active="login" />

        <!-- API Error Alert -->
        <div
          v-if="authError"
          class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {{ authError }}
        </div>

        <form class="mt-8 space-y-5" @submit.prevent="handleLogin">
          <!-- Email Field -->
          <BaseTextField
            v-model="form.email"
            label="Email"
            placeholder="Masukkan Email Anda"
            color="secondary"
            :error="errors.email"
            @blur="validateForm"
          >
            <template #leading>
              <AtSign class="h-4 w-4 text-[#FF3C8A]" />
            </template>
          </BaseTextField>

          <!-- Password Field -->
          <BaseTextField
            v-model="form.password"
            label="Kata Sandi"
            type="password"
            placeholder="Masukkan Sandi Anda"
            color="secondary"
            :error="errors.password"
            @blur="validateForm"
          >
            <template #leading>
              <LockKeyhole class="h-4 w-4 text-[#FF3C8A]" />
            </template>
          </BaseTextField>

          <!-- Forgot Password Link -->
          <div class="text-right">
            <button
              type="button"
              class="text-sm text-[#FF70A9] transition-colors hover:text-[#FF3C8A]"
              @click="handleForgotPassword"
            >
              Lupa sandi?
            </button>
          </div>

          <!-- Login Button -->
          <div class="flex justify-center pt-2">
            <BaseButton
              type="submit"
              color="primary"
              size="lg"
              :disabled="!isFormValid || isLoading"
            >
              {{ isLoading ? 'Memproses...' : 'MASUK' }}

              <template #trailing>
                <ArrowRight class="h-5 w-5" />
              </template>
            </BaseButton>
          </div>

          <!-- Divider -->
          <div class="flex items-center gap-3 py-4">
            <div class="h-px flex-1 bg-[#FF70A9]" />
            <span class="text-sm text-[#FF70A9]">atau lanjutkan dengan</span>
            <div class="h-px flex-1 bg-[#FF70A9]" />
          </div>

          <!-- Google Login Button -->
          <button
            type="button"
            class="flex h-12 w-full items-center justify-center gap-3 rounded-[16px] border border-[#8ED7FF] bg-white font-semibold text-[#56BFF9] transition-colors hover:bg-white"
            @click="handleGoogleLogin"
          >
            <span class="text-2xl">G</span>
            Google
          </button>
        </form>
      </div>
    </template>

    <template #right>
      <AuthHero />
    </template>
  </AuthLayout>
</template>