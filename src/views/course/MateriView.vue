<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAccessibility } from '@/composable/useAccessibility'
import { useCourseDetail } from '@/composable/useCourseDetail'
import { useMateri } from '@/composable/useMateri'
import { useDashboard } from '@/composable/useDashboard'
import MateriHeader from '@/components/course/materi/MateriHeader.vue'
import MateriMediaArea from '@/components/course/materi/MateriMediaArea.vue'
import MateriWordCards from '@/components/course/materi/MateriWordCards.vue'
import MateriFocusCard from '@/components/course/materi/MateriFocusCard.vue'
import MateriTipsCard from '@/components/course/materi/MateriTipsCard.vue'
import AccessibilityMenu from '@/components/shared/AccessibilityMenu.vue'

const route = useRoute()
const router = useRouter()
const { fontSizeClass, dyslexiaClass } = useAccessibility()
const { selectedChildId } = useDashboard()
const { courseDetail, fetchCourseDetail } = useCourseDetail()
const { currentMateri, isFirst, isLast, setMateri, prev, next } = useMateri()

const courseId = route.params.courseId as string
const latihanId = route.params.latihanId as string

onMounted(async () => {
  if (!selectedChildId.value) return router.push('/dashboard')

  if (!courseDetail.value || courseDetail.value.id !== courseId) {
    await fetchCourseDetail(selectedChildId.value, courseId)
  }

  const latihan = courseDetail.value?.modules
    .flatMap((m: any) => m.latihan || [])
    .find((l: any) => l.id === latihanId)

  if (!latihan?.materi?.length) return router.back()
  setMateri(latihan.materi)
})

function handleKembali() {
  if (isFirst.value) router.back()
  else prev()
}
</script>

<template>
  <div class="mv" :class="[fontSizeClass, dyslexiaClass]">
    <div class="mv__body">
      <!-- Top nav -->
      <button class="mv__top-nav" @click="router.back()">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Materi Latihan
      </button>

      <template v-if="currentMateri">
        <MateriHeader
          :metode-belajar="currentMateri.metodeBelajar"
          :title="currentMateri.title"
          :subtitle="currentMateri.subtitle"
        />

        <MateriMediaArea :media-url="currentMateri.mediaUrl" />

        <MateriWordCards :words="currentMateri.words" />

        <MateriFocusCard
          v-if="currentMateri.focusHuruf"
          :focus-huruf="currentMateri.focusHuruf"
          :instruction="currentMateri.focusInstruction"
        />

        <MateriTipsCard v-if="currentMateri.tips" :tips="currentMateri.tips" />
      </template>

      <!-- Footer nav -->
      <div class="mv__footer">
        <button class="mv__nav-btn" @click="handleKembali">
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
          Kembali
        </button>
        <button class="mv__nav-btn mv__nav-btn--primary" :disabled="isLast" @click="next">
          Lanjut
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>

    <AccessibilityMenu />
  </div>
</template>

<style scoped>
.mv {
  min-height: 100vh;
  background: var(--color-background);
}

.mv__body {
  width: 75%;
  margin: 0 auto;
  padding: 2rem 1.5rem 5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mv__top-nav {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: calc(16px * var(--text-scale, 1));
  font-weight: 500;
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  max-width: fit-content;
}
.mv__top-nav:hover {
  opacity: 0.8;
}

/* Footer */
.mv__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.5rem;
}
.mv__nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  border-radius: var(--radius-xl);
  border: 1.5px solid var(--color-border);
  background: transparent;
  font-size: calc(13px * var(--text-scale, 1));
  font-weight: 500;
  color: var(--color-text-dark);
  cursor: pointer;
  transition: all 0.15s;
}
.mv__nav-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.mv__nav-btn--primary {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}
.mv__nav-btn--primary:hover {
  background: var(--color-primary-dark, #6a4db8);
}
.mv__nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
