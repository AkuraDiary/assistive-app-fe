<script setup lang="ts">


defineProps<{
  show: boolean
  application: any // Will use appropriate type
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'accept', id: string): void
  (e: 'reject', id: string): void
}>()
</script>

<template>
  <div v-if="show" class="popup-overlay" @click.self="emit('close')">
    <div class="popup">
      <div class="popup__header">
        <h2 class="popup__title">Detail Data Pengajuan</h2>
        <button class="popup__close" @click="emit('close')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="popup__content">
        <div class="popup__section">
          <h3 class="popup__section-title">Data Pendaftar</h3>
          <div class="popup__grid">
            <span class="popup__label">Nama Lengkap</span>
            <span class="popup__value">{{ application?.name || 'Budiman' }}</span>
            
            <span class="popup__label">Jenis Kelamin</span>
            <span class="popup__value">{{ application?.gender || 'Laki-laki' }}</span>
            
            <span class="popup__label">Tanggal Lahir</span>
            <span class="popup__value">{{ application?.dob || '20 Mei 2016' }}</span>
          </div>
        </div>

        <div class="popup__section">
          <h3 class="popup__section-title">Data Wali</h3>
          <div class="popup__grid">
            <span class="popup__label">Nama Lengkap</span>
            <span class="popup__value">{{ application?.parentName || 'Debby' }}</span>
            
            <span class="popup__label">Nomor Telepon</span>
            <span class="popup__value">{{ application?.parentPhone || '+628123456' }}</span>
            
            <span class="popup__label">Alamat</span>
            <span class="popup__value">{{ application?.parentAddress || 'Jl. Pengasaan Timur' }}</span>
          </div>
        </div>
      </div>

      <div class="popup__actions">
        <button class="btn-primary" @click="emit('accept', application?.id)">
          Terima Pengajuan
        </button>
        <button class="btn-outline" @click="emit('reject', application?.id)">
          Tolak Pengajuan
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.popup {
  background: #ffffff;
  border-radius: 24px;
  width: 90%;
  max-width: 500px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.popup__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.popup__title {
  font-size: calc(24px * var(--text-scale, 1));
  font-weight: 700;
  color: #2d2d2d;
  margin: 0;
}

.popup__close {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.popup__close:hover {
  color: #2d2d2d;
}

.popup__content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.popup__section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.popup__section-title {
  font-size: calc(16px * var(--text-scale, 1));
  font-weight: 700;
  color: #2d2d2d;
  margin: 0;
}

.popup__grid {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 16px 24px;
  align-items: center;
}

.popup__label {
  font-size: calc(14px * var(--text-scale, 1));
  font-weight: 600;
  color: #2d2d2d;
}

.popup__value {
  font-size: calc(14px * var(--text-scale, 1));
  color: #666;
  text-align: right;
}

.popup__actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: #ff4d8d;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: calc(15px * var(--text-scale, 1));
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background: #e63e7a;
}

.btn-outline {
  width: 100%;
  padding: 12px;
  background: white;
  color: #ff4d8d;
  border: 1px solid #ff4d8d;
  border-radius: 12px;
  font-size: calc(15px * var(--text-scale, 1));
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover {
  background: #fce8f0;
}
</style>
