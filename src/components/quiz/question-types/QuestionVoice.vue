<script setup lang="ts">
import type { ScreeningQuestion } from '@/types/screening.types';
import { ref, onUnmounted, watch } from 'vue'

const props = defineProps<{ 
  question: ScreeningQuestion,
  recordedAudioUrl?: string, // Initial answer
  readonly?: boolean // Review mode
}>()
const emit = defineEmits<{ (e: 'answer', value: string): void }>()

const recording = ref(false)
const audioUrl = ref<string | null>(props.recordedAudioUrl || null)
const mediaRecorder = ref<MediaRecorder | null>(null)
const audioChunks = ref<Blob[]>([])
const mediaStream = ref<MediaStream | null>(null)

watch(() => props.recordedAudioUrl, (newVal) => {
  if (newVal !== undefined) {
    audioUrl.value = newVal || null
  }
})

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

function resetRecording() {
  audioUrl.value = null
  emit('answer', '') // Clear answer in parent
}

// Cleanup object URLs on unmount to prevent memory leaks
onUnmounted(() => {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach(track => track.stop())
  }
})
</script>

<template>
  <div class="qv">
    <div class="qv__media-card">
      <span class="qv__media-label">{{ question.mediaLabel || question.text }}</span>
    </div>

    <!-- If we have recorded audio (or review mode), show player -->
    <div v-if="audioUrl" class="qv__player-container">
      <audio controls :src="audioUrl" class="qv__audio-player"></audio>
      
      <button v-if="!readonly" class="qv__retake-btn" @click="resetRecording">
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
      {{ recording ? 'Berhenti Merekam' : 'Rekam Suara' }}
    </button>
  </div>
</template>

<style scoped>
.qv { display: flex; flex-direction: column; align-items: center; gap: 2rem; width: 100%; max-width: 600px; }
.qv__media-card {
  width: 100%; height: 240px;
  background: #FCE7F3; /* Soft pink */
  border-radius: 24px;
  display: flex; align-items: center; justify-content: center;
  padding: 2rem;
}
.qv__media-label { 
  font-size: 4rem; 
  font-weight: 800; 
  color: #334155; /* Dark gray for contrast */
  text-align: center;
}
.qv__mic-btn {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.875rem 4rem;
  border-radius: 9999px;
  border: 1.5px solid #FF3366;
  background: var(--color-white);
  font-size: 1rem; font-weight: 600;
  color: #FF3366; cursor: pointer;
  transition: all 0.2s;
  justify-content: center;
}
.qv__mic-btn--active { 
  background: #FFE4E6; 
  border-color: #E11D48; 
  color: #E11D48;
  animation: pulse-red 1.5s infinite;
}

@keyframes pulse-red {
  0% { box-shadow: 0 0 0 0 rgba(225, 29, 72, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(225, 29, 72, 0); }
  100% { box-shadow: 0 0 0 0 rgba(225, 29, 72, 0); }
}

.qv__player-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
}

.qv__audio-player {
  width: 100%;
}

.qv__retake-btn {
  background: transparent;
  color: #FF3366;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}
</style>