<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Belajar Seru, Lebih Mudah',
  subtitle:
    'Menemani perjalanan belajar yang menyenangkan, adaptif, dan ramah disleksia. Karena setiap anak punya cara uniknya sendiri untuk memahami dunia.',
})
</script>

<template>
  <div class="max-w-xl mx-auto flex flex-col items-center justify-center text-center">
    <h1 class="text-[40px] font-bold text-gray-900 leading-tight">{{ title }}</h1>

    <p class="mt-4 text-lg leading-relaxed text-gray-500 px-4">
      {{ subtitle }}
    </p>

    <!-- Placeholder Illustration -->
    <div
      class="relative mt-12 mx-auto h-[480px] w-full max-w-[480px] overflow-hidden rounded-[32px] bg-gradient-to-br from-[#F0F2F9] to-[#F1F6EC]"
    >
      <!-- Decorative light swoop -->
      <div class="absolute -bottom-10 -left-10 h-[600px] w-[600px] rounded-[100%] bg-white/40 shadow-[inset_0_0_50px_rgba(255,255,255,0.5)]" />
    </div>
  </div>
</template>
