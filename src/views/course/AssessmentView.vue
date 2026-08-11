<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAccessibility } from '@/composable/useAccessibility'
import AccessibilityMenu from '@/components/shared/AccessibilityMenu.vue'
import QuestionVoice from '@/components/quiz/question-types/QuestionVoice.vue'
import QuestionUpload from '@/components/quiz/question-types/QuestionUpload.vue'
import QuestionTap from '@/components/quiz/question-types/QuestionTap.vue'
import QuestionRapidNaming from '@/components/quiz/question-types/QuestionRapidNaming.vue'
import { useCourseDetail } from '@/composable/useCourseDetail'
import { courseService, latestAssessmentAnswers } from '@/services/course.service'
import { ttsService } from '@/services/tts.service'
import { aiService } from '@/services/ai.service'
import type {
  CourseDetail,
  CourseModule,
  AssessmentQuestion,
  AssessmentAnswer,
} from '@/types/course.types'

const router = useRouter()
const route = useRoute()
const { fontSizeClass, dyslexiaClass } = useAccessibility()

const moduleId = route.params.moduleId as string
const courseId = route.params.courseId as string

const courseData = ref<CourseDetail | null>(null)
const moduleData = ref<CourseModule | null>(null)
const questions = ref<AssessmentQuestion[]>([])
const answers = ref<Record<string, AssessmentAnswer>>({})
const questionDurations = ref<Record<string, number>>({})
const currentIndex = ref(0)
const loading = ref(true)
const submitting = ref(false)
const isSidebarOpen = ref(true)
const hasStarted = ref(false)

onMounted(async () => {
  try {
    const res = await courseService.getCourseDetail('c1', courseId)
    const course = res.data
    courseData.value = course || null
    const module = course ? course.modules.find((m) => m.id === moduleId) : null
    if (module) {
      moduleData.value = module
      if (module.questions) {
        questions.value = module.questions
      }
    }
  } catch (e) {
    console.error(e)
  }
  loading.value = false
})

onUnmounted(() => {
  if (globalTimerInterval) clearInterval(globalTimerInterval)
  ttsService.cancel()
})

const current = computed(() => questions.value[currentIndex.value])
const isLast = computed(() => currentIndex.value === questions.value.length - 1)

// --- Timer Logic ---
const ACCUMULATE_TIME = false // toggle: true = accumulate, false = reset
let activeQuestionStartTime = 0
const globalTimeLeft = ref<number | null>(null)
let globalTimerInterval: ReturnType<typeof setInterval> | null = null

const formattedGlobalTime = computed(() => {
  if (globalTimeLeft.value === null) return ''
  const m = Math.floor(globalTimeLeft.value / 60)
  const s = globalTimeLeft.value % 60
  return `${m}:${s.toString().padStart(2, '0')}`
})

function startQuestionTimer() {
  activeQuestionStartTime = Date.now()
}

function stopQuestionTimer(questionId: string) {
  if (activeQuestionStartTime > 0) {
    const elapsed = Math.floor((Date.now() - activeQuestionStartTime) / 1000)
    if (ACCUMULATE_TIME) {
      questionDurations.value[questionId] = (questionDurations.value[questionId] || 0) + elapsed
    } else {
      questionDurations.value[questionId] = elapsed
    }
  }
}

function playTTSForCurrentQuestion(delayMs = 1000) {
  if (!current.value) return
  const stringCategories = ['Deret Huruf', 'Kata', 'Kalimat', 'Menyusun Kata']
  if (stringCategories.includes(current.value.category)) {
    ttsService.speak({ text: current.value.mediaLabel, delayMs })
  }
}

function startAssessment() {
  hasStarted.value = true
  if (moduleData.value?.durationMinutes) {
    globalTimeLeft.value = moduleData.value.durationMinutes * 60
    globalTimerInterval = setInterval(() => {
      if (globalTimeLeft.value !== null && globalTimeLeft.value > 0) {
        globalTimeLeft.value--
      } else {
        clearInterval(globalTimerInterval)
        submitAssessment()
      }
    }, 1000)
  }
  startQuestionTimer()
  playTTSForCurrentQuestion()
}

function handleAnswer(value: string) {
  if (!current.value) return
  answers.value[current.value.id] = { questionId: current.value.id, value }
}

function retry() {
  if (!current.value) return
  delete answers.value[current.value.id]
}

function prev() {
  if (!current.value) return
  stopQuestionTimer(current.value.id)
  ttsService.cancel()
  if (currentIndex.value > 0) {
    currentIndex.value--
    startQuestionTimer()
    playTTSForCurrentQuestion()
  } else {
    router.back()
  }
}

