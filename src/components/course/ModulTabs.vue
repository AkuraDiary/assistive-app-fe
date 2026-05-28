<script setup lang="ts">
import type { Modul } from '@/types/course.types'

defineProps<{
  moduls: Modul[]
  activeModulId: string | null
}>()

defineEmits<{
  (e: 'change', id: string): void
}>()
</script>

<template>
  <div class="mt">
    <button
      v-for="modul in moduls"
      :key="modul.id"
      class="mt__tab"
      :class="{ 'mt__tab--active': modul.id === activeModulId }"
      @click="$emit('change', modul.id)"
    >
      {{ modul.label }}
    </button>
  </div>
</template>

<style scoped>
.mt {
  display: flex;
  align-items: center;
  background: var(--color-primary-muted);
  border-radius: var(--radius-lg);
  padding: 4px;
  gap: 2px;
}

.mt__tab {
  flex: 1;
  padding: 10px 0;
  border-radius: var(--radius-md);
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-light);
  cursor: pointer;
  transition: all 0.2s;
}

.mt__tab--active {
  background: var(--color-white);
  color: var(--color-text-dark);
  font-weight: 700;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}
</style>