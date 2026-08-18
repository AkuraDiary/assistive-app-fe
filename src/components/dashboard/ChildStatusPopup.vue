<script setup lang="ts">
import type { ChildStatus } from '@/types/child.types';



defineProps<{
  status: ChildStatus
}>()

const emit = defineEmits<{
  (e: 'action'): void
  (e: 'back'): void
}>()
</script>

<template>
  <div class="popup-overlay" @click.self="emit('back')">
    <div class="popup">
      <p class="popup__message">
        {{
          status === 'diterima'
            ? 'Pihak lembaga yang bersangkutan menerima pendaftaran anak Anda!'
            : 'Pihak lembaga yang bersangkutan menolak pendaftaran anak Anda.'
        }}
      </p>

      <div class="popup__notice" :class="`popup__notice--${status}`">
        {{
          status === 'diterima'
            ? 'Harap Lanjut untuk Mengisi Form'
            : 'Harap Periksa Kembali Data Anak Anda'
        }}
      </div>

      <BaseButton color="ternary" size="lg" full-width @click="emit('action')">
        {{ status === 'diterima' ? 'Kerjakan' : 'Data Anak' }}
      </BaseButton>
      <button class="popup__back-btn" @click="emit('back')">← Kembali</button>
    </div>
  </div>
</template>

<style scoped>
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
  border-color: var(--color-primary);
  border-radius: var(--radius-2xl);
  border: 3px solid var(--color-primary);
  width: 320px;
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  text-align: center;
}

.popup__message {
  font-size: calc(22px * var(--text-scale, 1));
  font-weight: 700;
  color: var(--color-text-dark);

  line-height: 1.4;
  margin: 0;
}

.popup__notice {
  width: 100%;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  font-size: calc(13px * var(--text-scale, 1));
  font-weight: 500;
  text-align: center;
}

.popup__notice--diterima {
  background: var(--color-success-light);
  color: var(--color-success);
}

.popup__notice--ditolak {
  background: var(--color-error-light);
  color: var(--color-error);
}

.popup__back-btn {
  background: transparent;
  border: none;
  color: var(--color-primary);
  font-size: calc(14px * var(--text-scale, 1));
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