function jumpTo(index: number) {
  if (!current.value || index === currentIndex.value) return
  stopQuestionTimer(current.value.id)
  ttsService.cancel()
  currentIndex.value = index
  startQuestionTimer()
  playTTSForCurrentQuestion()
}

async function submitAssessment() {
  if (current.value) stopQuestionTimer(current.value.id)
  ttsService.cancel()
  if (globalTimerInterval) clearInterval(globalTimerInterval)

  submitting.value = true

  // Process AI transcription batch
  const processPromises = questions.value.map(async (q) => {
    const ans = answers.value[q.id]
    if (ans && ans.value && !ans.transcription) {
      if (q.questionType === 'upload') {
        ans.transcription = await aiService.processImageToText(ans.value, q.correctAnswer)
      } else if (q.questionType === 'voice') {
        ans.transcription = await aiService.processAudioToText(ans.value, q.correctAnswer)
      }
    }
  })
  
  await Promise.allSettled(processPromises)

  // Attach durations to answers
  for (const q of questions.value) {
    if (answers.value[q.id]) {
      answers.value[q.id].durationSpent = questionDurations.value[q.id] || 0
    }
  }

  latestAssessmentAnswers.value = { ...answers.value }
  submitting.value = false
  router.push({ name: 'assessment-result', params: { courseId, moduleId } })
}

async function next() {
  if (!current.value) return
  stopQuestionTimer(current.value.id)
  ttsService.cancel()

  if (isLast.value) {
    return submitAssessment()
  }
  currentIndex.value++
  startQuestionTimer()
  playTTSForCurrentQuestion()
}
</script>

<template>
  <div class="assessment-page" :class="[fontSizeClass, dyslexiaClass]">
    <div class="assessment-page__header" v-if="hasStarted">
      <button class="assessment-page__back-btn" @click="router.back()">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <h1 class="assessment-page__title">{{ courseData?.title || 'Mengenal Huruf Vokal' }}</h1>
    </div>

    <div v-if="loading" class="assessment-page__loading">
      <div class="assessment-page__spinner" />
    </div>

    <!-- Intro State -->
    <div v-else-if="!hasStarted && moduleData" class="assessment-intro">
      <div class="assessment-intro__header">
        <h1 class="assessment-intro__title">{{ courseData?.title || 'Mengenal Huruf Vokal' }}</h1>
        <p class="assessment-intro__subtitle">{{ moduleData.title || 'Modul 1' }}</p>
      </div>

      <div class="assessment-intro__stats">
        <div class="assessment-intro__stat-card">
          <div class="assessment-intro__stat-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FF3366"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div class="assessment-intro__stat-label">Batas Waktu</div>
          <div class="assessment-intro__stat-value">
            {{ moduleData.durationMinutes ? moduleData.durationMinutes + ' Menit' : 'Tidak ada' }}
          </div>
        </div>
        <div class="assessment-intro__stat-card">
          <div class="assessment-intro__stat-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FF3366"
              stroke-width="2"
            >
              <path
                d="M19 4h-3V2h-2v2h-4V2H8v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"
              />
              <path d="M9 14l2 2 4-4" />
            </svg>
          </div>
          <div class="assessment-intro__stat-label">Pertanyaan</div>
          <div class="assessment-intro__stat-value">{{ questions.length }}</div>
        </div>
        <div class="assessment-intro__stat-card">
          <div class="assessment-intro__stat-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FF3366"
              stroke-width="2"
            >
              <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              />
            </svg>
          </div>
          <div class="assessment-intro__stat-label">Minimal Nilai</div>
          <div class="assessment-intro__stat-value">{{ moduleData.passingScore || 75 }}</div>
        </div>
      </div>

      <div class="assessment-intro__details">
        <div class="assessment-intro__card">
          <h3 class="assessment-intro__card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#3B82F6" stroke="none">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" stroke="#fff" stroke-width="2" stroke-linecap="round" />
              <circle cx="12" cy="8" r="1.5" fill="#fff" />
            </svg>
            Instruksi
          </h3>
          <ul class="assessment-intro__instruction-list">
            <li>
              <span class="assessment-intro__instruction-num">1</span>
              <span>Selesaikan semua soal dengan teliti.</span>
            </li>
            <li>
              <span class="assessment-intro__instruction-num">2</span>
              <span>Pastikan suara menyala jika ada soal audio.</span>
            </li>
          </ul>
        </div>

        <div class="assessment-intro__card">
          <h3 class="assessment-intro__card-title assessment-intro__card-title--blue">Kategori</h3>
          <div class="assessment-intro__tags">
            <span
              v-for="skill in moduleData.skills || ['Mendengar', 'Menulis', 'Membaca']"
              :key="skill"
              class="assessment-intro__tag"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>

      <div class="assessment-intro__actions">
        <button class="assessment-intro__btn assessment-intro__btn--outline" @click="router.back()">
          Batal
        </button>
        <button
          class="assessment-intro__btn assessment-intro__btn--primary"
          @click="startAssessment"
        >
          Kerjakan
        </button>
      </div>
    </div>

    <!-- Quiz State -->
    <div v-else-if="current" class="assessment-page__content">
      <!-- Sidebar Navigation -->
      <aside
        class="assessment-page__sidebar"
        :class="{ 'assessment-page__sidebar--collapsed': !isSidebarOpen }"
      >
        <div class="assessment-page__sidebar-header" @click="isSidebarOpen = !isSidebarOpen">
          <svg
            class="assessment-page__sidebar-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
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
            @click="jumpTo(index)"
          >
            <span class="assessment-page__nav-num">{{ index + 1 }}</span>
            <span class="assessment-page__nav-text">{{ q.text }}</span>
          </li>
        </ul>
      </aside>

      <!-- Main Area -->
      <main class="assessment-page__main">
        <div class="assessment-page__top-bar">
          <div v-if="globalTimeLeft !== null" class="assessment-page__timer">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Sisa Waktu:
            <strong :class="{ 'text-danger': globalTimeLeft < 60 }">{{
              formattedGlobalTime
            }}</strong>
          </div>
        </div>

        <h3 class="assessment-page__subtitle">
          Jawab dengan
          {{
            current.questionType === 'upload'
              ? 'menulis di kertas lalu di-upload, atau menggambar di canvas'
              : current.questionType === 'rapid-naming'
                ? 'menyebutkannya dengan cepat'
                : 'merekam suaramu'
          }}.
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
  overflow-y: auto;
}

