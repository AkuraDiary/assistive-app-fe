<script setup lang="ts">
const emit = defineEmits<{
  (e: 'add-child'): void
  (e: 'contact-support'): void
}>()
</script>

<template>
  <div class="empty-banner">
    <p class="empty-banner__title">Belum ada data anak</p>
    <p class="empty-banner__subtitle">
      Tambahkan anak untuk mulai memantau status pengajaran dan proses pengajaran
    </p>
    <button class="empty-banner__btn" @click="emit('add-child')">
      <span class="empty-banner__btn-icon">⊕</span>
      TAMBAHKAN
    </button>
    <a class="empty-banner__support" href="#" @click.prevent="emit('contact-support')">
      <span class="empty-banner__support-icon">?</span>
      Butuh bantuan? Hubungi tim layanan pelanggan kami
    </a>
  </div>
</template>

<style scoped>
.empty-banner {
  background: #eef0ff;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-banner__title {
  font-size: calc(18px * var(--text-scale, 1));
  font-weight: 500;
  color: #2d2d2d;
  margin: 0;
}

.empty-banner__subtitle {
  font-size: calc(14px * var(--text-scale, 1));
  color: #7a7a8a;
  margin: 0;
  max-width: 480px;
}

.empty-banner__btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #1a1a1a;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 28px;
  font-size: calc(13px * var(--text-scale, 1));
  font-weight: 700;
  letter-spacing: 0.08em;
  cursor: pointer;
  margin-top: 4px;
  transition:
    background 0.2s,
    transform 0.1s;
}

.empty-banner__btn:hover {
  background: #333;
}
.empty-banner__btn:active {
  transform: scale(0.98);
}

.empty-banner__btn-icon {
  font-size: calc(16px * var(--text-scale, 1));
  line-height: 1;
}

.empty-banner__support {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: calc(13px * var(--text-scale, 1));
  color: #6c6ce0;
  text-decoration: none;
  margin-top: 4px;
  transition: opacity 0.2s;
}
.empty-banner__support:hover {
  opacity: 0.7;
}

.empty-banner__support-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #6c6ce0;
  color: #fff;
  font-size: calc(10px * var(--text-scale, 1));
  font-weight: 700;
  flex-shrink: 0;
}
</style>
