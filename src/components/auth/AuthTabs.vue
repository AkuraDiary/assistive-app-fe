<script setup lang="ts">
import { LogIn, UserPlus } from 'lucide-vue-next'

interface Props {
  active?: 'login' | 'register'
}

withDefaults(defineProps<Props>(), {
  active: 'login',
})
</script>

<template>
  <div class="flex justify-center gap-4 rounded-[24px] border border-gray-200 bg-white p-4">
    <RouterLink to="/login">
      <BaseButton :variant="active === 'login' ? 'solid' : 'outline'" color="primary" size="lg">
        <template #leading>
          <LogIn class="h-5 w-5" />
        </template>
        Masuk
      </BaseButton>
    </RouterLink>

    <RouterLink to="/register">
      <BaseButton :variant="active === 'register' ? 'solid' : 'outline'" color="primary" size="lg">
        <template #leading>
          <UserPlus class="h-5 w-5" />
        </template>
        Daftar
      </BaseButton>
    </RouterLink>
  </div>
</template>
