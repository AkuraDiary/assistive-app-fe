<script setup lang="ts">
import type { ScreeningQuestion } from '@/types/screening.types'
import { ttsService } from '@/services/tts.service'
import { ref, onUnmounted, watch } from 'vue'

const props = defineProps<{
  question: ScreeningQuestion
  recordedAudioUrl?: string // Initial answer
  readonly?: boolean // Review mode
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

watch(
  () => props.recordedAudioUrl,
  (newVal) => {
    processAudioUrl(newVal)
  },
)

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
          mediaStream.value.getTracks().forEach((track) => track.stop())
        }
      }

      recorder.start()
      recording.value = true
    } catch (err) {
      console.error('Microphone access error:', err)
      alert('Gagal mengakses mikrofon. Pastikan browser memiliki izin mikrofon.')
    }
  }
}

function resetRecording() {
  audioUrl.value = null
  emit('answer', '') // Clear answer in parent
}

function playQuestionAudio() {
  if (props.question.audioUrl) {
    const audio = new Audio(props.question.audioUrl)
    audio.play()
  } else {
    ttsService.speak({ text: props.question.mediaLabel || props.question.text })
  }
}

// Cleanup object URLs on unmount to prevent memory leaks
onUnmounted(() => {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach((track) => track.stop())
  }
})
</script>

<template>
  <div class="qv">
    <div class="qv__media-card">
      <div class="qv__media-content">
        <span
          v-if="!question.audioUrl && !question.isAudioQuestion"
          class="qv__media-label"
          :class="{ 'qv__media-label--long': (question.mediaLabel || question.text).length > 8 }"
          >{{ question.mediaLabel || question.text }}</span
        >
        <button
          v-if="question.audioUrl || question.isAudioQuestion"
          class="qv__tts-btn"
          :class="{ 'qv__tts-btn--large': !!question.audioUrl || !!question.isAudioQuestion }"
          @click.prevent="playQuestionAudio"
          title="Dengarkan"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        </button>
      </div>
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
      v-else-if="!readonly"
      class="qv__mic-btn"
      :class="{ 'qv__mic-btn--active': recording }"
      @click="toggleRecord"
    >
      <svg v-if="!recording" width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor" />
        <path
          d="M5 10a7 7 0 0014 0M12 19v3M9 22h6"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
      <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="6" width="12" height="12" rx="2" />
      </svg>
      {{ recording ? 'Berhenti Merekam' : 'Rekam Suara' }}
    </button>

    <div v-else class="qv__empty-state">Tidak ada rekaman</div>
  </div>
</template>

<style scoped>
.qv {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
  max-width: 600px;
}
.qv__media-card {
  width: 100%;
  height: 240px;
  background: #fce7f3; /* Soft pink */
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
.qv__media-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.qv__tts-btn {
  background: var(--color-white);
  border: 1px solid #ff3366;
  color: #ff3366;
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.qv__tts-btn:hover {
  background: #ffe4e6;
}
.qv__tts-btn--large {
  padding: 1.5rem;
}
.qv__tts-btn--large svg {
  width: 40px;
  height: 40px;
}
.qv__media-label {
  font-size: calc(4rem * var(--text-scale, 1));
  font-weight: 800;
  color: #334155;
  text-align: center;
  word-break: break-word;
}
.qv__media-label--long {
  font-size: calc(2.5rem * var(--text-scale, 1));
  line-height: 1.3;
}
.qv__mic-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 4rem;
  border-radius: 9999px;
  border: 1.5px solid #ff3366;
  background: var(--color-white);
  font-size: calc(1rem * var(--text-scale, 1));
  font-weight: 600;
  color: #ff3366;
  cursor: pointer;
  transition: all 0.2s;
  justify-content: center;
}
.qv__mic-btn--active {
  background: #ffe4e6;
  border-color: #e11d48;
  color: #e11d48;
  animation: pulse-red 1.5s infinite;
}

@keyframes pulse-red {
  0% {
    box-shadow: 0 0 0 0 rgba(225, 29, 72, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(225, 29, 72, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(225, 29, 72, 0);
  }
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
  color: #ff3366;
  border: none;
  font-size: calc(14px * var(--text-scale, 1));
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

.qv__empty-state {
  color: #64748b;
  font-size: calc(1rem * var(--text-scale, 1));
  font-style: italic;
  padding: 1rem;
  text-align: center;
}
</style>
