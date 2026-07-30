<script setup lang="ts">
import { computed } from 'vue'
import { X } from 'lucide-vue-next'
import type { ChildRecord, Lembaga } from '@/types/child.types'

const props = defineProps<{
  show: boolean
  child: ChildRecord | null
  institution: Lembaga | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function formatDate(iso: string) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

const genderLabel = computed(() => {
  if (props.child?.gender === 'laki_laki') return 'Laki-laki'
  if (props.child?.gender === 'perempuan') return 'Perempuan'
  return '-'
})
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <button class="modal-close" @click="emit('close')">
        <X :size="24" />
      </button>

      <h2 class="modal-title">Detail Data Pengajuan</h2>

      <div class="modal-body">
        <div class="section">
          <div class="section-title">
            <span class="section-icon bg-pink"></span>
            Data Pendaftar
          </div>
          <div class="data-grid">
            <div class="data-row">
              <div class="data-label">Nama Lengkap</div>
              <div class="data-value font-semibold">{{ child?.fullName || '-' }}</div>
            </div>
            <div class="data-row">
              <div class="data-label">Jenis Kelamin</div>
              <div class="data-value font-semibold">{{ genderLabel }}</div>
            </div>
            <div class="data-row">
              <div class="data-label">Tanggal Lahir</div>
              <div class="data-value font-semibold">{{ formatDate(child?.dateOfBirth ?? '') }}</div>
            </div>
          </div>
        </div>

        <div v-if="institution" class="section">
          <div class="section-title">
            <span class="section-icon bg-pink"></span>
            Data Lembaga
          </div>
          <div class="data-grid">
            <div class="data-row">
              <div class="data-label">Nama Lembaga</div>
              <div class="data-value font-semibold">{{ institution.name || '-' }}</div>
            </div>
            <div class="data-row">
              <div class="data-label">Nomor Telepon</div>
              <div class="data-value font-semibold">{{ institution.phone || '-' }}</div>
            </div>
            <div class="data-row">
              <div class="data-label">Alamat</div>
              <div class="data-value font-semibold">{{ institution.address || '-' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  padding: 32px;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.modal-close {
  position: absolute;
  top: 24px;
  right: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.modal-close:hover {
  background: #f5f5f5;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin: 0 0 32px;
}

.section {
  margin-bottom: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
}

.section-icon {
  width: 16px;
  height: 4px;
  border-radius: 2px;
}

.bg-pink {
  background-color: #ff4d8d;
}

.data-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-left: 24px;
}

.data-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 14px;
}

.data-label {
  color: #666;
  flex: 1;
}

.data-value {
  color: #333;
  flex: 1;
  text-align: left;
}

.font-semibold {
  font-weight: 600;
}
</style>
