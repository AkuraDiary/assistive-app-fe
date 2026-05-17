<script setup lang="ts">
interface Props {
  active?: 'login' | 'register'
}

withDefaults(defineProps<Props>(), {
  active: 'login',
})
</script>

<template>
  <div class="flex gap-4 rounded-[24px] border border-[#8ED7FF] bg-white p-4">
    <RouterLink to="/login">
      <BaseButton :variant="active === 'login' ? 'solid' : 'outline'" color="primary" size="lg">
        <template #leading> → </template>

        Masuk
      </BaseButton>
    </RouterLink>

    <RouterLink to="/register">
      <BaseButton :variant="active === 'register' ? 'solid' : 'outline'" color="primary" size="lg">
        <template #leading> + </template>

        Daftar
      </BaseButton>
    </RouterLink>
  </div>
</template>
