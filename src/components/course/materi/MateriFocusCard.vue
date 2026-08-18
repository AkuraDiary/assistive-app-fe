<script setup lang="ts">
defineProps<{
  focusHuruf: string
  instruction?: string
}>()
</script>

<template>
  <div class="mfc">
    <p class="mfc__label">Fokus Pada Huruf: {{ focusHuruf }}</p>
    <div class="mfc__letter">{{ focusHuruf }}</div>
    <p class="mfc__instruction">{{ instruction }}</p>
  </div>
</template>

<style scoped>
.mfc {
  background: var(--color-primary-muted);
  border-radius: var(--radius-lg);
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 440px;
  margin: 0 auto;
  width: 100%;
}
.mfc__label {
  font-size: calc(14px * var(--text-scale, 1));
  font-weight: 600;
  color: var(--color-text-dark);
  margin: 0;
}
.mfc__letter {
  font-size: calc(96px * var(--text-scale, 1));
  font-weight: 900;
  color: var(--color-text-dark);
  line-height: 1;
}
.mfc__instruction {
  font-size: calc(13px * var(--text-scale, 1));
  color: var(--color-text-light);
  margin: 0;
  text-align: center;
}
</style>