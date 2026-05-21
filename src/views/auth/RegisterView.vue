<script setup lang="ts">
import { ref, computed } from 'vue'
import { AtSign, LockKeyhole, ArrowRight, Phone } from 'lucide-vue-next'
import { useAuth } from '@/composable/useAuth'
import { validators } from '@/utils/validators'

const { register, error: authError } = useAuth()

interface FormData {
  fullName: string
  username: string
  email: string
  phone: string
  password: string
}

interface FormErrors {
  fullName?: string
  username?: string
  email?: string
  phone?: string
  password?: string
}

const form = ref<FormData>({
  fullName: '',
  username: '',
  email: '',
  phone: '',
  password: '',
})

const errors = ref<FormErrors>({})
const isLoading = ref(false)

const isFormValid = computed(() => {
  return (
    form.value.fullName.trim() &&
    form.value.username.trim() &&
    form.value.email.trim() &&
    form.value.phone.trim() &&
    form.value.password.trim()
  )
})

const validateForm = (): boolean => {
  errors.value = {}

  // Full Name validation
  let validation = validators.required('Nama lengkap')(form.value.fullName)
  if (validation !== true) {
    errors.value.fullName = validation
  } else {
    validation = validators.minLength(3, 'Nama lengkap')(form.value.fullName)
    if (validation !== true) {
      errors.value.fullName = validation
    }
  }

  // Username validation
  validation = validators.required('Nama pengguna')(form.value.username)
  if (validation !== true) {
    errors.value.username = validation
  } else {
    validation = validators.minLength(3, 'Username')(form.value.username)
    if (validation !== true) {
      errors.value.username = validation
    } else {
      validation = validators.username(form.value.username)
      if (validation !== true) {
        errors.value.username = validation
      }
    }
  }

  // Email validation
  validation = validators.required('Email')(form.value.email)
  if (validation !== true) {
    errors.value.email = validation
  } else {
    validation = validators.email(form.value.email)
    if (validation !== true) {
      errors.value.email = validation
    }
  }

  // Phone validation
  validation = validators.required('Nomor telepon')(form.value.phone)
  if (validation !== true) {
    errors.value.phone = validation
  } else {
    validation = validators.phone(form.value.phone)
    if (validation !== true) {
      errors.value.phone = validation
    }
  }

  // Password validation
  validation = validators.required('Password')(form.value.password)
  if (validation !== true) {
    errors.value.password = validation
  } else {
    validation = validators.password(form.value.password)
    if (validation !== true) {
      errors.value.password = validation
    }
  }

  return Object.keys(errors.value).length === 0
}

const handleRegister = async () => {
  if (!validateForm()) return

  isLoading.value = true
  try {
    const result = await register({
      fullName: form.value.fullName,
      username: form.value.username,
      email: form.value.email,
      phone: form.value.phone,
      password: form.value.password,
    })

    if (result.success) {
      // TODO: Navigate to dashboard or verify email page
      console.log('Register successful:', result.user)
      // router.push('/verify-email')
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <AuthLayout>
    <template #left>
      <div class="w-full max-w-[340px]">
        <h1 class="mb-10 text-center text-4xl font-bold text-primary">Selamat Datang!</h1>

        <AuthTabs active="register" />

        <!-- API Error Alert -->
        <div v-if="authError" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {{ authError }}
        </div>

        <form class="mt-8 space-y-4" @submit.prevent="handleRegister">
          <!-- Full Name Field -->
          <BaseTextField
            v-model="form.fullName"
            label="Nama Lengkap"
            placeholder="Contoh: Syahril"
            color="primary"
            :error="errors.fullName"
            @blur="validateForm"
          />

          <!-- Username Field -->
          <BaseTextField
            v-model="form.username"
            label="Nama Pengguna"
            placeholder="Contoh: syahrilllll"
            color="primary"
            :error="errors.username"
            @blur="validateForm"
          />

          <!-- Email Field -->
          <BaseTextField
            v-model="form.email"
            label="Email"
            placeholder="Masukkan Email Anda"
            color="primary"
            :error="errors.email"
            @blur="validateForm"
          >
            <template #leading>
              <AtSign class="h-4 w-4 text-primary" />
            </template>
          </BaseTextField>

          <!-- Phone Number Field -->
          <BaseTextField
            v-model="form.phone"
            label="No. Telepon"
            placeholder="Contoh: 0812345678"
            color="primary"
            :error="errors.phone"
            @blur="validateForm"
          >
            <template #leading>
              <Phone class="h-4 w-4 text-primary" />
            </template>
          </BaseTextField>

          <!-- Password Field -->
          <BaseTextField
            v-model="form.password"
            label="Kata Sandi"
            type="password"
            placeholder="Masukkan Sandi Anda"
            color="primary"
            :error="errors.password"
            @blur="validateForm"
          >
            <template #leading>
              <LockKeyhole class="h-4 w-4 text-primary" />
            </template>
          </BaseTextField>

          <!-- Register Button -->
          <div class="flex justify-center pt-6">
            <BaseButton
              type="submit"
              color="primary"
              size="lg"
              :disabled="!isFormValid || isLoading"
            >
              {{ isLoading ? 'Memproses...' : 'DAFTAR' }}

              <template #trailing>
                <ArrowRight class="h-5 w-5" />
              </template>
            </BaseButton>
          </div>
        </form>
      </div>
    </template>

    <template #right>
      <AuthHero />
    </template>
  </AuthLayout>
</template>
