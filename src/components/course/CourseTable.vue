<script setup lang="ts">
import type { Course } from '@/types/course.types'
import CourseStatusBadge from '@/components/shared/badge/CourseStatusBadge.vue'

defineProps<{
  courses: Course[]
  loading?: boolean
  showStudentName?: boolean
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
          <th v-if="showStudentName" class="ct__th">Nama Anak</th>
          <th class="ct__th">Course Terakhir</th>
          <th class="ct__th">Progres</th>
          <th class="ct__th">Tanggal Mulai</th>
          <th class="ct__th">Status</th>
          <th class="ct__th ct__th--center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="course in courses" :key="course.id" class="ct__row">
          <!-- Student name -->
          <td v-if="showStudentName" class="ct__td">
            <p class="ct__name">{{ course.studentName || '-' }}</p>
          </td>

          <!-- Course name + level -->
          <td class="ct__td">
            <div class="ct__course-cell">
              <div>
                <p class="ct__name">{{ course.name }}</p>
                <p class="ct__level">Level : {{ course.level ?? '-' }}</p>
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
              <button class="ct__btn-detail" @click="$emit('detail', course.id)">Lihat Course</button>
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
  font-size: calc(14px * var(--text-scale, 1));
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
  font-size: calc(13px * var(--text-scale, 1));
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
  font-size: calc(14px * var(--text-scale, 1));
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
.ct__name {
  font-size: calc(14px * var(--text-scale, 1));
  font-weight: 600;
  color: var(--color-text-dark);
  margin: 0 0 2px;
}
.ct__level {
  font-size: calc(12px * var(--text-scale, 1));
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
  background: #FCE7F3;
  border-radius: 999px;
  overflow: hidden;
}
.ct__progress-fill {
  height: 100%;
  background: #FF3366;
  border-radius: 999px;
  transition: width 0.4s ease;
}
.ct__progress-pct {
  font-size: calc(13px * var(--text-scale, 1));
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
  border-radius: 99px; /* Pill shape */
  border: 1.5px solid #EC4899; /* Pink border */
  background: transparent;
  font-size: calc(13px * var(--text-scale, 1));
  font-weight: 500;
  color: #EC4899; /* Pink text */
  cursor: pointer;
  transition: all 0.15s;
}
.ct__btn-detail:hover {
  background: #EC4899;
  color: #fff;
}
</style>
