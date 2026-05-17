<script setup lang="ts">
import { ref } from 'vue'

import { AtSign, LockKeyhole, ArrowRight } from 'lucide-vue-next'

const form = ref({
  email: '',
  password: '',
})
</script>

<template>
  <AuthLayout>
    <template #left>
      <div class="w-full max-w-[340px]">
        <h1 class="mb-10 text-center text-5xl font-bold text-[#008BD8]">Selamat Datang!</h1>

        <AuthTabs active="login" />

        <div class="mt-8 space-y-5">
          <BaseTextField
            v-model="form.email"
            label="Email"
            placeholder="Masukkan Email Anda"
            color="secondary"
          >
            <template #leading>
              <AtSign class="w-4 h-4 text-[#FF3C8A]" />
            </template>
          </BaseTextField>

          <BaseTextField
            v-model="form.password"
            label="Kata Sandi"
            type="password"
            placeholder="Masukkan Sandi Anda"
            color="secondary"
          >
            <template #leading>
              <LockKeyhole class="w-4 h-4 text-[#FF3C8A]" />
            </template>
          </BaseTextField>

          <div class="text-right">
            <button class="text-sm text-[#FF70A9]">Lupa sandi?</button>
          </div>

          <div class="flex justify-center pt-2">
            <BaseButton color="primary" size="lg">
              MASUK

              <template #trailing>
                <ArrowRight class="w-5 h-5" />
              </template>
            </BaseButton>
          </div>

          <div class="flex items-center gap-3 py-4">
            <div class="h-px flex-1 bg-[#FF70A9]" />

            <span class="text-sm text-[#FF70A9]"> atau lanjutkan dengan </span>

            <div class="h-px flex-1 bg-[#FF70A9]" />
          </div>

          <button
            class="flex h-12 w-full items-center justify-center gap-3 rounded-[16px] border border-[#8ED7FF] bg-white font-semibold text-[#56BFF9]"
          >
            <span class="text-2xl"> G </span>

            Google
          </button>
        </div>
      </div>
    </template>

    <template #right>
      <AuthHero />
    </template>
  </AuthLayout>
</template>
