<script setup lang="ts">
defineProps<{ tips: string }>()
</script>

<template>
  <div class="mtc">
    <div class="mtc__icon-wrap">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
    <div>
      <p class="mtc__title">Tips Belajar</p>
      <p class="mtc__text">{{ tips }}</p>
    </div>
  </div>
</template>

<style scoped>
.mtc {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #fdf8ec;
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  max-width: 440px;
  margin: 0 auto;
  width: 100%;
}
.mtc__icon-wrap {
  color: #c8a84b;
  flex-shrink: 0;
  margin-top: 2px;
}
.mtc__title {
  font-size: calc(13px * var(--text-scale, 1));
  font-weight: 700;
  color: var(--color-text-dark);
  margin: 0 0 4px;
}
.mtc__text {
  font-size: calc(13px * var(--text-scale, 1));
  color: var(--color-text-light);
  margin: 0;
  line-height: 1.6;
}
</style>