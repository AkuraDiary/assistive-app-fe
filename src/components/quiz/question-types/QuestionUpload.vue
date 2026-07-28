<script setup lang="ts">
import type { ScreeningQuestion } from '@/types/screening.types';
import { ref } from 'vue'


defineProps<{ question: ScreeningQuestion }>()
const emit = defineEmits<{ (e: 'answer', value: string): void }>()

const preview = ref<string | null>(null)

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    preview.value = ev.target?.result as string
    emit('answer', preview.value)
  }
  reader.readAsDataURL(file)
}

const inputRef = ref<HTMLInputElement>()
</script>

<template>
  <div class="qu">
    <p class="qu__prompt">{{ question.text }}</p>

    <div class="qu__media-card">
      <img v-if="preview" :src="preview" class="qu__preview" alt="upload preview" />
      <span v-else class="qu__media-label">{{ question.mediaLabel }}</span>
    </div>

    <input
      ref="inputRef"
      type="file"
      accept="image/*"
      class="qu__file-input"
      @change="onFileChange"
    />
    <button class="qu__upload-btn" @click="inputRef?.click()">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 16V4m0 0L8 8m4-4l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4 20h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      Unggah Disini
    </button>
  </div>
</template>

<style scoped>
.qu { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
.qu__prompt { font-size: 1em; font-weight: 700; color: var(--color-text-dark); text-align: center; margin: 0; max-width: 320px; }
.qu__media-card {
  width: 280px; height: 280px;
  background: linear-gradient(135deg, #e8e4f8 0%, #ddf0e8 100%);
  border-radius: 24px;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.qu__media-label { font-size: 1.5em; font-weight: 700; color: var(--color-text-dark); }
.qu__preview { width: 100%; height: 100%; object-fit: cover; }
.qu__file-input { display: none; }
.qu__upload-btn {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.875rem 2rem;
  border-radius: var(--radius-full);
  border: 1.5px solid var(--color-primary-lighter);
  background: var(--color-surface);
  font-size: 14px; font-weight: 600;
  color: var(--color-text-dark); cursor: pointer;
  min-width: 280px; justify-content: center;
  transition: all var(--transition-fast);
}
.qu__upload-btn:hover { background: var(--color-primary-lighter); }
</style>