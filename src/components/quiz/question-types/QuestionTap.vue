<script setup lang="ts">
import type { ScreeningQuestion } from '@/types/screening.types';
import { ttsService } from '@/services/tts.service';
defineProps<{ question: ScreeningQuestion }>()
const emit = defineEmits<{ (e: 'answer', value: string): void }>()
</script>

<template>
  <div class="qt">
    <div class="qt__media-card" @click="emit('answer', question.mediaLabel ?? '')">
      <div class="qt__media-content">
        <span class="qt__media-label">{{ question.mediaLabel || question.text }}</span>
        <button 
          v-if="['Deret Huruf', 'Kata', 'Kalimat', 'Menyusun Kata'].includes(question.category)"
          class="qt__tts-btn" 
          @click.stop.prevent="ttsService.speak({ text: question.mediaLabel || question.text })"
          title="Dengarkan"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        </button>
      </div>
      <span class="qt__tap-hint">
        <!-- hand tap icon -->
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M22 28c2-1 4-4 4-8V14a2 2 0 00-4 0v-4a2 2 0 00-4 0v-2a2 2 0 00-4 0v8l-2-2a2 2 0 00-3 3l5 7h8z"
            stroke="#555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </span>
    </div>

    <!-- optional letter choices (q2 in design) -->
    <div v-if="question.options?.length" class="qt__options">
      <button
        v-for="opt in question.options" :key="opt"
        class="qt__option-btn"
        @click="emit('answer', opt)"
      >{{ opt }}</button>
    </div>
  </div>
</template>

<style scoped>
.qt { display: flex; flex-direction: column; align-items: center; gap: 2rem; width: 100%; max-width: 600px; }
.qt__media-card {
  width: 100%; height: 240px;
  background: #FCE7F3;
  border-radius: 24px;
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  position: relative;
  transition: transform var(--transition-fast);
  padding: 2rem;
}
.qt__media-card:active { transform: scale(0.97); }
.qt__media-label { 
  font-size: calc(4rem * var(--text-scale, 1)); 
  font-weight: 800; 
  color: #334155; 
  text-align: center;
}
.qt__media-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.qt__tts-btn {
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
.qt__tts-btn:hover {
  background: #FFE4E6;
}
.qt__tap-hint { position: absolute; bottom: 24px; right: 24px; opacity: 0.5; }
.qt__options { display: flex; gap: 0.75rem; }
.qt__option-btn {
  width: 56px; height: 56px;
  border-radius: 0.5rem;
  border: 1.5px solid var(--color-border);
  background: var(--color-surface);
  font-size: calc(1.25rem * var(--text-scale, 1)); font-weight: 600;
  color: var(--color-text-dark); cursor: pointer;
  transition: all var(--transition-fast);
}
.qt__option-btn:hover { background: #FFE4E6; border-color: #FF3366; color: #FF3366; }
</style>