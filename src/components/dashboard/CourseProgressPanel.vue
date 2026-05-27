<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ChildRecord } from '@/types/child.types'
import type { Course } from '@/types/course.types'

const props = defineProps<{
  children: ChildRecord[]
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
        <span class="course-panel__icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        </span>
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
          <div class="course-panel__list" v-if="activeCourse?.exercises">
            <div
              v-for="exercise in activeCourse.exercises"
              :key="exercise.id"
              class="course-panel__detail"
            >
              <img src="@/assets/images/logo.png" class="h-18 w-auto object-contain" alt="" />

              <span class="course-panel__detail-sessions">
                <div class="course-panel__caption">
                  <div class="course-panel__detail-name">{{ exercise.title }}</div>

                  <div class="course-panel__progress-bar">
                    <div
                      class="course-panel__progress-fill"
                      :style="{ width: `${exercise.progress}%` }"
                    />
                  </div>
                </div>
              </span>
              <span class="course-panel__progress-label"
                ><b>{{ exercise.progress }}% </b></span
              >
            </div>
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
  overflow-x: auto;
  overflow-y: hidden;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-height: 320px;
  height: 600px;
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
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-bottom: 8px;
}
.course-panel__tabs::-webkit-scrollbar {
  height: 6px;
}
.course-panel__tabs::-webkit-scrollbar-track {
  border-radius: 4px;
}
.course-panel__tabs::-webkit-scrollbar-thumb {
  border-radius: 4px;
}

.course-panel__tab {
  flex-shrink: 0;
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
.course-panel__list::-webkit-scrollbar {
  display: none;
}
.course-panel__list {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
  min-height: 450px;
  height: 450px;
  overflow-y: auto;
  padding-right: 8px; /* Prevents text from hiding behind scrollbar */
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
  padding: 1rem;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-direction: row;
}

.course-panel__detail-name {
  font-size: 15px;
  font-weight: 600;

  color: #1a3d2e;
}

.course-panel__detail-sessions {
  font-size: 13px;
  margin: 6px;
  color: #5a8a72;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
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
  font-size: 16px;
  color: #5a8a72;
}

.course-panel__state {
  flex: 1;
  background: white;
  min-height: 200px;
  height: 200px;
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

.course-panel__exercise-icon {
  width: 56px;
  height: 56px;
  min-width: 56px;
  background: #d0f0e2;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
