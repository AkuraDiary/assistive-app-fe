<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import QuestionVoice from '@/components/quiz/question-types/QuestionVoice.vue'
import QuestionUpload from '@/components/quiz/question-types/QuestionUpload.vue'
import { latestAssessmentAnswers } from '@/services/course.service'

const router = useRouter()

// Mock data based on mockups
const questions = ref([
  { id: 'q1', number: 1, title: 'Ayam', category: 'Kata', questionType: 'voice', questionText: 'Ayam', userAnswer: 'Ayam', correctAnswer: 'Ayam', isCorrect: true },
  { id: 'q2', number: 2, title: 'Ikan', category: 'Kata', questionType: 'voice', questionText: 'Ikan', userAnswer: 'Kain', correctAnswer: 'Ikan', isCorrect: false },
  { id: 'q3', number: 3, title: 'Bebek', category: 'Kata', questionType: 'voice', questionText: 'Bebek', userAnswer: 'Bebek', correctAnswer: 'Bebek', isCorrect: true },
  { id: 'q4', number: 4, title: 'Capung', category: 'Kata', questionType: 'voice', questionText: 'Capung', userAnswer: 'Capung', correctAnswer: 'Capung', isCorrect: true },
  { id: 'q5', number: 5, title: 'Angsa', category: 'Kata', questionType: 'voice', questionText: 'Angsa', userAnswer: 'Angsa', correctAnswer: 'Angsa', isCorrect: true },
])

onMounted(() => {
  // Override mock answers with actual recorded answers if available
  questions.value.forEach(q => {
    const recorded = latestAssessmentAnswers.value[q.id]
    if (recorded) {
      q.userAnswer = recorded.value
      // We assume correct just for show, but in a real app this is graded by the backend
      q.isCorrect = true 
    }
  })
})

const activeQuestionId = ref('q1')
const activeQuestion = computed(() => questions.value.find(q => q.id === activeQuestionId.value))

const showMediaModal = ref(false)

function goBack() {
  router.back()
}

function nextQuestion() {
  if (!activeQuestion.value) return
  const index = questions.value.findIndex(q => q.id === activeQuestion.value!.id)
  if (index < questions.value.length - 1) {
    activeQuestionId.value = questions.value[index + 1].id
  }
}

function prevQuestion() {
  if (!activeQuestion.value) return
  const index = questions.value.findIndex(q => q.id === activeQuestion.value!.id)
  if (index > 0) {
    activeQuestionId.value = questions.value[index - 1].id
  }
}
</script>

<template>
  <div class="review-page">
    <div class="review-page__header">
      <button class="review-page__back-btn" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Kembali
      </button>
      <h1 class="review-page__title">Mengenal Huruf Vokal</h1>
    </div>

    <div class="review-page__content">
      <!-- Sidebar Navigation -->
      <aside class="review-page__sidebar">
        <h2 class="review-page__sidebar-title">Navigasi Soal</h2>
        <ul class="review-page__nav-list">
          <li 
            v-for="q in questions" 
            :key="q.id"
            class="review-page__nav-item"
            :class="{ 'review-page__nav-item--active': activeQuestionId === q.id }"
            @click="activeQuestionId = q.id"
          >
            <span class="review-page__nav-num">{{ q.number }}</span>
            <span class="review-page__nav-text">{{ q.title }}</span>
          </li>
        </ul>
      </aside>

      <!-- Main Review Area -->
      <main class="review-page__main" v-if="activeQuestion">
        <header class="review-page__main-header">
          <span class="review-page__pagination">Soal <span class="review-page__pagination-active">{{ activeQuestion.number }}</span> dari {{ questions.length }}</span>
        </header>

        <div class="review-page__editor">
          <div class="review-page__form-group review-page__form-group--row">
            <label class="review-page__label">Kategori Soal</label>
            <span class="review-page__badge">{{ activeQuestion.category }}</span>
          </div>

          <div class="review-page__form-group">
            <label class="review-page__label">Soal</label>
            <input type="text" class="review-page__input" :value="activeQuestion.questionText" disabled />
          </div>

          <div class="review-page__answer-grid">
            <div class="review-page__form-group">
              <label class="review-page__label">Transkrip Jawaban</label>
              <div 
                class="review-page__input-wrapper"
                :class="{ 
                  'review-page__input-wrapper--correct': activeQuestion.isCorrect,
                  'review-page__input-wrapper--incorrect': !activeQuestion.isCorrect
                }"
              >
                <input type="text" class="review-page__input review-page__input--status" :value="activeQuestion.userAnswer" disabled />
                <svg v-if="activeQuestion.isCorrect" class="review-page__status-icon review-page__status-icon--correct" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 13L9 17L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else class="review-page__status-icon review-page__status-icon--incorrect" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              
              <!-- Media Links -->
              <button 
                v-if="activeQuestion.questionType === 'upload'" 
                class="review-page__media-link"
                @click="showMediaModal = true"
              >
                Lihat Gambar Tulisan
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.232 5.232L18.768 8.768M16.732 3.732C17.708 2.756 19.292 2.756 20.268 3.732C21.244 4.708 21.244 6.292 20.268 7.268L7.268 20.268L3 21L3.732 16.732L16.732 3.732Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              
              <button 
                v-else-if="activeQuestion.questionType === 'voice'" 
                class="review-page__media-link"
                @click="showMediaModal = true"
              >
                Dengarkan Rekaman Suara
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M15.54 8.46C16.4774 9.3976 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4774 14.5924 15.54 15.53" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>

            <div class="review-page__form-group">
              <label class="review-page__label">Kunci Jawaban</label>
              <input type="text" class="review-page__input" :value="activeQuestion.correctAnswer" disabled />
            </div>
          </div>

          <div class="review-page__metrics">
            <span class="review-page__metric-pill">Skor : <span class="review-page__metric-bold">10/100</span></span>
            <span class="review-page__metric-pill">Durasi Menjawab : <span class="review-page__metric-bold">10 Detik</span></span>
          </div>
        </div>

        <div class="review-page__actions">
          <button class="review-page__btn review-page__btn--outline" @click="prevQuestion" :disabled="activeQuestion.number === 1">
            &lt; Sebelumnya
          </button>
          <button class="review-page__btn review-page__btn--primary" @click="nextQuestion" :disabled="activeQuestion.number === questions.length">
            Selanjutnya &gt;
          </button>
        </div>
      </main>
    </div>

    <!-- Media Modal -->
    <div v-if="showMediaModal" class="review-page__modal-overlay" @click.self="showMediaModal = false">
      <div class="review-page__modal-content">
        <h3 class="review-page__modal-title">Review Media Jawaban</h3>
        <component
          :is="activeQuestion?.questionType === 'voice' ? QuestionVoice : QuestionUpload"
          :question="{ id: activeQuestion?.id, text: activeQuestion?.questionText, questionType: activeQuestion?.questionType, mediaLabel: activeQuestion?.questionText }"
          :recordedAudioUrl="activeQuestion?.userAnswer"
          :readonly="true"
          class="review-page__modal-component"
        />
        <button class="review-page__btn review-page__btn--primary" style="margin-top: 1rem; width: 100%" @click="showMediaModal = false">Tutup</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.review-page {
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100vh;
  background: #f8fafc;
}

