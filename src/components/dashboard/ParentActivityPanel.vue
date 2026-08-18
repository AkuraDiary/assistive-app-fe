<script setup lang="ts">
import type { ActivityEntry, ActivityStatus } from '@/types/activity.types'

defineProps<{
  activities: ActivityEntry[]
  loading?: boolean
}>()

const statusConfig: Record<ActivityStatus, { label: string; class: string }> = {
  belum: { label: 'Belum', class: 'badge--belum' },
  dipelajari: { label: 'Dipelajari', class: 'badge--dipelajari' },
  selesai: { label: 'Selesai', class: 'badge--selesai' },
}

const actionLabel: Record<ActivityStatus, string> = {
  belum: 'Mulai',
  dipelajari: 'Lanjutkan Modul',
  selesai: 'Lihat Modul',
}

const datePrefix: Record<ActivityStatus, string> = {
  belum: 'Selesai',
  dipelajari: 'Mulai',
  selesai: 'Selesai',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>
<template>
  <div class="activity-panel">
    <div class="activity-panel__header">
      <span class="activity-panel__icon">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2d2d2d"
          stroke-width="2.5"
          stroke-linecap="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </span>
      <h2 class="activity-panel__title">Aktifitas Belajar</h2>
    </div>

    <div v-if="loading" class="activity-panel__state">
      <div class="activity-panel__spinner" />
    </div>

    <div v-else-if="activities.length === 0" class="activity-panel__state">
      <p class="activity-panel__empty-text">Belum ada aktifitas</p>
    </div>

    <ul v-else class="activity-panel__list">
      <li v-for="entry in activities" :key="entry.id" class="activity-panel__item">
        <span class="activity-panel__badge" :class="statusConfig[entry.status].class">
          {{ statusConfig[entry.status].label }}
        </span>
        <div class="activity-panel__item-title">{{ entry.topic }}</div>
        <div class="activity-panel__progress-row">
          <div class="activity-panel__progress-bar">
            <div
              class="activity-panel__progress-fill"
              :class="`progress--${entry.status}`"
              :style="{ width: `${entry.progress}%` }"
            />
          </div>
          <span class="activity-panel__progress-pct">{{ entry.progress }}%</span>
        </div>
        <div class="activity-panel__item-footer">
          <span class="activity-panel__item-date">
            {{ datePrefix[entry.status] }}: {{ formatDate(entry.date) }}
          </span>
          <button class="activity-panel__action">
            {{ actionLabel[entry.status] }}
            <span>&#9654;</span>
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.activity-panel {
  background: #fff0f5;
  border-radius: 16px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-height: 320px;
  height: 600px;
  flex: 1;
}

.activity-panel__header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 1rem 1rem 0rem 1rem;
}

.activity-panel__title {
  font-size: calc(18px * var(--text-scale, 1));
  font-weight: 600;
  color: #2d2d2d;
  margin: 0;
}

.activity-panel__list {
  background-color: white;
  list-style: none;
  margin: 0;
  padding: 10px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  flex: 1;
}
.activity-panel__list::-webkit-scrollbar {
  display: none;
}

.activity-panel__item {
  background: #fff;
  border: solid;
  border-width: 0.5px;
  border-color: var(--color-primary-light);
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Status badges */
.activity-panel__badge {
  display: inline-block;
  padding: 3px 12px;
  border-radius: 999px;
  font-size: calc(12px * var(--text-scale, 1));
  font-weight: 500;
  align-self: flex-start;
}
.badge--belum {
  background: #ede0ff;
  color: #7c3aed;
}
.badge--dipelajari {
  background: #dbeafe;
  color: #2563eb;
}
.badge--selesai {
  background: #dcfce7;
  color: #16a34a;
}

.activity-panel__item-title {
  font-size: calc(15px * var(--text-scale, 1));
  font-weight: 600;
  color: #1a1a1a;
}

/* Progress */
.activity-panel__progress-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.activity-panel__progress-bar {
  flex: 1;
  height: 8px;
  background: #e8e8e8;
  border-radius: 999px;
  overflow: hidden;
}
.activity-panel__progress-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.5s ease;
}
.progress--belum {
  background: #e88a9a;
}
.progress--dipelajari {
  background: #e88a9a;
}
.progress--selesai {
  background: #22c55e;
}

.activity-panel__progress-pct {
  font-size: calc(15px * var(--text-scale, 1));
  font-weight: 600;
  color: #1a1a1a;
  white-space: nowrap;
}

/* Footer row */
.activity-panel__item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2px;
}
.activity-panel__item-date {
  font-size: calc(13px * var(--text-scale, 1));
  color: #888;
}
.activity-panel__action {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f9d8e8;
  border: none;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: calc(13px * var(--text-scale, 1));
  font-weight: 500;
  color: #1a1a1a;
  cursor: pointer;
  transition: background 0.2s;
}
.activity-panel__action:hover {
  background: #f5bcd8;
}

/* States */
.activity-panel__state {
  flex: 1;
  background: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.activity-panel__empty-text {
  font-size: calc(14px * var(--text-scale, 1));
  color: #aaa;
  margin: 0;
}
.activity-panel__spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #f0e0ea;
  border-top-color: #d4537e;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
