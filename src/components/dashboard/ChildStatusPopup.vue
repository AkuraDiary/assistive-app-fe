<script setup lang="ts">
import type { ChildStatus } from '@/types/dashboard.types'

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

      <button class="popup__action-btn" @click="emit('action')">
        {{ status === 'diterima' ? 'Kerjakan' : 'Data Anak' }}
      </button>

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
  background: #fff;
  border-radius: 24px;
  border: 3px solid #8b73f6;
  width: 320px;
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  text-align: center;
}

.popup__message {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.4;
  margin: 0;
}

.popup__notice {
  width: 100%;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
}

.popup__notice--diterima {
  background: #e6f9f0;
  color: #1e9e5e;
}

.popup__notice--ditolak {
  background: #fde8e8;
  color: #e05c5c;
}

.popup__action-btn {
  background: #7c5ccc;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 12px 48px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.popup__action-btn:hover {
  background: #6a4db8;
}

.popup__back-btn {
  background: transparent;
  border: none;
  color: #7c5ccc;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
