<script setup lang="ts">
import { Clock } from 'lucide-vue-next'
import type { RecentActivity } from '@/mocks/dashboard.mock'

defineProps<{
  activities: RecentActivity[]
}>()

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
  <div class="recent-activity">
    <div class="recent-activity__header">
      <span class="recent-activity__icon-container">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ff4d8d"
          stroke-width="2.5"
          stroke-linecap="round"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      </span>
      <h2 class="recent-activity__title">Aktivitas Terbaru</h2>
    </div>

    <div v-if="activities.length === 0" class="recent-activity__state">
      <p class="recent-activity__empty-text">Belum ada aktivitas</p>
    </div>

    <ul v-else class="recent-activity__list">
      <li v-for="entry in activities" :key="entry.id" class="recent-activity__item">
        <div class="recent-activity__time-group">
          <Clock class="w-3.5 h-3.5 text-gray-400" />
          <span class="recent-activity__time-text">{{ formatRelativeTime(entry.date) }}</span>
        </div>
        <div class="recent-activity__content">
          <span class="recent-activity__bold">{{ entry.title }}</span>
          <span class="recent-activity__separator">|</span>
          <span class="recent-activity__desc">{{ entry.description }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.recent-activity {
  background: transparent;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  flex: 1;
}

.recent-activity__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.recent-activity__title {
  font-size: 22px;
  font-weight: 700;
  color: #ff4d8d;
  margin: 0;
}

.recent-activity__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.recent-activity__item {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}

.recent-activity__time-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.recent-activity__time-text {
  font-size: 12px;
  color: #888;
}

.recent-activity__content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.recent-activity__bold {
  font-size: 15px;
  font-weight: 700;
  color: #2d2d2d;
}

.recent-activity__separator {
  color: #d1d5db;
}

.recent-activity__desc {
  font-size: 14px;
  color: #4b5563;
}

.recent-activity__state {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 150px;
}

.recent-activity__empty-text {
  font-size: 14px;
  color: #aaa;
  margin: 0;
}
</style>
