<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const courseId = route.params.courseId as string

// Mock Data for questions
const questions = ref([
  { id: 1, text: 'Ayam', category: 'kata', answer: 'Ayam' },
  { id: 2, text: 'Lorem ipsum door sit amet...', category: 'kalimat', answer: 'Lorem ipsum' },
  { id: 3, text: 'Lorem ipsum door sit amet...', category: 'kalimat', answer: 'Lorem ipsum' },
  { id: 4, text: 'Lorem ipsum door sit amet...', category: 'kalimat', answer: 'Lorem ipsum' },
])

const activeIndex = ref(0)
const activeQuestion = computed(() => questions.value[activeIndex.value])

const categories = [
  { label: 'Kata', value: 'kata' },
  { label: 'Kalimat', value: 'kalimat' },
  { label: 'Objek', value: 'objek' },
]

function onBack() {
  router.push({ name: 'course-detail', params: { courseId } })
}

function selectQuestion(index: number) {
  activeIndex.value = index
}

function nextQuestion() {
  if (activeIndex.value < questions.value.length - 1) {
    activeIndex.value++
  }
}

function prevQuestion() {
  if (activeIndex.value > 0) {
    activeIndex.value--
  }
}

function addQuestion() {
  questions.value.push({
    id: Date.now(),
    text: '',
    category: 'kata',
    answer: ''
  })
  activeIndex.value = questions.value.length - 1
}

function deleteQuestion() {
  if (questions.value.length > 1) {
    questions.value.splice(activeIndex.value, 1)
    if (activeIndex.value >= questions.value.length) {
      activeIndex.value = questions.value.length - 1
    }
  }
}

function onSave() {
  console.log('Saved assessment questions:', questions.value)
}

function onFinish() {
  onSave()
  onBack()
}
</script>

<template>
  <div class="assessment-editor-page">
    <header class="page-header">
      <button class="btn-outline-gray" @click="onBack">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Kembali
      </button>
      <h1 class="page-title">Assessmen Mengenal Huruf Vokal (A, I, U, E, O)</h1>
      <button class="btn-solid-pink" @click="onFinish">
        Selesaikan
      </button>
    </header>

    <div class="editor-layout">
      <!-- Sidebar / Navigasi Soal -->
      <aside class="sidebar">
        <div class="sidebar__header">
          <h2 class="sidebar__title">Navigasi Soal</h2>
          <button class="btn-outline-pink" @click="addQuestion">Tambah Soal</button>
        </div>

        <ul class="question-list">
          <li 
            v-for="(q, idx) in questions" 
            :key="q.id"
            class="question-item"
            :class="{ 'question-item--active': activeIndex === idx }"
            @click="selectQuestion(idx)"
          >
            <span class="q-number">{{ idx + 1 }}</span>
            <span class="q-text">{{ q.text || 'Soal baru...' }}</span>
            <div class="q-icon">
              <svg v-if="activeIndex === idx || q.category === 'kata'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <!-- Placeholder for other icons like Voice based on category -->
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" x2="12" y1="19" y2="22"/>
              </svg>
            </div>
          </li>
        </ul>

        <div class="sidebar__footer">
          <button class="btn-icon" @click="deleteQuestion" :disabled="questions.length <= 1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
          <button class="btn-outline-pink">Bank Soal</button>
        </div>
      </aside>

      <!-- Main Editor -->
      <main class="main-editor">
        <div class="editor__header">
          <div class="pagination">
            <button class="page-btn" @click="prevQuestion" :disabled="activeIndex === 0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <button class="page-btn" @click="nextQuestion" :disabled="activeIndex === questions.length - 1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
            <span class="page-text">Question <strong class="text-pink">{{ activeIndex + 1 }}</strong> of {{ questions.length }}</span>
          </div>
        </div>

        <div class="form-group" v-if="activeQuestion">
          <label>Kategori Soal</label>
          <div class="select-wrapper">
            <select class="input-field" v-model="activeQuestion.category">
              <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                {{ cat.label }}
              </option>
            </select>
            <svg class="select-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
        </div>

        <div class="form-group" v-if="activeQuestion">
          <label>Soal</label>
          <input 
            type="text" 
            class="input-field" 
            v-model="activeQuestion.text"
          />
        </div>

        <div class="form-group" v-if="activeQuestion">
          <label>Kunci Jawaban</label>
          <input 
            type="text" 
            class="input-field" 
            v-model="activeQuestion.answer"
          />
        </div>

        <div class="editor__footer">
          <a href="#" class="ai-link">Gunakan Rekomendasi AI</a>
          <button class="btn-solid-pink" @click="onSave">Simpan Perubahan</button>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.assessment-editor-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
}

/* Header (Shared styles with MateriEditor, kept separate for scoping) */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  padding: 16px 24px;
  border-radius: 12px;
  border: 1px solid var(--color-border);
}
.page-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-dark);
  margin: 0;
}
.btn-outline-gray {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text-light);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}
.btn-solid-pink {
  padding: 10px 24px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.text-pink {
  color: var(--color-primary);
}

/* Layout */
.editor-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  min-height: 600px;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  background: #fafafa;
}

.sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid var(--color-border);
  background: white;
}
.sidebar__title {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-dark);
  margin: 0;
}
.btn-outline-pink {
  padding: 6px 14px;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  background: white;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.question-list {
  flex: 1;
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
}
.question-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: background 0.2s;
  background: white;
}
.question-item:hover {
  background: #f8f9fa;
}
.question-item--active {
  background: #ffebf3; /* Faint pink */
}
.question-item--active:hover {
  background: #ffebf3;
}
.q-number {
  font-weight: 700;
  font-size: 14px;
  color: var(--color-text-dark);
  width: 20px;
}
.question-item--active .q-number {
  color: var(--color-primary);
}
.q-text {
  flex: 1;
  font-size: 13px;
  color: var(--color-text-dark);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.q-icon {
  color: var(--color-text-light);
  display: flex;
}
.question-item--active .q-icon {
  color: var(--color-primary);
}

.sidebar__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: white;
  border-top: 1px solid var(--color-border);
}
.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--color-border);
  background: white;
  border-radius: 6px;
  color: var(--color-text-light);
  cursor: pointer;
}
.btn-icon:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Main Editor */
.main-editor {
  display: flex;
  flex-direction: column;
  padding: 24px;
  background: white;
}
.editor__header {
  margin-bottom: 24px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 16px;
}
.pagination {
  display: flex;
  align-items: center;
  gap: 12px;
}
.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}
.page-btn:disabled {
  color: var(--color-text-light);
  cursor: not-allowed;
}
.page-text {
  font-size: 14px;
  color: var(--color-text-dark);
}

.form-group {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.form-group label {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-dark);
}
.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
  color: var(--color-text-dark);
  outline: none;
  appearance: none;
}
.input-field:focus {
  border-color: var(--color-primary);
}

.select-wrapper {
  position: relative;
}
.select-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--color-text-light);
}

.editor__footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 24px;
}
.ai-link {
  color: var(--color-primary);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}
</style>
