<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { courseService } from '@/services/course.service'
import type { AssessmentQuestion } from '@/types/course.types'

const router = useRouter()
const route = useRoute()
const courseId = route.params.courseId as string
const moduleId = route.params.moduleId as string

const courseTitle = ref('Loading...')
const questions = ref<AssessmentQuestion[]>([])

onMounted(async () => {
  const res = await courseService.getCourseDetail('c1', courseId)
  if (res.success && res.data) {
    courseTitle.value = res.data.name
    const module = res.data.modules.find(m => m.id === moduleId)
    if (module && module.questions) {
      questions.value = module.questions
    }
  }
  if (questions.value.length === 0) {
    addQuestion() // Add default question if empty
  }
})

const activeIndex = ref(0)
const activeQuestion = computed(() => questions.value[activeIndex.value])

const categories = [
  { label: 'Deret Huruf', value: 'Deret Huruf' },
  { label: 'Kata', value: 'Kata' },
  { label: 'Kalimat', value: 'Kalimat' },
  { label: 'Menyusun Kata', value: 'Menyusun Kata' },
  { label: 'Rapid Naming (Warna)', value: 'Rapid Naming (Warna)' },
  { label: 'Rapid Naming (Gambar)', value: 'Rapid Naming (Gambar)' },
]

const presetColors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#374151', '#ffffff']

const fileInput = ref<HTMLInputElement | null>(null)

function triggerUpload() {
  fileInput.value?.click()
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return

  const file = files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target?.result) {
      if (!activeQuestion.value) return
      if (!activeQuestion.value.options) {
        activeQuestion.value.options = []
      }
      activeQuestion.value.options.push(e.target.result as string)
    }
  }
  reader.readAsDataURL(file)
  
  // reset input
  target.value = ''
}

function toggleColor(color: string) {
  if (!activeQuestion.value) return
  if (!activeQuestion.value.options) {
    activeQuestion.value.options = []
  }
  const idx = activeQuestion.value.options.indexOf(color)
  if (idx > -1) {
    activeQuestion.value.options.splice(idx, 1)
  } else {
    activeQuestion.value.options.push(color)
  }
}

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
    id: Date.now().toString(),
    text: '',
    category: 'Kata',
    correctAnswer: '',
    questionType: 'upload'
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

async function onSave() {
  await courseService.updateAssessmentQuestions(courseId, moduleId, questions.value)
}

async function onFinish() {
  await onSave()
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
      <h1 class="page-title">Assessmen {{ courseTitle }}</h1>
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
              <template v-if="['Deret Huruf', 'Kata', 'Kalimat', 'Menyusun Kata'].includes(q.category)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </template>
              <template v-else-if="q.category === 'Rapid Naming (Gambar)'">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </template>
              <template v-else-if="q.category === 'Rapid Naming (Warna)'">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
                  <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
                  <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
                  <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.464-.652-.464-1.027 0-.598.547-1.082 1.241-1.082h1.34c3.488 0 6.672-3.129 6.672-7.078C22 6.5 17.5 2 12 2z"/>
                </svg>
              </template>
              <template v-else>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" x2="12" y1="19" y2="22"/>
                </svg>
              </template>
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

        <div class="form-group" v-if="activeQuestion && ['Deret Huruf', 'Kata', 'Kalimat', 'Menyusun Kata'].includes(activeQuestion.category)">
          <label>Cara Menjawab (Metode)</label>
          <div class="select-wrapper">
            <select class="input-field" v-model="activeQuestion.questionType">
              <option value="upload">Menulis / Upload Gambar</option>
              <option value="voice">Berbicara (Rekam Suara)</option>
            </select>
            <svg class="select-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
        </div>

        <div class="form-group" v-if="activeQuestion && activeQuestion.category === 'Rapid Naming (Warna)'">
          <label>Pilih Warna</label>
          <div class="colors-grid">
            <div 
              v-for="color in presetColors" 
              :key="color"
              class="color-swatch"
              :class="{ 'color-swatch--selected': activeQuestion.options?.includes(color) }"
              :style="{ backgroundColor: color }"
              @click="toggleColor(color)"
            ></div>
          </div>
        </div>

        <div class="form-group" v-if="activeQuestion && activeQuestion.category === 'Rapid Naming (Gambar)'">
          <label>Pilih Objek</label>
          <div class="images-grid">
            <div 
              v-for="(img, i) in activeQuestion.options || []" 
              :key="i"
              class="image-preview"
            >
              <img :src="img" alt="Object Option" />
              <button class="image-preview__del" @click="activeQuestion.options?.splice(i, 1)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="upload-btn" @click="triggerUpload">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <span>Upload Gambar</span>
            </div>
            <!-- hidden file input -->
            <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" style="display: none" />
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
            v-model="activeQuestion.correctAnswer"
          />
          <span class="help-text" v-if="activeQuestion.category === 'Rapid Naming (Gambar)' || activeQuestion.category === 'Rapid Naming (Warna)' || activeQuestion.category === 'Menyusun Kata'">Pisahkan kunci jawaban dengan tanda koma (,)</span>
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
  font-size: calc(16px * var(--text-scale, 1));
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
  font-size: calc(14px * var(--text-scale, 1));
  font-weight: 500;
  cursor: pointer;
}
.btn-solid-pink {
  padding: 10px 24px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: calc(14px * var(--text-scale, 1));
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
  font-size: calc(14px * var(--text-scale, 1));
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
  font-size: calc(13px * var(--text-scale, 1));
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
  font-size: calc(14px * var(--text-scale, 1));
  color: var(--color-text-dark);
  width: 20px;
}
.question-item--active .q-number {
  color: var(--color-primary);
}
.q-text {
  flex: 1;
  font-size: calc(13px * var(--text-scale, 1));
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
  font-size: calc(14px * var(--text-scale, 1));
  color: var(--color-text-dark);
}

.form-group {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.form-group label {
  font-size: calc(14px * var(--text-scale, 1));
  font-weight: 700;
  color: var(--color-text-dark);
}
.help-text {
  font-size: calc(12px * var(--text-scale, 1));
  color: var(--color-text-light);
}
.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: calc(14px * var(--text-scale, 1));
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
  font-size: calc(14px * var(--text-scale, 1));
  font-weight: 600;
  text-decoration: none;
}

.colors-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.color-swatch {
  width: 54px;
  height: 54px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}
.color-swatch:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.color-swatch--selected {
  border: 3px solid var(--color-primary);
}

.images-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.image-preview {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  position: relative;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.image-preview__del {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.image-preview__del:hover {
  background: rgba(0,0,0,0.7);
}

.upload-btn {
  width: 110px;
  height: 80px;
  border-radius: 8px;
  border: 1px dashed var(--color-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  background: #fafafa;
  color: var(--color-text-light);
  transition: background 0.2s;
}
.upload-btn:hover {
  background: #f0f0f0;
}
.upload-btn span {
  font-size: calc(11px * var(--text-scale, 1));
  font-weight: 500;
}
</style>
