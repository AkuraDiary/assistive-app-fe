<script setup lang="ts">
import { ref } from 'vue'
import type { ScreeningUIState } from '@/types/screening.types'
import type { ChildStatus, ChildRecord } from '@/types/child.types'
import ChildStatusPopup from './ChildStatusPopup.vue'
import ConfirmModal from '../shared/modal/ConfirmModal.vue'
const popupRecord = ref<{ _id: string; applicationStatus: ChildStatus } | null>(null)
const showDeleteConfirm = ref(false)
import type { Lembaga } from '@/types/child.types'

defineProps<{
  records: ChildRecord[]
  institutions: Lembaga[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'lihat-course', id: string): void
  (e: 'lihat-pengajuan', id: string): void
  (e: 'edit', id: string): void
}>()

function formatDate(iso: string) {
  if (!iso) return '-'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

function getInstitutionName(institutions: Lembaga[], institutionId: string | null | undefined) {
  if (!institutionId) return '-'
  const inst = institutions.find((i) => i._id === institutionId)
  return inst ? inst.name : '-'
}

function getGenderLabel(gender: string | undefined) {
  if (gender === 'laki_laki') return 'Laki-laki'
  if (gender === 'perempuan') return 'Perempuan'
  return '-'
}
</script>

<template>
  <div class="ct">
    <div v-if="loading" class="ct__loading">
      <div class="ct__spinner" />
    </div>

    <table v-else class="ct__table">
      <thead>
        <tr class="ct__head-row">
          <th class="ct__th ct__th--name">Nama</th>
          <th class="ct__th">Jenis Kelamin</th>
          <th class="ct__th">Tanggal lahir</th>
          <th class="ct__th">Jenis Terapi</th>
          <th class="ct__th">Nama Lembaga Terapi</th>
          <th class="ct__th text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in records" :key="record._id" class="ct__row">
          <td class="ct__td ct__td--name">
            <span class="font-semibold">{{ record.fullName }}</span>
          </td>
          <td class="ct__td">{{ getGenderLabel(record.gender) }}</td>
          <td class="ct__td">{{ formatDate(record.dateOfBirth ?? '') }}</td>
          <td class="ct__td">
            <span v-if="record.therapyType === 'lembaga_sekolah'" class="badge badge-lembaga"
              >Lembaga</span
            >
            <span v-else class="badge badge-individu">Individu</span>
          </td>
          <td class="ct__td">{{ getInstitutionName(institutions, record.institutionId) }}</td>
          <td class="ct__td">
            <div class="ct__actions">
              <button
                v-if="record.applicationStatus === 'diterima'"
                class="ct__action-btn"
                @click="emit('lihat-course', record._id)"
              >
                Lihat Course
              </button>
              <button v-else class="ct__action-btn" @click="emit('lihat-pengajuan', record._id)">
                Lihat Pengajuan
              </button>
              <button class="ct__action-btn" @click="emit('edit', record._id)">Edit</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.ct {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: visible;
}

.ct__table {
  width: 100%;
  border-collapse: collapse;
  font-size: calc(14px * var(--text-scale, 1));
}

/* Head */
.ct__head-row {
  background: transparent;
  border-bottom: 1px solid #eaeaea;
}

.ct__th {
  padding: 16px 20px;
  text-align: left;
  font-weight: 700;
  font-size: calc(14px * var(--text-scale, 1));
  color: #333;
  overflow: hidden;
}

.ct__th--name {
  padding-left: 24px;
}

/* Rows */
.ct__row {
  border-bottom: 1px solid var(--color-border);
  transition: background var(--transition-fast);
}

.ct__row:last-child {
  border-bottom: none;
}

.ct__row:hover {
  background: var(--color-surface-blue);
}

.ct__td {
  padding: 16px 20px;
  color: var(--color-text-dark);
  vertical-align: middle;
}

/* Name cell */
.ct__td--name {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 24px;
}

.ct__td-screening {
  width: 14%;
}

.ct__actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.ct__action-btn {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid #ff4d8d;
  color: #ff4d8d;
  background: transparent;
  font-size: calc(13px * var(--text-scale, 1));
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.ct__action-btn:hover {
  background: #fce8f0;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: calc(12px * var(--text-scale, 1));
  font-weight: 600;
}

.badge-lembaga {
  background-color: #dbeafe;
  color: #1e40af;
}

.badge-individu {
  background-color: #d1fae5;
  color: #065f46;
}

.font-semibold {
  font-weight: 600;
}

.text-center {
  text-align: center;
}
</style>
