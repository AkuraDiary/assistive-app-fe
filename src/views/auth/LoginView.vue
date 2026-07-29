<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { AtSign, LockKeyhole, ArrowRight } from 'lucide-vue-next'
import { useAuth } from '@/composable/useAuth'
import { validators } from '@/utils/validators'
import AppLogo from '@/components/shared/AppLogo.vue'

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
      console.log('Login successful:', result.user)
      router.push('/dashboard')
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
  router.push('/reset-password')
}

const fillDummy = (role: string) => {
  form.value.email = `${role}@test.com`
  form.value.password = 'password123'
}
</script>

<template>
  <AuthLayout>
    <template #left>
      <div class="flex h-full flex-col justify-between p-6">
        <AppLogo class="absolute top-2 left-4 z-10 m-4" />
        <div class="mx-auto w-full max-w-[350px] flex-1 flex flex-col justify-center">
          <h1 class="mb-12 text-center text-[32px] font-bold text-gray-900">Selamat Datang!</h1>

          <AuthTabs active="login" />

          <!-- API Error Alert -->
          <div v-if="authError" class="my-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {{ authError }}
          </div>

          <form class="mt-8 space-y-5" @submit.prevent="handleLogin">
            <!-- Email Field -->
            <BaseTextField
              v-model="form.email"
              label="Email"
              placeholder="Masukkan Email Anda"
              color="primary"
              border="border border-gray-200"
              :error="errors.email"
              @blur="validateForm"
            >
              <template #leading>
                <AtSign class="h-4 w-4 text-primary" />
              </template>
            </BaseTextField>

            <!-- Password Field -->
            <BaseTextField
              v-model="form.password"
              label="Kata Sandi"
              type="password"
              placeholder="Masukkan Sandi Anda"
              color="primary"
              border="border border-gray-200"
              :error="errors.password"
              @blur="validateForm"
            >
              <template #leading>
                <LockKeyhole class="h-4 w-4 text-primary" />
              </template>
            </BaseTextField>

            <!-- Forgot Password Link -->
            <div class="text-center">
              <button
                type="button"
                class="text-[13px] font-semibold text-gray-700 transition-colors hover:text-primary"
                @click="handleForgotPassword"
              >
                Lupa kata sandi?
              </button>
            </div>

            <!-- Login Button -->
            <div class="flex justify-center pt-2">
              <BaseButton
                type="submit"
                color="primary"
                size="lg"
                class="w-[160px] h-[48px] rounded-[16px] text-base font-bold shadow-sm"
                :disabled="!isFormValid || isLoading"
              >
                {{ isLoading ? 'Memproses...' : 'Masuk' }}
                <template #trailing>
                  <ArrowRight class="h-5 w-5" />
                </template>
              </BaseButton>
            </div>

            <!-- Divider -->
            <div class="flex items-center gap-4 py-4">
              <div class="h-[1px] flex-1 bg-gray-300" />
              <span class="text-[13px] text-gray-500">atau lanjutkan dengan</span>
              <div class="h-[1px] flex-1 bg-gray-300" />
            </div>

            <!-- Google Login Button -->
            <button
              type="button"
              class="flex h-12 w-full items-center justify-center gap-3 rounded-[16px] border border-primary/30 bg-white font-semibold text-primary transition-colors hover:bg-primary/5"
              @click="handleGoogleLogin"
            >
              <span class="text-2xl font-bold">G</span>
              Google
            </button>
            
            <!-- Quick Login Helpers for Testing -->
            <div class="mt-6 pt-4 border-t border-gray-200">
              <p class="text-xs text-gray-500 mb-2 text-center">Test Accounts (Auto-fill)</p>
              <div class="flex flex-wrap justify-center gap-2">
                <button type="button" @click="fillDummy('parent')" class="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 hover:bg-gray-200">Parent</button>
                <button type="button" @click="fillDummy('teacher')" class="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 hover:bg-gray-200">Teacher</button>
                <button type="button" @click="fillDummy('institution')" class="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 hover:bg-gray-200">Institution</button>
                <button type="button" @click="fillDummy('admin')" class="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 hover:bg-gray-200">Admin</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </template>
    <template #right>
      <AuthHero
        title="Belajar Seru, Lebih Mudah"
        subtitle="Menemani perjalanan belajar yang menyenangkan, adaptif, dan ramah disleksia. Karena setiap anak punya cara uniknya sendiri untuk memahami dunia."
      />
    </template>
  </AuthLayout>
</template>
