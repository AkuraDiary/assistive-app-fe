<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAccessibility } from '@/composable/useAccessibility'
import QuestionTap from '@/components/quiz/question-types/QuestionTap.vue'
import QuestionVoice from '@/components/quiz/question-types/QuestionVoice.vue'
import QuestionUpload from '@/components/quiz/question-types/QuestionUpload.vue'
import AccessibilityMenu from '@/components/shared/AccessibilityMenu.vue'
import { screeningService } from '@/services/screening.service'
import type { ScreeningQuestion, ScreeningAnswer } from '@/types/screening.types'

const route = useRoute()
const router = useRouter()
const { fontSizeClass, dyslexiaClass } = useAccessibility()

const childId = route.params.childId as string
const screeningType = route.params.type as 'orang_tua' | 'anak'

const questions = ref<ScreeningQuestion[]>([])
const answers = ref<Record<string, ScreeningAnswer>>({})
const currentIndex = ref(0)
const loading = ref(true)
const submitting = ref(false)

onMounted(async () => {
  questions.value = await screeningService.getScreeningQuestions(screeningType)
  loading.value = false
})

const current = computed(() => questions.value[currentIndex.value])
const isLast = computed(() => currentIndex.value === questions.value.length - 1)
const hasAnswer = computed(() => !!answers.value[current.value?.id])

function handleAnswer(value: string) {
  if (!current.value) return
  answers.value[current.value.id] = { questionId: current.value.id, value: 1 }
  // value stored as string for media types; backend mapping done at submit
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
    await screeningService.submitScreening({
      childId,
      screeningType,
      answers: Object.values(answers.value),
    })
    submitting.value = false
    router.push('/dashboard')
    return
  }
  currentIndex.value++
}
</script>

<template>
  <div class="sv" :class="[fontSizeClass, dyslexiaClass]">
    <h1 class="sv__title">Temukan Levelmu!</h1>

    <div v-if="loading" class="sv__loading">
      <div class="sv__spinner" />
    </div>

    <div v-else-if="current" class="sv__card">
      <div class="sv__card-header">
        <h2 class="sv__section">Pretest</h2>
        <span class="sv__step-badge">{{ currentIndex + 1 }}.</span>
      </div>

      <div class="sv__question-area">
        <component
          :is="
            current.questionType === 'voice'
              ? QuestionVoice
              : current.questionType === 'upload'
                ? QuestionUpload
                : QuestionTap
          "
          :question="current"
          @answer="handleAnswer"
        />
      </div>
    </div>

    <!-- Nav -->
    <div class="sv__nav">
      <button class="sv__nav-btn" @click="prev">Kembali</button>
      <button class="sv__nav-btn sv__nav-btn--mid" @click="retry">Ulangi Lagi</button>
      <button class="sv__nav-btn sv__nav-btn--primary" :disabled="submitting" @click="next">
        {{ isLast ? (submitting ? 'Menyimpan...' : 'Selesai') : 'Lanjut' }}
      </button>
    </div>

    <AccessibilityMenu />
  </div>
</template>

<style scoped>
.sv {
  min-height: 100vh;
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem 6rem;
  gap: 1.5rem;
}

.sv__title {
  font-size: 1.75em;
  font-weight: 700;
  color: var(--color-text-dark);
  margin: 0;
}

.sv__loading {
  display: flex;
  justify-content: center;
  padding: 4rem;
}
.sv__spinner {
  width: 28px;
  height: 28px;
  border: 2px solid #ede8fa;
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.sv__card {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: 2rem;
  width: 100%;
  max-width: 760px;
  min-height: 540px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.sv__card-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.sv__section {
  font-size: 1.25em;
  font-weight: 700;
  color: var(--color-text-dark);
  margin: 0;
}

.sv__step-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 28px;
  background: var(--color-primary-lighter);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-dark);
}

.sv__question-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Nav */
.sv__nav {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}
.sv__nav-btn {
  padding: 0.75rem 1.75rem;
  border-radius: var(--radius-full);
  border: 1.5px solid var(--color-border);
  background: var(--color-surface);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-dark);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.sv__nav-btn--mid {
  color: var(--color-primary);
  border-color: var(--color-primary-lighter);
}
.sv__nav-btn--primary {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}
.sv__nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
