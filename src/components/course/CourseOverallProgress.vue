<script setup lang="ts">
defineProps<{
  progress: number
}>()
</script>

<template>
  <div class="cop">
    <p class="cop__title">Progress Keseluruhan Modul</p>

    <div class="cop__content">
      <div class="cop__track">
        <div class="cop__fill" :style="{ width: `${progress}%` }" />
      </div>
      <span class="cop__pct">{{ progress }}%</span>
    </div>
  </div>
</template>

<style scoped>
.cop {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cop__title {
  font-size: calc(15px * var(--text-scale, 1));
  font-weight: 700;
  color: var(--color-text-dark);
  margin: 0;
}

.cop__content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.cop__track {
  flex: 1;
  height: 10px;
  background: rgba(255, 60, 138, 0.15); /* light pink */
  border-radius: 999px;
  overflow: hidden;
}

.cop__fill {
  height: 100%;
  background: var(--color-primary); /* vivid pink */
  border-radius: 999px;
  transition: width 0.4s ease;
}

.cop__pct {
  font-size: calc(16px * var(--text-scale, 1));
  font-weight: 700;
  color: var(--color-text-dark);
}
</style>
