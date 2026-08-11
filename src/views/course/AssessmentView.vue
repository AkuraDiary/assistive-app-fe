<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAccessibility } from '@/composable/useAccessibility'
import AccessibilityMenu from '@/components/shared/AccessibilityMenu.vue'
import QuestionVoice from '@/components/quiz/question-types/QuestionVoice.vue'
import QuestionUpload from '@/components/quiz/question-types/QuestionUpload.vue'
import QuestionTap from '@/components/quiz/question-types/QuestionTap.vue'
import QuestionRapidNaming from '@/components/quiz/question-types/QuestionRapidNaming.vue'

import { courseService } from '@/services/course.service'

const router = useRouter()
const route = useRoute()
const { fontSizeClass, dyslexiaClass } = useAccessibility()

const moduleId = route.params.moduleId as string
const courseId = route.params.courseId as string

const questions = ref<any[]>([])
const answers = ref<Record<string, any>>({})
const currentIndex = ref(0)
const loading = ref(true)
const submitting = ref(false)
const isSidebarOpen = ref(true)

onMounted(async () => {
  try {
    const course = await courseService.getCourseDetail('c1', courseId)
    const module = course.modules.find(m => m.id === moduleId)
    if (module && module.questions) {
      questions.value = module.questions
    }
  } catch(e) {
    console.error(e)
  }
  loading.value = false
})

const current = computed(() => questions.value[currentIndex.value])
const isLast = computed(() => currentIndex.value === questions.value.length - 1)

function handleAnswer(value: string) {
  if (!current.value) return
  answers.value[current.value.id] = { questionId: current.value.id, value }
}

function retry() {
  if (!current.value) return
  delete answers.value[current.value.id]
}

function prev() {
  if (currentIndex.value > 0) currentIndex.value--
  else router.back()
}

async function next() {
  if (isLast.value) {
    submitting.value = true
    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    // Save answers temporarily to simulate backend
    import('@/services/course.service').then(m => {
      m.latestAssessmentAnswers.value = { ...answers.value }
    })

    submitting.value = false
    router.push({ name: 'assessment-result', params: { courseId, moduleId } })
    return
  }
  currentIndex.value++
}
</script>

<template>
  <div class="assessment-page" :class="[fontSizeClass, dyslexiaClass]">
    <div class="assessment-page__header">
      <button class="assessment-page__back-btn" @click="router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="assessment-page__title">Mengenal Huruf Vokal</h1>
    </div>

    <div v-if="loading" class="assessment-page__loading">
      <div class="assessment-page__spinner" />
    </div>

    <div v-else-if="current" class="assessment-page__content">
      <!-- Sidebar Navigation -->
      <aside class="assessment-page__sidebar" :class="{ 'assessment-page__sidebar--collapsed': !isSidebarOpen }">
        <div class="assessment-page__sidebar-header" @click="isSidebarOpen = !isSidebarOpen">
          <svg class="assessment-page__sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <h2 class="assessment-page__sidebar-title">Navigasi Soal</h2>
        </div>

        <ul v-show="isSidebarOpen" class="assessment-page__nav-list">
          <li
            v-for="(q, index) in questions"
            :key="q.id"
            class="assessment-page__nav-item"
            :class="{ 'assessment-page__nav-item--active': currentIndex === index }"
            @click="currentIndex = index"
          >
            <span class="assessment-page__nav-num">{{ index + 1 }}</span>
            <span class="assessment-page__nav-text">{{ q.text }}</span>
          </li>
        </ul>
      </aside>

      <!-- Main Area -->
      <main class="assessment-page__main">
        <h3 class="assessment-page__subtitle">
          Jawab dengan {{ current.questionType === 'upload' ? 'menulis di kertas lalu di-upload, atau menggambar di canvas' : 'merekam suaramu' }}.
        </h3>

        <div class="assessment-page__question-area">
          <component
            :is="
              current.questionType === 'rapid-naming'
                ? QuestionRapidNaming
                : current.questionType === 'voice'
                  ? QuestionVoice
                  : current.questionType === 'upload'
                    ? QuestionUpload
                    : QuestionTap
            "
            :key="current.id + (answers[current.id] ? '-done' : '-empty')"
            :question="current"
            :recordedAudioUrl="answers[current.id]?.value"
            @answer="handleAnswer"
          />
        </div>

        <div class="assessment-page__nav-actions">
          <button class="assessment-page__nav-btn" @click="prev" :disabled="currentIndex === 0">
            &lt; Sebelumnya
          </button>
          <button class="assessment-page__nav-btn" :disabled="submitting" @click="next">
            {{ isLast ? (submitting ? 'Menyimpan...' : 'Selesai') : 'Selanjutnya >' }}
          </button>
        </div>
      </main>
    </div>

    <AccessibilityMenu />
  </div>
</template>

<style scoped>
.assessment-page {
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100vh;
  background: var(--color-white);
}

.assessment-page__header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.assessment-page__back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: #FF3366;
  cursor: pointer;
}

.assessment-page__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #FF3366;
  margin: 0;
}

.assessment-page__loading {
  display: flex;
  justify-content: center;
  padding: 4rem;
}
.assessment-page__spinner {
  width: 28px;
  height: 28px;
  border: 2px solid #ede8fa;
  border-top-color: #FF3366;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.assessment-page__content {
  display: flex;
  gap: 2rem;
  flex: 1;
  overflow: hidden;
}

/* Sidebar */
.assessment-page__sidebar {
  width: max-content;
  min-width: 200px;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  align-self: flex-start;
  transition: all 0.3s ease;
}

.assessment-page__sidebar-header {
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  color: var(--color-text-dark);
  transition: background-color 0.2s;
}

.assessment-page__sidebar-header:hover {
  background-color: #f8fafc;
}

.assessment-page__sidebar-icon {
  color: #64748B;
}

.assessment-page__sidebar-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #334155;
}

.assessment-page__nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid var(--color-border);
  overflow-y: auto;
  flex: 1;
}

.assessment-page__nav-item {
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  border-bottom: 1px solid var(--color-border);
  transition: background 0.2s;
}

.assessment-page__nav-item:hover {
  background: #f8fafc;
}

.assessment-page__nav-item--active {
  background: #FCE7F3; /* tailwind pink-100 */
}

.assessment-page__nav-item--active .assessment-page__nav-num,
.assessment-page__nav-item--active .assessment-page__nav-text {
  color: #FF3366;
  font-weight: 700;
}

.assessment-page__nav-num {
  font-size: 0.875rem;
  color: var(--color-text-light);
  width: 1rem;
}

.assessment-page__nav-text {
  font-size: 0.875rem;
  color: var(--color-text-dark);
  font-weight: 500;
}

/* Main Area */
.assessment-page__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  padding: 1rem 2rem 4rem;
  gap: 2rem;
}

.assessment-page__subtitle {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-dark);
  text-align: center;
  margin: 0;
}

.assessment-page__question-area {
  width: 100%;
  display: flex;
  justify-content: center;
}

.assessment-page__nav-actions {
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
  width: 100%;
  justify-content: space-between;
  max-width: 600px;
}

.assessment-page__nav-btn {
  padding: 0.75rem 2rem;
  border-radius: 9999px;
  border: 1px solid #FF3366;
  background: transparent;
  color: #FF3366;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.assessment-page__nav-btn:hover:not(:disabled) {
  background: #FF3366;
  color: white;
}

.assessment-page__nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
