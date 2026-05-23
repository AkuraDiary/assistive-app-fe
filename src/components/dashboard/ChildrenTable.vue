<script setup lang="ts">
import type { ChildRecord, ScreeningAction } from '@/types/dashboard.types'

defineProps<{
  records: ChildRecord[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'screening-action', id: string, action: ScreeningAction): void
}>()

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

const statusLabel: Record<string, string> = {
  menunggu: 'Menunggu',
  diterima: 'Diterima',
  ditolak: 'Ditolak',
}

const actionLabel: Record<string, string> = {
  disable: 'Disable',
  orang_tua: 'Orang Tua',
  lihat_hasil: 'Lihat Hasil',
}
</script>

<template>
  <div class="children-table">
    <div v-if="loading" class="children-table__loading">
      <div class="children-table__spinner" />
    </div>

    <table v-else class="children-table__table">
      <thead>
        <tr>
          <th>Nama</th>
          <th>Tanggal</th>
          <th>Lembaga</th>
          <th>Status</th>
          <th class="children-table__th--screening">
            Screening <span class="children-table__sort">↓</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in records" :key="record.id" class="children-table__row">
          <td class="children-table__name-cell">
            <div class="children-table__avatar">
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
          <td>{{ formatDate(record.tanggal ?? '') }}</td>
          <td>{{ record.lembaga }}</td>
          <td>
            <span
              class="children-table__status"
              :class="`children-table__status--${record.status}`"
            >
              {{ statusLabel[record.status] }}
            </span>
          </td>
          <td>
            <button
              class="children-table__action"
              :class="`children-table__action--${record.screeningAction}`"
              :disabled="record.screeningAction === 'disable'"
              @click="emit('screening-action', record.id, record.screeningAction)"
            >
              {{ actionLabel[record.screeningAction] }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.children-table {
  background: #fff;
  border-radius: 16px;
  padding: 0.5rem 1.5rem 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.children-table__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

thead tr {
  background: #eee8fb;
}

th {
  padding: 14px 16px;
  text-align: left;
  font-weight: 600;
  color: #2d2d2d;
  font-size: 14px;
}

.children-table__th--screening {
  display: flex;
  align-items: center;
  gap: 4px;
}

.children-table__sort {
  font-size: 12px;
  color: #888;
}

.children-table__row td {
  padding: 14px 16px;
  border-bottom: 1px solid #f3f0fa;
  color: #2d2d2d;
  vertical-align: middle;
}

.children-table__row:last-child td {
  border-bottom: none;
}

.children-table__name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.children-table__avatar {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

.children-table__avatar img {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

/* Status badges */
.children-table__status {
  display: inline-block;
  padding: 3px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
}

.children-table__status--menunggu {
  background: #e8f0fe;
  color: #5b8dee;
}

.children-table__status--diterima {
  background: #e6f9f0;
  color: #27ae60;
}

.children-table__status--ditolak {
  background: #fdecea;
  color: #e05c5c;
}

/* Action buttons */
.children-table__action {
  padding: 5px 14px;
  border-radius: 8px;
  border: 1.5px solid #d0c8e8;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  transition: all 0.15s;
}

.children-table__action--disable {
  color: #aaa;
  border-color: #ddd;
  cursor: not-allowed;
}

.children-table__action--orang_tua,
.children-table__action--lihat_hasil {
  background: #ede8fa;
  color: #7c5ccc;
  border-color: #d4c8f0;
}

.children-table__action--orang_tua:hover,
.children-table__action--lihat_hasil:hover {
  background: #7c5ccc;
  color: #fff;
}

/* Loading */
.children-table__loading {
  display: flex;
  justify-content: center;
  padding: 3rem;
}

.children-table__spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #ede8fa;
  border-top-color: #7c5ccc;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
