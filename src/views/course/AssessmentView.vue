<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAccessibility } from '@/composable/useAccessibility'
import QuestionTap from '@/components/quiz/question-types/QuestionTap.vue'
import QuestionVoice from '@/components/quiz/question-types/QuestionVoice.vue'
import QuestionUpload from '@/components/quiz/question-types/QuestionUpload.vue'
import AccessibilityMenu from '@/components/shared/AccessibilityMenu.vue'

const route = useRoute()
const router = useRouter()
const { fontSizeClass, dyslexiaClass } = useAccessibility()

const courseId = route.params.courseId as string
const moduleId = route.params.moduleId as string

const questions = ref<any[]>([])
const answers = ref<Record<string, any>>({})
const currentIndex = ref(0)
const loading = ref(true)
const submitting = ref(false)

onMounted(() => {
  // Mock questions for the assessment based on mockup
  questions.value = [
    {
      id: 'q1',
      questionType: 'voice',
      category: 'Kata',
      text: 'Ayam',
      audioUrl: '', // optional audio hint
    },
    {
      id: 'q2',
      questionType: 'voice',
      category: 'Kata',
      text: 'Ikan',
    },
    {
      id: 'q3',
      questionType: 'voice',
      category: 'Kata',
      text: 'Bebek',
    },
    {
      id: 'q4',
      questionType: 'voice',
      category: 'Kata',
      text: 'Capung',
    },
    {
      id: 'q5',
      questionType: 'voice',
      category: 'Kata',
      text: 'Angsa',
    }
  ]
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
    <h1 class="assessment-page__title">Mengenal Huruf Vokal</h1>

    <div v-if="loading" class="assessment-page__loading">
      <div class="assessment-page__spinner" />
    </div>

    <div v-else-if="current" class="assessment-page__card">
      <div class="assessment-page__card-header">
        <h2 class="assessment-page__section">Soal {{ currentIndex + 1 }} dari {{ questions.length }}</h2>
        <span class="assessment-page__badge">{{ current.category }}</span>
      </div>

      <div class="assessment-page__question-area">
        <component
          :is="
            current.questionType === 'voice'
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
    </div>

    <!-- Nav -->
    <div class="assessment-page__nav">
      <button class="assessment-page__nav-btn" @click="prev">Kembali</button>
      <button class="assessment-page__nav-btn assessment-page__nav-btn--mid" @click="retry">Ulangi Lagi</button>
      <button class="assessment-page__nav-btn assessment-page__nav-btn--primary" :disabled="submitting" @click="next">
        {{ isLast ? (submitting ? 'Menyimpan...' : 'Selesai') : 'Lanjut' }}
      </button>
    </div>

    <AccessibilityMenu />
  </div>
</template>

<style scoped>
.assessment-page {
  min-height: 100vh;
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem 6rem;
  gap: 1.5rem;
  position: relative;
}

.assessment-page__title {
  font-size: 1.75em;
  font-weight: 700;
  color: var(--color-text-dark);
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
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.assessment-page__card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 1.5rem;
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.assessment-page__card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px dashed var(--color-border);
}

.assessment-page__section {
  font-size: 1.125em;
  font-weight: 700;
  color: var(--color-text-dark);
  margin: 0;
}

.assessment-page__badge {
  background: var(--color-primary);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.assessment-page__question-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
}

/* Nav */
.assessment-page__nav {
  display: flex;
  gap: 1rem;
  width: 100%;
  max-width: 600px;
  justify-content: space-between;
}
.assessment-page__nav-btn {
  padding: 1rem 1.5rem;
  border-radius: var(--radius-full);
  border: 2px solid var(--color-primary);
  background: transparent;
  color: var(--color-primary);
  font-weight: 700;
  cursor: pointer;
  flex: 1;
  text-align: center;
}
.assessment-page__nav-btn--mid {
  border-color: #fca5a5; /* lighter red/pink if desired */
  color: #ef4444;
}
.assessment-page__nav-btn--primary {
  background: var(--color-primary);
  color: var(--color-white);
}
.assessment-page__nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
