<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Course } from '@/types/course.types'

const props = defineProps<{
  students: { _id: string; fullName: string }[]
  selectedStudentId: string | null
  courses: Course[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'student-change', id: string): void
}>()

const activeCourseId = ref<string | null>(null)

// Auto-select first course when courses are loaded
import { watchEffect } from 'vue'

watchEffect(() => {
  if (!activeCourseId.value && props.courses.length > 0) {
    const firstCourse = props.courses[0]
    if (firstCourse) {
      activeCourseId.value = firstCourse.id
    }
  }
})

const activeCourse = computed(() =>
  activeCourseId.value ? (props.courses.find((c) => c.id === activeCourseId.value) ?? null) : null,
)

function selectCourse(id: string) {
  activeCourseId.value = id
}

function onStudentChange(e: Event) {
  emit('student-change', (e.target as HTMLSelectElement).value)
}
</script>

<template>
  <div class="shared-course">
    <div class="shared-course__header">
      <div class="shared-course__title-row">
        <span class="shared-course__icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ff4d8d"
            stroke-width="2.5"
            stroke-linecap="round"
          >
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        </span>
        <h2 class="shared-course__title">Progres Course</h2>
      </div>
      <select class="shared-course__select" :value="selectedStudentId ?? ''" @change="onStudentChange">
        <option v-for="student in students" :key="student._id" :value="student._id">
          {{ student.fullName }}
        </option>
      </select>
    </div>

    <div class="shared-course__content">
      <div v-if="loading" class="shared-course__state">
        <div class="shared-course__spinner" />
      </div>

      <template v-else>
        <div v-if="courses.length === 0" class="shared-course__state">
          <p class="shared-course__empty-text">Belum ada course tersedia</p>
        </div>

        <div v-else>
          <!-- Tabs -->
          <div class="shared-course__tabs">
            <button
              v-for="course in courses"
              :key="course.id"
              class="shared-course__tab"
              :class="{ 'shared-course__tab--active': activeCourseId === course.id }"
              @click="selectCourse(course.id)"
            >
              {{ course.name }}
            </button>
          </div>

          <!-- List -->
          <Transition name="fade" mode="out-in">
            <div :key="activeCourseId || 'empty'" class="shared-course__list">
              <template v-if="activeCourse?.exercises?.length">
                <div
                  v-for="exercise in activeCourse?.exercises"
                  :key="exercise.id"
                  class="shared-course__detail"
                >
                  <div class="shared-course__exercise-icon">
                    <!-- Added img_learning.png per user comment -->
                    <img src="@/assets/images/img_learning.png" alt="learning" class="w-12 h-12 object-contain" />
                  </div>
                  <div class="shared-course__detail-body">
                    <div class="shared-course__detail-name">{{ exercise.title }}</div>
                    <div class="shared-course__progress-bar">
                      <div
                        class="shared-course__progress-fill"
                        :style="{ width: `${exercise.progress}%` }"
                      />
                    </div>
                  </div>
                  <div class="shared-course__progress-label">
                    {{ exercise.progress }}%
                  </div>
                </div>
              </template>
              <div v-else class="shared-course__state min-h-[300px]">
                <p class="shared-course__empty-text">Belum ada modul di course ini</p>
              </div>
            </div>
          </Transition>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.shared-course {
  background: transparent;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  flex: 1;
}

.shared-course__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.shared-course__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.shared-course__title {
  font-size: 22px;
  font-weight: 700;
  color: #ff4d8d;
  margin: 0;
}

.shared-course__select {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 8px 36px 8px 12px;
  font-size: 14px;
  color: #2d2d2d;
  background: #fff url('data:image/svg+xml;utf8,<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="%232d2d2d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>') no-repeat right 12px center;
  cursor: pointer;
  outline: none;
  appearance: none;
  min-width: 160px;
}

.shared-course__tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.shared-course__tabs::-webkit-scrollbar {
  display: none;
}

.shared-course__tab {
  flex-shrink: 0;
  padding: 8px 20px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background: #fff;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.shared-course__tab:hover {
  background: #fafafa;
}

.shared-course__tab--active {
  background: #ff4d8d;
  border-color: #ff4d8d;
  color: #fff;
}
.shared-course__tab--active:hover {
  background: #ff4d8d;
}

.shared-course__list {
  display: flex;
  flex-direction: column;
}

.shared-course__detail {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
}

.shared-course__detail:last-child {
  border-bottom: none;
}

.shared-course__exercise-icon {
  width: 72px;
  height: 72px;
  background: #fafafa;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.shared-course__detail-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.shared-course__detail-name {
  font-size: 16px;
  font-weight: 700;
  color: #2d2d2d;
}

.shared-course__progress-bar {
  height: 8px;
  background: #fce8f0;
  border-radius: 999px;
  overflow: hidden;
  max-width: 80%;
}

.shared-course__progress-fill {
  height: 100%;
  background: #ff4d8d;
  border-radius: 999px;
  transition: width 0.5s ease;
}

.shared-course__progress-label {
  font-size: 16px;
  font-weight: 700;
  color: #2d2d2d;
  min-width: 48px;
  text-align: right;
}

.shared-course__state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.shared-course__empty-text {
  font-size: 14px;
  color: #aaa;
}

.shared-course__spinner {
  width: 28px;
  height: 28px;
  border: 2px solid #fce8f0;
  border-top-color: #ff4d8d;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
