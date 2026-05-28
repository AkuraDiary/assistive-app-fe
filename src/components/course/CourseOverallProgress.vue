<script setup lang="ts">
defineProps<{
  progress: number
}>()
</script>

<template>
  <div class="cop">
    <p class="cop__title">Progress Keseluruhan Modul</p>

    <div class="cop__content">
      <div class="cop__row">
        <span class="cop__label">Progress</span>
        <span class="cop__pct">{{ progress }}%</span>
      </div>
      <div class="cop__track">
        <div class="cop__fill" :style="{ width: `${progress}%` }" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.cop {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.cop__title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-dark);
  margin: 0;
}

.cop__content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cop__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cop__label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-dark);
}

.cop__pct {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-dark);
}

.cop__track {
  height: 10px;
  background: var(--color-border);
  border-radius: 999px;
  overflow: hidden;
}

.cop__fill {
  height: 100%;
  background: var(--color-secondary);
  border-radius: 999px;
  transition: width 0.5s ease;
}
</style>
