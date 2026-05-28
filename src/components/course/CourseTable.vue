<script setup lang="ts">
import type { Course } from '@/types/course.types'
import CourseStatusBadge from '@/components/shared/badge/CourseStatusBadge.vue'

defineProps<{
  courses: Course[]
  loading?: boolean
}>()

defineEmits<{
  (e: 'detail', id: string): void
  (e: 'action', id: string): void
}>()

function formatDate(iso?: string) {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="ct">
    <!-- Loading -->
    <div v-if="loading" class="ct__state">
      <div class="ct__spinner" />
    </div>

    <!-- Empty -->
    <div v-else-if="courses.length === 0" class="ct__state">
      <p class="ct__empty">Belum ada course tersedia</p>
    </div>

    <!-- Table -->
    <table v-else class="ct__table">
      <thead>
        <tr>
          <th class="ct__th">Courses</th>
          <th class="ct__th">Progres</th>
          <th class="ct__th">Tanggal Mulai</th>
          <th class="ct__th">Status</th>
          <th class="ct__th ct__th--center">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="course in courses" :key="course.id" class="ct__row">
          <!-- Course name + level -->
          <td class="ct__td">
            <div class="ct__course-cell">
              <div class="ct__thumb" />
              <div>
                <p class="ct__name">{{ course.name }}</p>
                <p class="ct__level">{{ course.level ?? '-' }}</p>
              </div>
            </div>
          </td>

          <!-- Progress bar + % -->
          <td class="ct__td">
            <div class="ct__progress-wrap">
              <div class="ct__progress-track">
                <div class="ct__progress-fill" :style="{ width: `${course.progress}%` }" />
              </div>
              <span class="ct__progress-pct">{{ course.progress }}%</span>
            </div>
          </td>

          <!-- Date -->
          <td class="ct__td ct__td--muted">{{ formatDate(course.tanggalMulai) }}</td>

          <!-- Status badge -->
          <td class="ct__td">
            <CourseStatusBadge v-if="course.status" :status="course.status" />
            <span v-else class="ct__td--muted">-</span>
          </td>

          <!-- Actions -->
          <td class="ct__td ct__td--center">
            <div class="ct__actions">
              <button class="ct__btn-detail" @click="$emit('detail', course.id)">Detail</button>
              <button class="ct__btn-more" @click="$emit('action', course.id)">
                <span>•••</span>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.ct {
  width: 100%;
  background-color: white;
  border-radius: 10px;
}

/* States */
.ct__state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}
.ct__empty {
  font-size: 14px;
  color: var(--color-text-light);
  margin: 0;
}
.ct__spinner {
  width: 28px;
  height: 28px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Table */
.ct__table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.ct__th {
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-dark);
  text-align: left;
  border-bottom: 1.5px solid var(--color-border);
}
.ct__th--center {
  text-align: center;
}

.ct__row {
  border-bottom: 1px solid var(--color-border);
  transition: background 0.15s;
}
.ct__row:hover {
  background: var(--color-background);
}
.ct__row:last-child {
  border-bottom: none;
}

.ct__td {
  padding: 14px 16px;
  font-size: 14px;
  color: var(--color-text-dark);
  vertical-align: middle;
}
.ct__td--muted {
  color: var(--color-text-light);
}
.ct__td--center {
  text-align: center;
}

/* Course cell */
.ct__course-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}
.ct__thumb {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: var(--color-surface);
  flex-shrink: 0;
}
.ct__name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-dark);
  margin: 0 0 2px;
}
.ct__level {
  font-size: 12px;
  color: var(--color-text-light);
  margin: 0;
}

/* Progress */
.ct__progress-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}
.ct__progress-track {
  flex: 1;
  height: 8px;
  background: var(--color-border);
  border-radius: 999px;
  overflow: hidden;
}
.ct__progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 999px;
  transition: width 0.4s ease;
}
.ct__progress-pct {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-dark);
  white-space: nowrap;
  min-width: 36px;
}

/* Action buttons */
.ct__actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.ct__btn-detail {
  padding: 5px 14px;
  border-radius: 8px;
  border: 1.5px solid var(--color-primary);
  background: transparent;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-primary);
  cursor: pointer;
  transition: all 0.15s;
}
.ct__btn-detail:hover {
  background: var(--color-primary);
  color: #fff;
}
.ct__btn-more {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1.5px solid var(--color-border);
  background: transparent;
  font-size: 13px;
  color: var(--color-text-light);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.ct__btn-more:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
</style>
