<script setup lang="ts">
import type { ScreeningQuestion } from '@/types/dashboard.types'

defineProps<{ question: ScreeningQuestion }>()
const emit = defineEmits<{ (e: 'answer', value: string): void }>()
</script>

<template>
  <div class="qt">
    <p v-if="question.text" class="qt__prompt">{{ question.text }}</p>

    <button class="qt__media-card" @click="emit('answer', question.mediaLabel ?? '')">
      <span class="qt__media-label">{{ question.mediaLabel }}</span>
      <span class="qt__tap-hint">
        <!-- hand tap icon -->
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M22 28c2-1 4-4 4-8V14a2 2 0 00-4 0v-4a2 2 0 00-4 0v-2a2 2 0 00-4 0v8l-2-2a2 2 0 00-3 3l5 7h8z"
            stroke="#555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </span>
    </button>

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
.qt { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
.qt__prompt { font-size: 1.1em; font-weight: 700; color: var(--color-text-dark); text-align: center; margin: 0; }
.qt__media-card {
  width: 280px; height: 280px;
  background: linear-gradient(135deg, #e8e4f8 0%, #ddf0e8 100%);
  border-radius: 24px;
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  position: relative;
  transition: transform var(--transition-fast);
}
.qt__media-card:active { transform: scale(0.97); }
.qt__media-label { font-size: 1.5em; font-weight: 700; color: var(--color-text-dark); }
.qt__tap-hint { position: absolute; bottom: 16px; right: 16px; opacity: 0.6; }
.qt__audio-btn {
  background: none; border: none; cursor: pointer;
  color: var(--color-text-dark); padding: 0.5rem;
}
.qt__options { display: flex; gap: 0.75rem; }
.qt__option-btn {
  width: 48px; height: 48px;
  border-radius: 50%;
  border: 1.5px solid var(--color-border);
  background: var(--color-surface);
  font-size: 16px; font-weight: 600;
  color: var(--color-text-dark); cursor: pointer;
  transition: all var(--transition-fast);
}
.qt__option-btn:hover { background: var(--color-primary-lighter); border-color: var(--color-primary); }
</style>