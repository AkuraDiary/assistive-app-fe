<script setup lang="ts">
import type { ScreeningQuestion } from '@/types/screening.types';
import { ref, onUnmounted } from 'vue'

const props = defineProps<{ 
  question: ScreeningQuestion,
  recordedAudioUrl?: string // For review mode
}>()
const emit = defineEmits<{ (e: 'answer', value: string): void }>()

const recording = ref(false)
const audioUrl = ref<string | null>(props.recordedAudioUrl || null)
const mediaRecorder = ref<MediaRecorder | null>(null)
const audioChunks = ref<Blob[]>([])
const mediaStream = ref<MediaStream | null>(null)

async function toggleRecord() {
  if (recording.value) {
    // Stop recording
    if (mediaRecorder.value) {
      mediaRecorder.value.stop()
    }
    recording.value = false
  } else {
    // Start recording
    audioUrl.value = null // clear previous
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStream.value = stream
      const recorder = new MediaRecorder(stream)
      mediaRecorder.value = recorder
      audioChunks.value = []
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.value.push(e.data)
        }
      }
      
      recorder.onstop = () => {
        const blob = new Blob(audioChunks.value, { type: 'audio/webm' })
        audioUrl.value = URL.createObjectURL(blob)
        
        // Convert Blob to Base64 to simulate sending data later
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = () => {
          emit('answer', reader.result as string)
        }
        
        // Release mic
        if (mediaStream.value) {
          mediaStream.value.getTracks().forEach(track => track.stop())
        }
      }
      
      recorder.start()
      recording.value = true
    } catch (err) {
      console.error("Microphone access error:", err)
      alert("Gagal mengakses mikrofon. Pastikan browser memiliki izin mikrofon.")
    }
  }
}

// Cleanup object URLs on unmount to prevent memory leaks
onUnmounted(() => {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach(track => track.stop())
  }
  // We keep the data URL, but we can revoke the local blob object url if we want.
  // Actually, let's leave it as is to keep playback smooth until navigation.
})
</script>

<template>
  <div class="qv">
    <p class="qv__prompt">{{ question.text }}</p>

    <div class="qv__media-card">
      <span class="qv__media-label">{{ question.mediaLabel }}</span>
    </div>

    <!-- If we have recorded audio (or review mode), show player -->
    <div v-if="audioUrl" class="qv__player-container">
      <audio controls :src="audioUrl" class="qv__audio-player"></audio>
      
      <!-- Only show retake button if not in readonly/review mode -->
      <button v-if="!recordedAudioUrl" class="qv__retake-btn" @click="audioUrl = null">
        Ulangi Rekaman
      </button>
    </div>

    <!-- Record Button -->
    <button
      v-else
      class="qv__mic-btn"
      :class="{ 'qv__mic-btn--active': recording }"
      @click="toggleRecord"
    >
      <svg v-if="!recording" width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor"/>
        <path d="M5 10a7 7 0 0014 0M12 19v3M9 22h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="6" width="12" height="12" rx="2" />
      </svg>
      {{ recording ? 'Berhenti Merekam' : 'Tekan Untuk mulai Berbicara' }}
    </button>
  </div>
</template>

<style scoped>
.qv { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; width: 100%; }
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
.qv__mic-btn--active { 
  background: #fde8e8; 
  border-color: #f4a0a0; 
  animation: pulse-red 1.5s infinite;
}

@keyframes pulse-red {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

.qv__player-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 320px;
}

.qv__audio-player {
  width: 100%;
}

.qv__retake-btn {
  background: transparent;
  color: #ef4444;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}
</style>