<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const router = useRouter()
const route = useRoute()
const courseId = route.params.courseId as string

// In a real app we'd fetch this from API based on moduleId
const title = ref('Belajar dasar mengenal huruf vocal')
const content = ref('<p>Huruf-huruf alfabet terbagi menjadi beberapa bagian</p>')

function onBack() {
  router.push({ name: 'course-detail', params: { courseId } })
}

function onSave() {
  // Mock save API call
  console.log('Saved:', { title: title.value, content: content.value })
  // show toast here
}

function onFinish() {
  // Usually this does the same as save, then goes back
  onSave()
  onBack()
}
</script>

<template>
  <div class="materi-editor-page">
    <header class="page-header">
      <button class="btn-outline-gray" @click="onBack">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Kembali
      </button>
      <h1 class="page-title">Materi Mengenal Huruf Vocal (A, I, U, E, O)</h1>
      <button class="btn-solid-pink" @click="onFinish">
        Selesaikan
      </button>
    </header>

    <div class="editor-container">
      <div class="card-section">
        <h2 class="section-label">Judul Materi</h2>
        <input 
          v-model="title"
          type="text" 
          class="input-field" 
          placeholder="Judul Materi"
        />
      </div>

      <div class="card-section content-section">
        <h2 class="section-label">Konten Pembelajaran</h2>
        <div class="quill-wrapper">
          <QuillEditor 
            v-model:content="content" 
            contentType="html" 
            theme="snow" 
          />
        </div>
      </div>

      <div class="actions-footer">
        <button class="btn-solid-pink" @click="onSave">
          Simpan Perubahan
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.materi-editor-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

/* Header */
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
  transition: all 0.2s;
}
.btn-outline-gray:hover {
  background: #f8f9fa;
  color: var(--color-text-dark);
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
  transition: all 0.2s;
}
.btn-solid-pink:hover {
  background: #e62c76;
}

/* Editor Container */
.editor-container {
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
  gap: 24px;
}

.card-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-label {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-dark);
  margin: 0;
}

.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
  color: var(--color-text-dark);
  outline: none;
  transition: border-color 0.2s;
}
.input-field:focus {
  border-color: var(--color-primary);
}

/* Quill Wrapper adjustments to match mockup */
.quill-wrapper {
  border-radius: 8px;
  overflow: hidden;
}
:deep(.ql-toolbar.ql-snow) {
  border: 1px solid var(--color-border);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom: none;
  padding: 12px 16px;
  background: white;
}
:deep(.ql-container.ql-snow) {
  border: 1px solid var(--color-border);
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  min-height: 300px;
  font-size: 14px;
  font-family: inherit;
}
:deep(.ql-editor) {
  padding: 16px;
}

/* Footer Actions */
.actions-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