.assessment-page__header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.assessment-page__top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  background: #f8fafc;
  padding: 12px 16px;
  border-radius: 12px;
}

.assessment-page__timer {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 500;
  color: #475569;
}

.text-danger {
  color: #ef4444;
}

.assessment-page__tts-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--color-white);
  border: 1.5px solid #ff3366;
  color: #ff3366;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.assessment-page__tts-btn:hover {
  background: #ffe4e6;
}

.assessment-page__back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: #ff3366;
  cursor: pointer;
}

.assessment-page__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ff3366;
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
  border-top-color: #ff3366;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Assessment Intro Styles */
.assessment-intro {
  max-width: 800px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
}

.assessment-intro__header {
  text-align: center;
}

.assessment-intro__title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 0.5rem;
}

.assessment-intro__subtitle {
  font-size: 1.1rem;
  color: #718096;
  margin: 0;
  font-weight: 500;
}

.assessment-intro__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.assessment-intro__stat-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.assessment-intro__stat-icon {
  margin-bottom: 0.25rem;
}

.assessment-intro__stat-label {
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
}

.assessment-intro__stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
}

.assessment-intro__details {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.assessment-intro__card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.assessment-intro__card-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #3b82f6;
  margin: 0 0 1.5rem;
}

.assessment-intro__instruction-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.assessment-intro__instruction-list li {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #4a5568;
  font-size: 0.95rem;
}

.assessment-intro__instruction-num {
  background: #e0e7ff;
  color: #4338ca;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.assessment-intro__tags {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.assessment-intro__tag {
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: #4a5568;
  background: white;
  text-align: center;
  font-weight: 500;
}

.assessment-intro__actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.assessment-intro__btn {
  padding: 0.75rem 2.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.assessment-intro__btn--outline {
  background: white;
  border: 1px solid #ff3366;
  color: #ff3366;
}
.assessment-intro__btn--outline:hover {
  background: #fff0f3;
}

.assessment-intro__btn--primary {
  background: #ff3366;
  border: 1px solid #ff3366;
  color: white;
}
.assessment-intro__btn--primary:hover {
  background: #e62c5c;
}

/* Existing Quiz Styles */
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
  color: #64748b;
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
  background: #fce7f3; /* tailwind pink-100 */
}

.assessment-page__nav-item--active .assessment-page__nav-num,
.assessment-page__nav-item--active .assessment-page__nav-text {
  color: #ff3366;
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
  border: 1px solid #ff3366;
  background: transparent;
  color: #ff3366;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.assessment-page__nav-btn:hover:not(:disabled) {
  background: #ff3366;
  color: white;
}

.assessment-page__nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .assessment-intro__stats {
    grid-template-columns: 1fr;
  }
  .assessment-intro__details {
    grid-template-columns: 1fr;
  }
}
</style>
