<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCourseDetail } from '@/composable/useCourseDetail'
import CourseDetailHeader from '@/components/course/CourseDetailHeader.vue'
import CourseOverallProgress from '@/components/course/CourseOverallProgress.vue'
import LatihanSection from '@/components/course/LatihanSection.vue'
import AssessmentSection from '@/components/course/AssessmentSection.vue'

const router = useRouter()
const route = useRoute()
const { courseDetail, loading, error, fetchCourseDetail } = useCourseDetail()

const courseId = computed(() => route.params.courseId as string)
// If we don't have childId in route, we use a default (like 'ch1') or adjust based on role
const childId = computed(() => (route.params.childId as string) || 'ch1')

onMounted(() => {
  if (courseId.value) {
    fetchCourseDetail(childId.value, courseId.value)
  }
})

// Separate modules by type
const materiModules = computed(
  () => courseDetail.value?.modules.filter((m) => m.type === 'materi') ?? [],
)
const assessmentModules = computed(
  () => courseDetail.value?.modules.filter((m) => m.type === 'assessment') ?? [],
)

function onOpenMateri(moduleId: string) {
  router.push({
    name: 'materi', // As defined in router
    params: { courseId: courseId.value, latihanId: moduleId },
  })
}

function onOpenAssessment(moduleId: string) {
  router.push({
    name: 'assessment', // Adjust to actual route name if different
    params: { courseId: courseId.value, assessmentId: moduleId },
  })
}

function goBack() {
  router.push({ name: 'dashboard' }) // Or equivalent
}

function onLanjut() {
  // Define Lanjut behavior
}
</script>

<template>
  <div class="cdv-page">
    <div v-if="loading" class="cdv-page__loading">Loading course detail...</div>
    <div v-else-if="error" class="cdv-page__error">{{ error }}</div>

    <template v-else-if="courseDetail">
      <div class="cdv-page__header-actions">
        <CourseDetailHeader :course="courseDetail" />

        <button
          class="cdv-btn cdv-btn--primary"
          @click="router.push({ name: 'tambah-modul', params: { courseId: courseId } })"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Tambah Modul Baru
        </button>
      </div>

      <div class="cdv-page__body">
        <CourseOverallProgress :progress="courseDetail.progress" />

        <div class="cdv-page__sections-title">Pilih Modul</div>

        <!-- Latihan / Materi List -->
        <LatihanSection
          v-if="materiModules.length > 0"
          :modules="materiModules"
          @open-materi="onOpenMateri"
        />

        <!-- Assessment List -->
        <AssessmentSection
          v-if="assessmentModules.length > 0"
          :modules="assessmentModules"
          @open-assessment="onOpenAssessment"
        />
      </div>

      <div class="cdv-page__actions">
        <button class="cdv-btn cdv-btn--outline" @click="goBack">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Kembali
        </button>
        <button class="cdv-btn cdv-btn--outline" @click="onLanjut">
          Lanjut
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.cdv-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
}

.cdv-page__loading,
.cdv-page__error {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-light);
}
.cdv-page__error {
  color: #ef4444;
}

.cdv-page__body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cdv-page__sections-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-dark);
  margin-top: 8px;
}

/* Bottom Actions */
.cdv-page__actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.cdv-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: fit-content;
  padding: 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
}

.cdv-btn--outline {
  border: 1.5px solid var(--color-primary);
  color: var(--color-primary);
}

.cdv-btn--outline:hover {
  background: rgba(255, 60, 138, 0.05); /* Faint pink hover */
}

.cdv-page__header-actions {
  display: flex;
  align-items: flex-center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.cdv-btn--primary {
  background: var(--color-primary);
  color: #fff;
  border: none;
  box-shadow: 0 4px 12px rgba(255, 60, 138, 0.2);
}

.cdv-btn--primary:hover {
  background: #e62c76;
  transform: translateY(-1px);
}
</style>
