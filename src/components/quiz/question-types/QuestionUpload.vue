<script setup lang="ts">
import type { ScreeningQuestion } from '@/types/screening.types'
import { ttsService } from '@/services/tts.service'
import { ref, onUnmounted, watch, onMounted } from 'vue'

const props = defineProps<{
  question: ScreeningQuestion
  recordedAudioUrl?: string
  readonly?: boolean
}>()
const emit = defineEmits<{ (e: 'answer', value: string): void }>()

const preview = ref<string | null>(props.recordedAudioUrl || null)
const inputRef = ref<HTMLInputElement>()

// Modes: 'canvas', 'camera', 'preview'
// Default to 'canvas' if no preview, else 'preview'
const currentMode = ref<'canvas' | 'camera' | 'preview'>(preview.value ? 'preview' : 'canvas')

watch(
  () => props.recordedAudioUrl,
  (newVal) => {
    if (newVal !== undefined) {
      preview.value = newVal || null
      if (preview.value) currentMode.value = 'preview'
    }
  },
)

// File Upload
function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    preview.value = ev.target?.result as string
    currentMode.value = 'preview'
    emit('answer', preview.value)
  }
  reader.readAsDataURL(file)
}

function triggerUpload() {
  inputRef.value?.click()
}

// Canvas Logic
const canvasRef = ref<HTMLCanvasElement | null>(null)
let isDrawing = false

function initCanvas() {
  if (canvasRef.value) {
    const ctx = canvasRef.value.getContext('2d')
    if (ctx) {
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)
    }
  }
}

onMounted(() => {
  if (currentMode.value === 'canvas') {
    setTimeout(initCanvas, 100)
  }
})

watch(currentMode, (newMode) => {
  if (newMode === 'canvas') {
    setTimeout(initCanvas, 100)
  }
})

