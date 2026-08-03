<script setup lang="ts">
import type { ScreeningQuestion } from '@/types/screening.types';



defineProps<{ question: ScreeningQuestion }>()
const emit = defineEmits<{ (e: 'answer', value: string): void }>()
</script>

<template>
  <div class="qt">
    <div class="qt__media-card" @click="emit('answer', question.mediaLabel ?? '')">
      <span class="qt__media-label">{{ question.mediaLabel || question.text }}</span>
      <span class="qt__tap-hint">
        <!-- hand tap icon -->
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M22 28c2-1 4-4 4-8V14a2 2 0 00-4 0v-4a2 2 0 00-4 0v-2a2 2 0 00-4 0v8l-2-2a2 2 0 00-3 3l5 7h8z"
            stroke="#555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </span>
    </div>

    <button class="qt__audio-btn" @click="() => {}">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor"/>
        <path d="M15.5 8.5a5 5 0 010 7M19 6a9 9 0 010 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>

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
  font-size: 4rem; 
  font-weight: 800; 
  color: #334155; 
  text-align: center;
}
.qt__tap-hint { position: absolute; bottom: 24px; right: 24px; opacity: 0.5; }
.qt__audio-btn {
  background: none; border: none; cursor: pointer;
  color: #FF3366; padding: 0.5rem;
}
.qt__options { display: flex; gap: 0.75rem; }
.qt__option-btn {
  width: 56px; height: 56px;
  border-radius: 0.5rem;
  border: 1.5px solid var(--color-border);
  background: var(--color-surface);
  font-size: 1.25rem; font-weight: 600;
  color: var(--color-text-dark); cursor: pointer;
  transition: all var(--transition-fast);
}
.qt__option-btn:hover { background: #FFE4E6; border-color: #FF3366; color: #FF3366; }
</style>