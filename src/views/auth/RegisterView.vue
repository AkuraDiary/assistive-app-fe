<script setup lang="ts">
import { ref } from 'vue'

import { AtSign, LockKeyhole, ArrowRight } from 'lucide-vue-next'

const form = ref({
  name: '',
  username: '',
  email: '',
  phone: '',
  password: '',
})
</script>

<template>
  <AuthLayout>
    <template #left>
      <div class="w-full max-w-[340px]">
        <h1 class="mb-10 text-center text-5xl font-bold text-[#008BD8]">Selamat Datang!</h1>

        <AuthTabs active="register" />

        <div class="mt-8 space-y-4">
          <BaseTextField
            v-model="form.name"
            label="Nama Lengkap"
            placeholder="Contoh: Syahril"
            color="secondary"
          />

          <BaseTextField
            v-model="form.username"
            label="Nama Pengguna"
            placeholder="Contoh: syahrilllll"
            color="secondary"
          />

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
            v-model="form.phone"
            label="No. Telepon"
            placeholder="Contoh: 0812345678"
            color="secondary"
          />

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

          <div class="flex justify-center pt-6">
            <BaseButton color="primary" size="lg">
              DAFTAR

              <template #trailing>
                <ArrowRight class="w-5 h-5" />
              </template>
            </BaseButton>
          </div>
        </div>
      </div>
    </template>

    <template #right>
      <AuthHero />
    </template>
  </AuthLayout>
</template>
