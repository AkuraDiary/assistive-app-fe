<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ScreeningQuestion, ScreeningAnswer, ScreeningPayload } from '@/types/dashboard.types'
import BaseButton from '@/components/shared/button/BaseButton.vue'

const props = defineProps<{
  childId: string
  screeningType: 'orang_tua' | 'anak'
  questions: ScreeningQuestion[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: ScreeningPayload): void
  (e: 'cancel'): void
}>()

const answers = ref<Record<string, number>>({})

const progress = computed(() => {
  const answered = Object.keys(answers.value).length
  return Math.round((answered / props.questions.length) * 100)
})

const allRequiredAnswered = computed(() =>
  props.questions
    .filter((q) => q.required)
    .every((q) => answers.value[q.id] !== undefined),
)

const title = computed(() =>
  props.screeningType === 'orang_tua'
    ? 'Pertanyaan Untuk Orang Tua Anak'
    : 'Pertanyaan Untuk Anak',
)

function handleSubmit() {
  if (!allRequiredAnswered.value) return
  const answerList: ScreeningAnswer[] = Object.entries(answers.value).map(
    ([questionId, value]) => ({ questionId, value }),
  )
  emit('submit', {
    childId: props.childId,
    screeningType: props.screeningType,
    answers: answerList,
  })
}
</script>

<template>
  <div class="sf">
    <h1 class="sf__page-title">Screening Form</h1>

    <!-- Header card -->
    <div class="sf__header-card">
      <h2 class="sf__title">{{ title }}</h2>
      <p class="sf__subtitle">Formulir ini secara otomatis menyimpan progress Anda</p>
      <p class="sf__required-note">* Menunjukkan pertanyaan yang wajib diisi</p>

      <!-- Progress bar -->
      <div class="sf__progress-track">
        <div class="sf__progress-fill" :style="{ width: `${progress}%` }">
          <span class="sf__progress-label">{{ progress }}%</span>
        </div>
      </div>
    </div>

    <!-- Questions -->
    <div class="sf__questions">
      <div
        v-for="question in questions"
        :key="question.id"
        class="sf__question-card"
      >
        <p class="sf__question-text">
          {{ question.order }}. {{ question.text }}
          <span v-if="question.required" class="sf__required">*</span>
        </p>

        <div class="sf__options">
          <label
            v-for="n in 5"
            :key="n"
            class="sf__option"
            :class="{ 'sf__option--selected': answers[question.id] === n }"
          >
            <input
              type="radio"
              class="sf__radio"
              :name="question.id"
              :value="n"
              :checked="answers[question.id] === n"
              @change="answers[question.id] = n"
            />
            Nilai = {{ n }}
          </label>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="sf__actions">
      <BaseButton variant="outline" color="ternary" @click="emit('cancel')">
        ← Kembali
      </BaseButton>
      <BaseButton
        color="ternary"
        :disabled="!allRequiredAnswered || loading"
        @click="handleSubmit"
      >
        {{ loading ? 'Menyimpan...' : 'Kirim' }}
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.sf {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.sf__page-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-dark);
  text-align: center;
  margin: 0;
}

/* Header card */
.sf__header-card {
  background: #eae6f8;
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.sf__title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-dark);
  margin: 0;
}

.sf__subtitle {
  font-size: 13px;
  color: var(--color-text-light);
  margin: 0;
}

.sf__required-note {
  font-size: 13px;
  color: var(--color-secondary);
  margin: 0;
}

/* Progress */
.sf__progress-track {
  height: 20px;
  background: var(--color-surface);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-top: var(--spacing-sm);
}

.sf__progress-fill {
  height: 100%;
  background: var(--color-primary-lighter);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width var(--transition-base);
  min-width: 40px;
}

.sf__progress-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-dark);
}

/* Questions */
.sf__questions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.sf__question-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.sf__question-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-dark);
  margin: 0;
}

.sf__required {
  color: var(--color-secondary);
  margin-left: 2px;
}

/* Options grid: 2 cols left, 2 center, 1 right — matches design */
.sf__options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, auto);
  gap: var(--spacing-sm) var(--spacing-md);
}

.sf__option {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-dark);
  cursor: pointer;
}

.sf__radio {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  flex-shrink: 0;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.sf__radio:checked {
  border-color: var(--color-primary);
  background: var(--color-primary);
}

.sf__option--selected {
  color: var(--color-primary);
}

/* Actions */
.sf__actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  padding-bottom: var(--spacing-xl);
}
</style>