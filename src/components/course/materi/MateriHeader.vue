<script setup lang="ts">
import type { MetodeBelajar } from '@/types/course.types'

defineProps<{
  metodeBelajar: MetodeBelajar
  title: string
  subtitle?: string
}>()

const metodeLabel: Record<MetodeBelajar, string> = {
  membaca: 'Membaca',
  mendengar: 'Mendengar',
  menulis: 'Menulis',
}
</script>

<template>
  <div class="mh">
    <div class="mh__metode-row">
      <span class="mh__metode-label">Metode Belajar:</span>
      <span class="mh__metode-badge">{{ metodeLabel[metodeBelajar] }}</span>
    </div>
    <h1 class="mh__title">{{ title }}</h1>
    <p v-if="subtitle" class="mh__subtitle">{{ subtitle }}</p>
  </div>
</template>

<style scoped>
.mh { display: flex; flex-direction: column; gap: 6px; }

.mh__metode-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: calc(13px * var(--text-scale, 1));
  font-weight: 600;
  color: var(--color-text-dark);
}
.mh__metode-badge {
  padding: 3px 12px;
  border-radius: 999px;
  border: 1.5px solid var(--color-border);
  font-size: calc(12px * var(--text-scale, 1));
  font-weight: 500;
  color: var(--color-text-dark);
  background: var(--color-white);
}
.mh__title {
  font-size: calc(26px * var(--text-scale, 1));
  font-weight: 700;
  color: var(--color-text-dark);
  margin: 0;
}
.mh__subtitle {
  font-size: calc(13px * var(--text-scale, 1));
  color: var(--color-text-light);
  margin: 0;
}
</style>