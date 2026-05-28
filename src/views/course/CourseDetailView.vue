<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDashboard } from '@/composable/useDashboard'
import { useCourseDetail } from '@/composable/useCourseDetail'
import CourseDetailHeader from '@/components/course/CourseDetailHeader.vue'
import CourseOverallProgress from '@/components/course/CourseOverallProgress.vue'
import ModulTabs from '@/components/course/ModulTabs.vue'
import LatihanSection from '@/components/course/LatihanSection.vue'
import AssessmentSection from '@/components/course/AssessmentSection.vue'

const route = useRoute()
const router = useRouter()
const { selectedChildId } = useDashboard()
const {
  courseDetail,
  activeModul,
  activeModulId,
  loading,
  error,
  fetchCourseDetail,
  setActiveModul,
} = useCourseDetail()

onMounted(() => {
  const childId = selectedChildId.value
  const courseId = route.params.courseId as string
  if (!childId) return router.push('/dashboard')
  fetchCourseDetail(childId, courseId)
})
</script>

<template>
  <div class="cdv">
    <!-- Loading -->
    <div v-if="loading" class="cdv__state">
      <div class="cdv__spinner" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="cdv__state">
      <p class="cdv__error">{{ error }}</p>
    </div>

    <!-- Content -->
    <template v-else-if="courseDetail">
      <div class="cdv__body">
        <!-- Course header -->
        <CourseDetailHeader :course="courseDetail" />

        <!-- Overall progress -->
        <CourseOverallProgress :progress="courseDetail.progress" />

        <!-- Modul tabs -->
        <ModulTabs
          :moduls="courseDetail.moduls"
          :active-modul-id="activeModulId"
          @change="setActiveModul"
        />

        <!-- Latihan section -->
        <LatihanSection v-if="activeModul" :modul="activeModul" />

        <!-- Assessment section -->
        <AssessmentSection :assessments="courseDetail.assessments" />

        <!-- Footer nav -->
        <div class="cdv__footer">
          <button class="cdv__nav-btn" @click="router.back()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Kembali
          </button>
          <button class="cdv__nav-btn cdv__nav-btn--primary">
            Lanjut
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.cdv {
  min-height: 100vh;
  background: var(--color-background);
}

.cdv__body {
  max-width: 860px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* States */
.cdv__state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
.cdv__spinner {
  width: 32px;
  height: 32px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.cdv__error {
  font-size: 14px;
  color: #e05c5c;
  margin: 0;
}

/* Footer nav */
.cdv__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.5rem;
}
.cdv__nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  border-radius: 10px;
  border: 1.5px solid var(--color-border);
  background: transparent;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-dark);
  cursor: pointer;
  transition: all 0.15s;
}
.cdv__nav-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.cdv__nav-btn--primary {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}
.cdv__nav-btn--primary:hover {
  background: var(--color-primary-dark, #6a4db8);
}
</style>