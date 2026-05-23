<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Child, Course } from '@/types/dashboard.types'

const props = defineProps<{
  children: Child[]
  selectedChildId: string | null
  courses: Course[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'child-change', id: string): void
}>()

const activeCourseId = ref<string | null>(null)

const activeCourse = computed(() =>
  activeCourseId.value ? (props.courses.find((c) => c.id === activeCourseId.value) ?? null) : null,
)

function selectCourse(id: string) {
  activeCourseId.value = activeCourseId.value === id ? null : id
}

function onChildChange(e: Event) {
  emit('child-change', (e.target as HTMLSelectElement).value)
}
</script>

<template>
  <div class="course-panel">
    <div class="course-panel__header">
      <div class="course-panel__title-row">
        <span class="course-panel__icon">↑</span>
        <h2 class="course-panel__title">Progres Course</h2>
      </div>
      <select class="course-panel__select" :value="selectedChildId ?? ''" @change="onChildChange">
        <option v-for="child in children" :key="child.id" :value="child.id">
          {{ child.name }}
        </option>
      </select>
    </div>

    <div v-if="loading" class="course-panel__state">
      <div class="course-panel__spinner" />
    </div>

    <template v-else>
      <!-- Empty state -->
      <div v-if="courses.length === 0" class="course-panel__state">
        <p class="course-panel__empty-text">Belum ada course tersedia</p>
      </div>

      <div v-else>
        <!-- Course tab pills -->
        <div class="course-panel__tabs">
          <button
            v-for="course in courses"
            :key="course.id"
            class="course-panel__tab"
            :class="{ 'course-panel__tab--active': activeCourseId === course.id }"
            @click="selectCourse(course.id)"
          >
            {{ course.name }}
          </button>
        </div>

        <!-- Course detail card -->
        <Transition name="slide-fade">
          <div v-if="activeCourse" class="course-panel__detail">
            <div class="course-panel__detail-header">
              <span class="course-panel__detail-name">{{ activeCourse.name }}</span>
              <span class="course-panel__detail-sessions">
                {{ activeCourse.completedSessions }} / {{ activeCourse.totalSessions }} sesi
              </span>
            </div>
            <div class="course-panel__progress-bar">
              <div
                class="course-panel__progress-fill"
                :style="{ width: `${activeCourse.progress}%` }"
              />
            </div>
            <span class="course-panel__progress-label">{{ activeCourse.progress }}% selesai</span>
          </div>
        </Transition>
      </div>
    </template>
  </div>
</template>

<style scoped>
.course-panel {
  background: #eefaf4;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-height: 320px;
  flex: 1;
}

.course-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.course-panel__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.course-panel__icon {
  font-size: 18px;
  color: #2d2d2d;
}

.course-panel__title {
  font-size: 18px;
  font-weight: 600;
  color: #2d2d2d;
  margin: 0;
}

.course-panel__select {
  border: 1px solid #c8e8d8;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 13px;
  color: #2d2d2d;
  background: #fff;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
  min-width: 140px;
}
.course-panel__select:hover {
  border-color: #3caa78;
}
.course-panel__select:focus {
  border-color: #3caa78;
  box-shadow: 0 0 0 3px rgba(60, 170, 120, 0.15);
}

.course-panel__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.course-panel__tab {
  padding: 7px 16px;
  border-radius: 8px;
  border: 1.5px solid #c0d8cc;
  background: #fff;
  font-size: 13px;
  font-weight: 500;
  color: #3d6b58;
  cursor: pointer;
  transition: all 0.2s;
}

.course-panel__tab:hover {
  border-color: #3caa78;
  background: #f0faf5;
}

.course-panel__tab--active {
  background: #d0f0e0;
  border-color: #3caa78;
  color: #1a6644;
}

.course-panel__detail {
  background: #fff;
  border-radius: 10px;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.course-panel__detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.course-panel__detail-name {
  font-size: 15px;
  font-weight: 600;
  color: #1a3d2e;
}

.course-panel__detail-sessions {
  font-size: 13px;
  color: #5a8a72;
}

.course-panel__progress-bar {
  height: 8px;
  background: #d0ead8;
  border-radius: 999px;
  overflow: hidden;
}

.course-panel__progress-fill {
  height: 100%;
  background: #3caa78;
  border-radius: 999px;
  transition: width 0.5s ease;
}

.course-panel__progress-label {
  font-size: 12px;
  color: #5a8a72;
}

.course-panel__state {
  flex: 1;
  background: white;
  min-height: 200px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.course-panel__empty-text {
  font-size: 14px;

  color: #aaa;
  margin: 0;
}

.course-panel__spinner {
  width: 28px;
  height: 28px;
  border: 2px solid #c8e8d8;
  border-top-color: #3caa78;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Transition */
.slide-fade-enter-active {
  transition: all 0.25s ease;
}
.slide-fade-leave-active {
  transition: all 0.15s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