.review-page__header {
  background: var(--color-white);
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.review-page__back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  font-weight: 500;
  color: var(--color-text-dark);
  cursor: pointer;
}

.review-page__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-dark);
  margin: 0;
}

.review-page__content {
  display: flex;
  gap: 1.5rem;
  flex: 1;
  overflow: hidden;
}

/* Sidebar */
.review-page__sidebar {
  width: 280px;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.review-page__sidebar-title {
  padding: 1rem 1.5rem;
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text-dark);
  border-bottom: 1px solid var(--color-border);
}

.review-page__nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  flex: 1;
}

.review-page__nav-item {
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  border-bottom: 1px solid var(--color-border);
  transition: background 0.2s;
}

.review-page__nav-item:hover {
  background: #f8fafc;
}

.review-page__nav-item--active {
  background: #ffebf3;
}

.review-page__nav-item--active .review-page__nav-num,
.review-page__nav-item--active .review-page__nav-text {
  color: var(--color-primary);
  font-weight: 700;
}

.review-page__nav-num {
  font-size: 0.875rem;
  color: var(--color-text-light);
  width: 1rem;
}

.review-page__nav-text {
  font-size: 0.875rem;
  color: var(--color-text-dark);
  font-weight: 500;
}

/* Main Area */
.review-page__main {
  flex: 1;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  overflow-y: auto;
}

.review-page__main-header {
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 1.5rem;
}

.review-page__pagination {
  font-size: 0.875rem;
  color: var(--color-text-light);
}

.review-page__pagination-active {
  color: var(--color-primary);
  font-weight: 700;
}

.review-page__editor {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
}

.review-page__form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.review-page__form-group--row {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.review-page__label {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-text-dark);
}

.review-page__badge {
  background: var(--color-primary);
  color: white;
  padding: 0.25rem 1rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
}

.review-page__input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.review-page__input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text-dark);
  background: var(--color-bg);
}

.review-page__input-wrapper--correct .review-page__input {
  border-color: #22c55e;
  color: #22c55e;
}
.review-page__input-wrapper--incorrect .review-page__input {
  border-color: #ef4444;
  color: #ef4444;
}

.review-page__status-icon {
  position: absolute;
  right: 1rem;
}
.review-page__status-icon--correct {
  color: #22c55e;
}
.review-page__status-icon--incorrect {
  color: #ef4444;
}

.review-page__answer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: flex-start;
}

.review-page__media-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-primary);
  background: none;
  border: none;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  margin-top: 0.25rem;
}

.review-page__metrics {
  display: flex;
  gap: 1rem;
  margin-top: auto;
  padding-top: 1.5rem;
}

.review-page__metric-pill {
  background: var(--color-primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 1.5rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.review-page__metric-bold {
  font-weight: 700;
}

.review-page__actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.review-page__btn {
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.review-page__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.review-page__btn--primary {
  background: var(--color-primary);
  color: white;
  border: none;
}
.review-page__btn--primary:hover:not(:disabled) {
  background: var(--color-primary-hover, #db2777);
}

.review-page__btn--outline {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}
.review-page__btn--outline:hover:not(:disabled) {
  background: #fdf2f8;
}

/* Modal */
.review-page__modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.review-page__modal-content {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  min-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

.review-page__modal-title {
  margin: 0;
  font-size: 1.25rem;
  color: var(--color-text-dark);
}

.review-page__modal-component {
  pointer-events: none; /* Make it read-only purely for review visualization */
}
</style>
