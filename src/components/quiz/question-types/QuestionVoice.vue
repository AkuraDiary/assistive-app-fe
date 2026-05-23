<script setup lang="ts">
import { ref } from 'vue'
import type { ScreeningQuestion } from '@/types/dashboard.types'

defineProps<{ question: ScreeningQuestion }>()
const emit = defineEmits<{ (e: 'answer', value: string): void }>()

const recording = ref(false)

function toggleRecord() {
  recording.value = !recording.value
  // TODO: wire Web Speech API / MediaRecorder when backend ready
  if (!recording.value) emit('answer', 'recorded')
}
</script>

<template>
  <div class="qv">
    <p class="qv__prompt">{{ question.text }}</p>

    <div class="qv__media-card">
      <span class="qv__media-label">{{ question.mediaLabel }}</span>
    </div>

    <button
      class="qv__mic-btn"
      :class="{ 'qv__mic-btn--active': recording }"
      @click="toggleRecord"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor"/>
        <path d="M5 10a7 7 0 0014 0M12 19v3M9 22h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      {{ recording ? 'Berhenti' : 'Tekan Untuk mulai Berbicara' }}
    </button>
  </div>
</template>

<style scoped>
.qv { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
.qv__prompt { font-size: 1.1em; font-weight: 700; color: var(--color-text-dark); text-align: center; margin: 0; }
.qv__media-card {
  width: 280px; height: 280px;
  background: linear-gradient(135deg, #e8e4f8 0%, #ddf0e8 100%);
  border-radius: 24px;
  display: flex; align-items: center; justify-content: center;
}
.qv__media-label { font-size: 1.5em; font-weight: 700; color: var(--color-text-dark); }
.qv__mic-btn {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.875rem 2rem;
  border-radius: var(--radius-full);
  border: 1.5px solid #b8e8d0;
  background: #edf8f3;
  font-size: 14px; font-weight: 600;
  color: var(--color-text-dark); cursor: pointer;
  transition: all var(--transition-fast);
  min-width: 280px; justify-content: center;
}
.qv__mic-btn--active { background: #fde8e8; border-color: #f4a0a0; }
</style>