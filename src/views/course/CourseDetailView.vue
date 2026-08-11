<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCourseDetail } from '@/composable/useCourseDetail'
import { useAuth } from '@/composable/useAuth'
import CourseDetailHeader from '@/components/course/CourseDetailHeader.vue'
import CourseOverallProgress from '@/components/course/CourseOverallProgress.vue'
import LatihanSection from '@/components/course/LatihanSection.vue'
import AssessmentSection from '@/components/course/AssessmentSection.vue'

const router = useRouter()
const route = useRoute()
const { courseDetail, loading, error, fetchCourseDetail } = useCourseDetail()

const isEditMode = ref(false)
const { user } = useAuth()
const userRole = computed(() => user.value?.role || 'student')

// Toggle for progress testing
const debugProgress100 = ref(false)

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
    name: 'materi-view', // As defined in router
    params: { courseId: courseId.value, moduleId: moduleId },
  })
}

function onOpenAssessment(moduleId: string) {
  router.push({
    name: 'assessment-take',
    params: { courseId: courseId.value, moduleId: moduleId },
  })
}

function onEditAssessment(moduleId: string) {
  router.push({
    name: 'assessment-edit',
    params: { courseId: courseId.value, moduleId: moduleId },
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
    <div
      class="debug-controls"
      v-if="userRole === 'teacher'"
      style="
        padding: 10px;
        background: #eee;
        border-radius: 8px;
        margin-bottom: 16px;
        font-size: 12px;
        display: flex;
        gap: 12px;
        align-items: center;
      "
    >
      <strong>Debug:</strong>
      <label><input type="checkbox" v-model="debugProgress100" /> Force 100% Progress</label>
    </div>

    <div v-if="loading" class="cdv-page__loading">Loading course detail...</div>
    <div v-else-if="error" class="cdv-page__error">{{ error }}</div>

    <template v-else-if="courseDetail">
      <!-- Toggle Mode Button -->
      <div class="ls__toggle-wrapper" v-if="userRole === 'teacher'">
        <button class="ls__toggle-btn" @click="isEditMode = !isEditMode">
          <template v-if="isEditMode">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Kembali ke Mode Belajar
          </template>
          <template v-else>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Masuk ke Mode Edit
          </template>
        </button>
      </div>

      <div class="cdv-page__header-actions">
        <CourseDetailHeader :course="courseDetail" />

        <button
          v-if="isEditMode"
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
        <CourseOverallProgress
          v-if="!isEditMode"
          :progress="debugProgress100 ? 100 : courseDetail.progress"
        />

        <div class="cdv-page__sections-title">Pilih Modul</div>

        <!-- Latihan / Materi List -->
        <LatihanSection
          v-if="materiModules.length > 0"
          :modules="materiModules"
          :is-edit-mode="isEditMode"
          :user-role="userRole"
          @open-materi="onOpenMateri"
          @toggle-edit-mode="isEditMode = !isEditMode"
        />

        <!-- Assessment List -->
        <AssessmentSection
          v-if="assessmentModules.length > 0"
          :modules="assessmentModules"
          :is-edit-mode="isEditMode"
          :progress="debugProgress100 ? 100 : courseDetail.progress"
          @open-assessment="onOpenAssessment"
          @edit-assessment="onEditAssessment"
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

.ls__toggle-wrapper {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  z-index: 100;
  justify-content: flex-end;
  margin-top: -10px;
}
.ls__toggle-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: white;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px rgba(255, 60, 138, 0.1);
  z-index: 10;
}
.ls__toggle-btn:hover {
  background: rgba(255, 60, 138, 0.05);
}
</style>
