<script setup lang="ts">
defineProps<{
  message: string
  confirmLabel?: string
  cancelLabel?: string
  confirmColor?: 'primary' | 'secondary' | 'ternary' | 'warning' | 'info' | 'success' | 'error'
  cancelColor?: 'primary' | 'secondary' | 'ternary' | 'warning' | 'info' | 'success' | 'error'
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <div class="popup-overlay" @click.self="emit('cancel')">
    <div class="popup">
      <p class="popup__message">{{ message }}</p>
      <div class="popup__actions">
        <BaseButton :color="confirmColor ?? 'ternary'" size="lg" @click="emit('confirm')">
          {{ confirmLabel ?? 'IYA' }}
        </BaseButton>
        <BaseButton :color="cancelColor ?? 'secondary'" size="lg" @click="emit('cancel')">
          {{ cancelLabel ?? 'TIDAK' }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* reuse exact same tokens as ChildStatusPopup */
.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.popup {
  background: var(--color-surface);
  border: 3px solid var(--color-primary);
  border-radius: var(--radius-2xl);
  width: 320px;
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  text-align: center;
}

.popup__message {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-dark);
  line-height: 1.4;
  margin: 0;
}

.popup__actions {
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: center;
}
</style>
