<script setup lang="ts">
defineProps<{ mediaUrl?: string }>()
</script>

<template>
  <div class="mma">
    <img v-if="mediaUrl" :src="mediaUrl" class="mma__img" alt="materi media" />
    <div v-else class="mma__placeholder" />
  </div>
</template>

<style scoped>
.mma {
  width: 100%;
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.mma__img {
  width: 100%;
  height: 280px;
  object-fit: cover;
}
.mma__placeholder {
  width: 100%;
  height: 280px;
  background: linear-gradient(135deg, var(--color-primary-muted) 0%, var(--color-border) 100%);
  border-radius: var(--radius-lg);
}
</style>