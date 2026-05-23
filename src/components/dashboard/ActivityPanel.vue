<script setup lang="ts">
import type { ActivityEntry } from '@/types/dashboard.types'

defineProps<{
  activities: ActivityEntry[]
  loading?: boolean
}>()
</script>

<template>
  <div class="activity-panel">
    <div class="activity-panel__header">
      <span class="activity-panel__icon">≡</span>
      <h2 class="activity-panel__title">Aktifitas Belajar</h2>
    </div>

    <div class="activity-panel__body">
      <div v-if="loading" class="activity-panel__state">
        <div class="activity-panel__spinner" />
      </div>

      <div v-else-if="activities.length === 0" class="activity-panel__state">
        <p class="activity-panel__empty-text">Belum ada aktifitas</p>
      </div>

      <ul v-else class="activity-panel__list">
        <li
          v-for="entry in activities"
          :key="entry.id"
          class="activity-panel__item"
        >
          <div class="activity-panel__item-dot" />
          <div class="activity-panel__item-content">
            <span class="activity-panel__item-topic">{{ entry.topic }}</span>
            <span class="activity-panel__item-meta">
              {{ entry.durationMinutes }} menit
              <template v-if="entry.score != null"> · {{ entry.score }}/100</template>
            </span>
          </div>
          <span class="activity-panel__item-date">
            {{ new Date(entry.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.activity-panel {
  background: #FFF0F5;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  min-height: 320px;
  flex: 1;
}

.activity-panel__header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1.25rem;
}

.activity-panel__icon {
  font-size: 20px;
  color: #2d2d2d;
}

.activity-panel__title {
  font-size: 18px;
  font-weight: 600;
  color: #2d2d2d;
  margin: 0;
}

.activity-panel__body {
  flex: 1;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
}

.activity-panel__state {
  height: 100%;
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-panel__empty-text {
  font-size: 14px;
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

@keyframes spin { to { transform: rotate(360deg); } }

.activity-panel__list {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
}

.activity-panel__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 1rem;
  border-bottom: 1px solid #faf0f4;
  transition: background 0.15s;
}
.activity-panel__item:last-child { border-bottom: none; }
.activity-panel__item:hover { background: #fdf5f8; }

.activity-panel__item-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #D4537E;
  flex-shrink: 0;
}

.activity-panel__item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.activity-panel__item-topic {
  font-size: 14px;
  font-weight: 500;
  color: #2d2d2d;
}

.activity-panel__item-meta {
  font-size: 12px;
  color: #9a8a90;
}

.activity-panel__item-date {
  font-size: 12px;
  color: #b0a0a8;
  flex-shrink: 0;
}
</style>
