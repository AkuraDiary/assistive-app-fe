<script setup lang="ts">
import { ref } from 'vue'
import type { ChildRecord, ScreeningUIState } from '@/types/dashboard.types'
import type { ChildStatus } from '@/types/dashboard.types'
import ChildStatusPopup from './ChildStatusPopup.vue';
const popupRecord = ref<{ id: string; status: ChildStatus } | null>(null)
defineProps<{
  records: ChildRecord[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'screening-action', id: string, action: ScreeningUIState): void
  (e: 'status-action', id: string, status: ChildStatus): void
}>()

const openDropdown = ref<string | null>(null)

function toggleDropdown(id: string) {
  openDropdown.value = openDropdown.value === id ? null : id
}

function selectScreening(id: string, action: ScreeningUIState) {
  openDropdown.value = null
  emit('screening-action', id, action)
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

const statusLabel: Record<string, string> = {
  menunggu: 'Menunggu',
  diterima: 'Diterima',
  ditolak: 'Ditolak',
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
          <th class="ct__th">Tanggal</th>
          <th class="ct__th">Lembaga</th>
          <th class="ct__th">Status</th>
          <th class="ct__th">Screening ↓</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in records" :key="record.id" class="ct__row">
          <td class="ct__td ct__td--name">
            <div class="ct__avatar">
              <img v-if="record.avatar" :src="record.avatar" :alt="record.name" />
              <svg v-else width="28" height="28" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" stroke="#c4b5e8" stroke-width="1.5" />
                <circle cx="16" cy="13" r="5" stroke="#c4b5e8" stroke-width="1.5" />
                <path
                  d="M6 27c1.5-4 5-6 10-6s8.5 2 10 6"
                  stroke="#c4b5e8"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </div>
            {{ record.name }}
            
          </td>
          <td class="ct__td">{{ formatDate(record.tanggal ?? '') }}</td>
          <td class="ct__td">{{ record.lembaga }}</td>
          <td
            class="ct__td"
            style="cursor: pointer"
            @click="popupRecord = { id: record.id, status: record.status }"
          >
            <span class="ct__status" :class="`ct__status--${record.status}`">
              {{ statusLabel[record.status] }}
            </span>
          </td>
          <td class="ct__td ct__td-screening">
            <!-- Disabled -->
            <button
              v-if="record.screeningAction === 'disable'"
              class="ct__btn ct__btn--disable"
              disabled
            >
              Disabled
            </button>

            <!-- Lihat Hasil (done) -->
            <button
              v-else-if="record.screeningAction === 'lihat_hasil'"
              class="ct__btn ct__btn--filled"
              @click="selectScreening(record.id, 'lihat_hasil')"
            >
              Lihat Hasil
            </button>

            <!-- Dropdown: Orang Tua / Anak -->

            <div v-else class="ct__dropdown-wrap">
              <button class="ct__btn ct__btn--filled" @click="toggleDropdown(record.id)">
                {{ record.screeningAction === 'orang_tua' ? 'Orang Tua' : 'Anak' }}
                <span class="ct__chevron">▾</span>
              </button>
              <div v-if="openDropdown === record.id" class="ct__dropdown">
                <button class="ct__dropdown-item" @click="selectScreening(record.id, 'orang_tua')">
                  Orang Tua
                </button>
                <button class="ct__dropdown-item" @click="selectScreening(record.id, 'anak')">
                  Anak
                </button>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <Transition name="fade">
      <ChildStatusPopup
        v-if="popupRecord"
        :status="popupRecord.status"
         @action="$emit('status-action', popupRecord!.id, popupRecord!.status); popupRecord = null"
        @back="popupRecord = null"
      />
    </Transition>
  </div>
</template>

<style scoped>


.ct {
  background: var(--color-surface);
border-radius: var(--radius-lg);
box-shadow: var(--shadow-md);
  
  overflow: hidden;
  
}

.ct__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

/* Head */
.ct__head-row {
  background: var(--color-primary-lighter);
}

.ct__th {
  padding: 16px 20px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: var(--color-text-dark);
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
  background: var(--color-primary-muted);
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

.ct__avatar {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.ct__avatar img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.ct__td-screening{
  width: 20%;  
}

/* Status badges */
.ct__status {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
}

.ct__status--menunggu {
  background:var(--color-info-light);
  color: var(--color-info);
}
.ct__status--diterima {
  background: var(--color-success-light);
  color: var(--color-success);
}
.ct__status--ditolak {
  color: var(--color-error);
background: var(--color-error-light);
}

/* Buttons */
.ct__btn {
  padding: 6px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  border-color: var(--color-border);
  border: 1.5px solid;
  color: var(--color-text-light);
  border-color: var(--color-border);
  background: transparent;
}

.ct__btn--disable {
  color: var(--color-text-light);
border-color: var(--color-border);
  cursor: not-allowed;
}

.ct__btn--filled {
  background: var(--color-primary);
border-color: var(--color-primary);
  color: #fff;
  
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.ct__btn--filled:hover {
  background: var(--color-primary-light);
border-color: var(--color-primary-light);
}

.ct__chevron {
  font-size: 10px;
}

/* Dropdown */
.ct__dropdown-wrap {
  position: relative;
  display: inline-block;
}

.ct__dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  background: var(--color-surface);
border-color: var(--color-primary);
box-shadow: var(--shadow-md);
  border: 1.5px solid;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  z-index: 10;
  min-width: 120px;
  overflow: hidden;
}

.ct__dropdown-item {
  display: block;
  width: 100%;
  padding: 9px 14px;
  text-align: left;
  background: transparent;
  border: none;
  font-size: 13px;
  color: var(--color-text-dark);
  cursor: pointer;
  transition: background 0.15s;
}

.ct__dropdown-item:hover {
  color: var(--color-primary);
background: #f0ebff;
}

/* Loading */
.ct__loading {
  display: flex;
  justify-content: center;
  padding: 3rem;
}

.ct__spinner {
  width: 24px;
  height: 24px;
  border-top-color: var(--color-primary);
border-color: #ede8fa; 
  border: 2px solid;
  
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
</style>
