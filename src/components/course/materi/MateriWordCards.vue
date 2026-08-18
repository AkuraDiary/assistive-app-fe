<script setup lang="ts">
import type { MateriWord } from '@/types/course.types'

defineProps<{ words: MateriWord[] }>()

const colorMap = {
  blue: '#2196F3',
  green: '#4CAF50',
  default: 'inherit',
}
</script>

<template>
  <div class="mwc">
    <div v-for="word in words" :key="word.id" class="mwc__card">
      <span
        v-for="(syl, i) in word.syllables"
        :key="i"
        class="mwc__syllable"
        :style="{ color: colorMap[syl.color ?? 'default'] }"
      >{{ syl.text }}</span>
    </div>
  </div>
</template>

<style scoped>
.mwc {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}
.mwc__card {
  padding: 14px 24px;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--color-border);
  background: var(--color-white);
  font-size: calc(18px * var(--text-scale, 1));
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: box-shadow 0.15s;
}
.mwc__card:hover {
  box-shadow: 0 2px 12px rgba(124, 92, 204, 0.12);
  border-color: var(--color-primary);
}
.mwc__syllable { display: inline; }
</style>