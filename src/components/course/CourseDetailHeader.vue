<script setup lang="ts">
import type { CourseDetail } from '@/types/course.types'

defineProps<{
  course: CourseDetail
}>()
</script>

<template>
  <div class="cdh">
    <div class="cdh__thumb" />

    <div class="cdh__info">
      <h1 class="cdh__title">{{ course.name }}</h1>
      <p class="cdh__desc">{{ course.description ?? '-' }}</p>

      <div class="cdh__badges">
        <span class="cdh__badge cdh__badge--primary"> {{ course.totalModul }} Modul </span>
        <span class="cdh__badge cdh__badge--outline"> {{ course.totalAssessment }} Assesment </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cdh {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
}

.cdh__thumb {
  width: 110px;
  height: 110px;
  border-radius: var(--radius-lg);
  background: var(--color-primary-muted);
  flex-shrink: 0;
}

.cdh__info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cdh__title {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-dark);
  margin: 0;
}

.cdh__desc {
  font-size: 13px;
  color: var(--color-text-light);
  margin: 0;
  line-height: 1.5;
}

.cdh__badges {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.cdh__badge {
  display: inline-flex;
  align-items: center;
  padding: 5px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
}

.cdh__badge--primary {
  background: var(--color-secondary-muted);
  color: var(--color-text-dark);
}

.cdh__badge--outline {
  background: transparent;
  border: 1.5px solid var(--color-border);
  color: var(--color-text-dark);
}
</style>
