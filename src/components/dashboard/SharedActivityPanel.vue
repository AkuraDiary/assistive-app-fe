<script setup lang="ts">
import { Clock, Play } from 'lucide-vue-next'
import type { ActivityEntry } from '@/types/activity.types'

defineProps<{
  activities: ActivityEntry[]
  loading?: boolean
}>()

// Figma uses relative time formatting, we can mock it here for simplicity
function formatRelativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 60) return `${diffMins} Menit lalu`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} Jam lalu`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} Hari lalu`
}
</script>

<template>
  <div class="shared-activity">
    <div class="shared-activity__header">
      <span class="shared-activity__icon-container">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ff4d8d"
          stroke-width="2.5"
          stroke-linecap="round"
        >
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      </span>
      <h2 class="shared-activity__title">Aktivitas Belajar</h2>
    </div>

    <div v-if="loading" class="shared-activity__state">
      <div class="shared-activity__spinner" />
    </div>

    <div v-else-if="activities.length === 0" class="shared-activity__state">
      <p class="shared-activity__empty-text">Belum ada aktifitas</p>
    </div>

    <ul v-else class="shared-activity__list">
      <li v-for="entry in activities" :key="entry.id" class="shared-activity__item">
        <!-- Top Row: Status dot & time -->
        <div class="shared-activity__item-top">
          <div class="shared-activity__status-group">
            <span class="shared-activity__dot" />
            <span class="shared-activity__status-text">Dipelajari</span>
          </div>
          <div class="shared-activity__time-group">
            <Clock class="w-3.5 h-3.5 text-gray-400" />
            <span class="shared-activity__time-text">{{ formatRelativeTime(entry.date) }}</span>
          </div>
        </div>

        <!-- Middle Row: Title -->
        <div class="shared-activity__item-title">{{ entry.topic }}</div>

        <!-- Bottom Row: Progress -->
        <div class="shared-activity__item-bottom">
          <span class="shared-activity__progress-pct">{{ entry.progress }}%</span>
          <div class="shared-activity__progress-bar">
            <div
              class="shared-activity__progress-fill"
              :style="{ width: `${entry.progress}%` }"
            />
          </div>
          <button class="shared-activity__action-btn">
            Lanjutkan Modul <span class="ml-1">></span>
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.shared-activity {
  background: transparent;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  flex: 1;
}

.shared-activity__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.shared-activity__title {
  font-size: 22px;
  font-weight: 700;
  color: #ff4d8d;
  margin: 0;
}

.shared-activity__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.shared-activity__item {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}

.shared-activity__item-top {
  display: flex;
  align-items: center;
  gap: 16px;
}

.shared-activity__status-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.shared-activity__dot {
  width: 6px;
  height: 6px;
  background: #3b82f6;
  border-radius: 50%;
}

.shared-activity__status-text {
  font-size: 13px;
  font-weight: 600;
  color: #3b82f6;
}

.shared-activity__time-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.shared-activity__time-text {
  font-size: 12px;
  color: #888;
}

.shared-activity__item-title {
  font-size: 16px;
  font-weight: 700;
  color: #2d2d2d;
}

.shared-activity__item-bottom {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 4px;
}

.shared-activity__progress-pct {
  font-size: 14px;
  font-weight: 600;
  color: #2d2d2d;
  min-width: 32px;
}

.shared-activity__progress-bar {
  flex: 1;
  height: 8px;
  background: #fce8f0;
  border-radius: 999px;
  overflow: hidden;
}

.shared-activity__progress-fill {
  height: 100%;
  background: #ff4d8d;
  border-radius: 999px;
  transition: width 0.5s ease;
}

.shared-activity__action-btn {
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 500;
  color: #888;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.2s;
}

.shared-activity__action-btn:hover {
  color: #2d2d2d;
}

/* States */
.shared-activity__state {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.shared-activity__empty-text {
  font-size: 14px;
  color: #aaa;
  margin: 0;
}

.shared-activity__spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #fce8f0;
  border-top-color: #ff4d8d;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
