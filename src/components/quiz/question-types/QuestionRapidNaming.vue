<script setup lang="ts">
import type { ScreeningQuestion } from '@/types/screening.types';
import { ref, onUnmounted, watch } from 'vue'

const props = defineProps<{ 
  question: ScreeningQuestion,
  recordedAudioUrl?: string,
  readonly?: boolean 
}>()
const emit = defineEmits<{ (e: 'answer', value: string): void }>()

const recording = ref(false)
const audioUrl = ref<string | null>(null)
const mediaRecorder = ref<MediaRecorder | null>(null)
const audioChunks = ref<Blob[]>([])
const mediaStream = ref<MediaStream | null>(null)

function processAudioUrl(val: string | undefined) {
  if (!val) {
    audioUrl.value = null
    return
  }
  if (val.startsWith('data:audio/')) {
    try {
      const arr = val.split(',')
      const mime = arr[0].match(/:(.*?);/)?.[1] || 'audio/webm'
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      const blob = new Blob([u8arr], { type: mime })
      audioUrl.value = URL.createObjectURL(blob)
    } catch (e) {
      console.error('Failed to parse base64 audio', e)
      audioUrl.value = val // fallback
    }
  } else {
    audioUrl.value = val
  }
}

// Initialize
processAudioUrl(props.recordedAudioUrl)

watch(() => props.recordedAudioUrl, (newVal) => {
  processAudioUrl(newVal)
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

onUnmounted(() => {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach(track => track.stop())
  }
})
</script>

<template>
  <div class="qrn">
    <!-- Pink Card with Rapid Naming Items -->
    <div class="qrn__media-card">
      
      <!-- Colors -->
      <div v-if="question.rapidNamingType === 'color'" class="qrn__items-grid">
        <div 
          v-for="(color, i) in question.rapidNamingItems" 
          :key="'color-'+i" 
          class="qrn__color-box" 
          :style="{ backgroundColor: color }"
        ></div>
      </div>

      <!-- Pictures -->
      <div v-else-if="question.rapidNamingType === 'picture'" class="qrn__items-grid">
        <img 
          v-for="(pic, i) in question.rapidNamingItems" 
          :key="'pic-'+i" 
          :src="pic" 
          class="qrn__pic-box" 
          alt="Item"
        />
      </div>

    </div>

    <!-- If we have recorded audio (or review mode), show player -->
    <div v-if="audioUrl" class="qrn__player-container">
      <audio controls :src="audioUrl" class="qrn__audio-player"></audio>
      
      <button v-if="!readonly" class="qrn__retake-btn" @click="resetRecording">
        Ulangi Rekaman
      </button>
    </div>

    <!-- Record Button -->
    <button
      v-else-if="!readonly"
      class="qrn__mic-btn"
      :class="{ 'qrn__mic-btn--active': recording }"
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
    
    <div v-else class="qrn__empty-state">
      Tidak ada rekaman
    </div>
  </div>
</template>

<style scoped>
.qrn { 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  gap: 2rem; 
  width: 100%; 
  max-width: 600px; 
}

.qrn__media-card {
  width: 100%; 
  height: 240px;
  background: #FCE7F3; /* Soft pink */
  border-radius: 1.5rem;
  display: flex; 
  align-items: center; 
  justify-content: center;
  padding: 2rem;
}

.qrn__items-grid {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.qrn__color-box {
  width: 120px;
  height: 120px;
  /* Add subtle shadow if it's white or light */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.qrn__pic-box {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

.qrn__mic-btn {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.875rem 4rem;
  border-radius: 9999px;
  border: 1.5px solid #FF3366;
  background: var(--color-white);
  font-size: calc(1rem * var(--text-scale, 1)); font-weight: 600;
  color: #FF3366; cursor: pointer;
  transition: all 0.2s;
  justify-content: center;
}
.qrn__mic-btn--active { 
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

.qrn__player-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
}

.qrn__audio-player {
  width: 100%;
}

.qrn__retake-btn {
  background: transparent;
  color: #FF3366;
  border: none;
  font-size: calc(14px * var(--text-scale, 1));
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

.qrn__empty-state {
  color: #64748B;
  font-size: calc(1rem * var(--text-scale, 1));
  font-style: italic;
  padding: 1rem;
  text-align: center;
}
</style>
