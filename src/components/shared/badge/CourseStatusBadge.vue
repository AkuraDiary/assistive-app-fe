<!-- src/components/shared/badge/CourseStatusBadge.vue -->
<script setup lang="ts">
import type { CourseStatus } from '@/types/course.types'
defineProps<{ status: CourseStatus }>()

const map: Record<CourseStatus, { label: string; cls: string }> = {
  dipelajari: { label: 'Dipelajari', cls: 'badge--dipelajari' },
  selesai:    { label: 'Selesai',    cls: 'badge--selesai' },
  belum:      { label: 'Belum',      cls: 'badge--belum' },
}
</script>

<template>
  <span class="badge" :class="map[status].cls">{{ map[status].label }}</span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}
.badge--dipelajari { background: #9FE1CB; color: #085041; }
.badge--selesai    { background: #F4C0D1; color: #72243E; }
.badge--belum      { background: #CECBF6; color: #3C3489; }
</style>