function startDrawing(e: MouseEvent | TouchEvent) {
  if (props.readonly) return
  isDrawing = true
  draw(e)
}
function stopDrawing() {
  isDrawing = false
  const canvas = canvasRef.value
  if (canvas) {
    const ctx = canvas.getContext('2d')
    ctx?.beginPath()
  }
}
function draw(e: MouseEvent | TouchEvent) {
  if (!isDrawing || !canvasRef.value || props.readonly) return
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.lineWidth = 5
  ctx.lineCap = 'round'
  ctx.strokeStyle = '#333'

  const rect = canvas.getBoundingClientRect()

  // Handle scaling if CSS size differs from canvas internal size
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height

  let clientX = 0,
    clientY = 0
  if (e instanceof MouseEvent) {
    clientX = e.clientX
    clientY = e.clientY
  } else if ('touches' in e && e.touches.length > 0) {
    const touchEvent = e as TouchEvent
    const touch = touchEvent.touches[0]
    if (touch) {
      clientX = touch.clientX
      clientY = touch.clientY
    } else {
      return
    }
  } else {
    return
  }

  ctx.lineTo((clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo((clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY)
}
function saveCanvas() {
  if (canvasRef.value) {
    preview.value = canvasRef.value.toDataURL('image/png')
    emit('answer', preview.value)
    currentMode.value = 'preview'
  }
}
function clearCanvas() {
  if (canvasRef.value) {
    const ctx = canvasRef.value.getContext('2d')
    if (ctx) {
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)
    }
  }
}

// Camera Logic
const videoRef = ref<HTMLVideoElement | null>(null)
let videoStream: MediaStream | null = null

async function openCamera() {
  currentMode.value = 'camera'
  try {
    videoStream = await navigator.mediaDevices.getUserMedia({ video: true })
    if (videoRef.value) {
      videoRef.value.srcObject = videoStream
    }
  } catch (err) {
    console.error('Failed to access camera', err)
    alert('Gagal mengakses kamera.')
    currentMode.value = 'canvas'
  }
}
function capturePhoto() {
  if (videoRef.value) {
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.value.videoWidth
    canvas.height = videoRef.value.videoHeight
    const ctx = canvas.getContext('2d')
    ctx?.drawImage(videoRef.value, 0, 0)
    preview.value = canvas.toDataURL('image/png')
    emit('answer', preview.value)
    closeCamera()
    currentMode.value = 'preview'
  }
}
function closeCamera() {
  if (videoStream) {
    videoStream.getTracks().forEach((track) => track.stop())
    videoStream = null
  }
}

function resetAnswer() {
  preview.value = null
  emit('answer', '') // clear parent
  currentMode.value = 'canvas'
  setTimeout(initCanvas, 100)
}

function setMode(mode: 'canvas' | 'camera') {
  if (props.readonly) return
  if (mode === 'camera') {
    openCamera()
  } else {
    closeCamera()
    currentMode.value = mode
  }
}

onUnmounted(() => {
  closeCamera()
})
</script>

<template>
  <div class="qu">
    <div class="qu__media-card">
      <div class="qu__media-content">
        <span class="qu__media-label">{{ question.mediaLabel || question.text }}</span>
        <button 
          v-if="['Deret Huruf', 'Kata', 'Kalimat', 'Menyusun Kata'].includes(question.category)"
          class="qu__tts-btn" 
          @click.prevent="ttsService.speak({ text: question.mediaLabel || question.text })"
          title="Dengarkan"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        </button>
      </div>
    </div>

    <div class="qu__layout">
      <!-- Left Toolbar -->
      <div class="qu__toolbar" v-if="!readonly">
        <button
          class="qu__tool-btn"
          :class="{ 'qu__tool-btn--active': currentMode === 'canvas' }"
          @click="setMode('canvas')"
          title="Gambar di Canvas"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 19l7-7 3 3-7 7-3-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="M2 2l7.586 7.586" />
            <circle cx="11" cy="11" r="2" />
          </svg>
        </button>

        <button
          class="qu__tool-btn"
          :class="{ 'qu__tool-btn--active': currentMode === 'camera' }"
          @click="setMode('camera')"
          title="Ambil Foto"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
            />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </button>

        <button class="qu__tool-btn" @click="triggerUpload" title="Upload Gambar">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </button>
        <input
          ref="inputRef"
          type="file"
          accept="image/*"
          class="qu__hidden-input"
          @change="onFileChange"
        />
      </div>

      <!-- Main Workspace -->
      <div class="qu__workspace">
        <!-- Canvas Mode -->
        <div v-show="currentMode === 'canvas'" class="qu__workspace-view">
          <canvas
            ref="canvasRef"
            width="800"
            height="250"
            class="qu__canvas"
            @mousedown="startDrawing"
            @mousemove="draw"
            @mouseup="stopDrawing"
            @mouseleave="stopDrawing"
            @touchstart.prevent="startDrawing"
            @touchmove.prevent="draw"
            @touchend.prevent="stopDrawing"
          ></canvas>
        </div>

        <!-- Camera Mode -->
        <div v-if="currentMode === 'camera'" class="qu__workspace-view">
          <video ref="videoRef" autoplay playsinline class="qu__video"></video>
        </div>

        <!-- Preview Mode -->
        <div v-if="currentMode === 'preview'" class="qu__workspace-view">
          <img :src="preview!" class="qu__preview-img" alt="Jawaban" />
        </div>

        <!-- Actions -->
        <div class="qu__actions" v-if="!readonly">
          <template v-if="currentMode === 'canvas'">
            <button class="qu__action-btn" @click="saveCanvas">
              Simpan Gambar
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
            </button>
            <button class="qu__action-btn" @click="clearCanvas">
              Ulangi Menggambar
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                <path d="M2 2l7.586 7.586" />
              </svg>
            </button>
          </template>

          <template v-else-if="currentMode === 'camera'">
            <button class="qu__action-btn" @click="capturePhoto">
              Ambil Foto
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="13" r="4" />
              </svg>
            </button>
          </template>

          <template v-else-if="currentMode === 'preview'">
            <button class="qu__action-btn" @click="resetAnswer">
              Hapus Gambar
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="3 6 5 6 21 6" />
                <path
                  d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                />
              </svg>
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.qu {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.qu__media-card {
  width: 100%;
  height: 240px;
  background: #fce7f3;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.qu__media-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.qu__tts-btn {
  background: var(--color-white);
  border: 1px solid #FF3366;
  color: #FF3366;
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.qu__tts-btn:hover {
  background: #FFE4E6;
}
.qu__media-label {
  font-size: 4rem;
  font-weight: 800;
  color: #334155;
  text-align: center;
}

.qu__layout {
  display: flex;
  gap: 1rem;
  width: 100%;
}

.qu__toolbar {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.qu__tool-btn {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  border: 1px solid #ff3366;
  background: white;
  color: #ff3366;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.qu__tool-btn--active {
  background: #fce7f3;
  border-color: #ff3366;
}

.qu__hidden-input {
  display: none;
}

.qu__workspace {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  min-width: 0;
}

.qu__workspace-view {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.qu__canvas {
  width: 100%;
  height: 100%;
  object-fit: contain;
  touch-action: none;
  background: white;
  cursor: crosshair;
}

.qu__video,
.qu__preview-img {
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: contain;
  border-radius: 12px;
}

.qu__actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.qu__action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  border: 1px solid #ff3366;
  background: white;
  color: #ff3366;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}
.qu__action-btn:hover {
  background: #fce7f3;
}
</style>
