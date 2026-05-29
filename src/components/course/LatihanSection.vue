<script setup lang="ts">
import { ref } from 'vue'
import type { Modul } from '@/types/course.types'

defineProps<{
  modul: Modul
}>()

const expandedId = ref<string | null>(null)

function toggle(id: string) {
  expandedId.value = expandedId.value === id ? null : id
}
const emit = defineEmits<{
  (e: 'open-materi', latihanId: string): void
}>()

function formatDate(iso?: string) {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="ls">
    <!-- Section header -->
    <div class="ls__header">
      <div class="ls__title-row">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
        <span class="ls__title">Latihan</span>
      </div>
      <p class="ls__desc">{{ modul.description ?? '-' }}</p>
    </div>

    <!-- Latihan list -->
    <div class="ls__list">
      <div
        v-for="item in modul.latihan"
        :key="item.id"
        class="ls__item"
        :class="{ 'ls__item--expanded': expandedId === item.id }"
      >
        <!-- Row -->
        <div class="ls__row" @click="toggle(item.id)">
          <span class="ls__item-title">{{ item.title }}</span>
          <div class="ls__row-right">
            <span class="ls__item-pct">{{ item.progress }} %</span>
            <svg
              class="ls__chevron"
              :class="{ 'ls__chevron--up': expandedId === item.id }"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>

        <!-- Expanded content -->
        <Transition name="ls-expand">
          <div v-if="expandedId === item.id" class="ls__expanded">
            <div class="ls__expanded-inner">
              <p class="ls__expanded-label">Content</p>
              <p class="ls__expanded-desc">{{ item.description ?? '-' }}</p>

              <div class="ls__expanded-meta">
                <span class="ls__expanded-date">
                  Dikerjakan: {{ formatDate(item.tanggalDikerjakan) }}
                </span>
                <span class="ls__expanded-pct">{{ item.progress }}%</span>
              </div>

              <div class="ls__expanded-track">
                <div class="ls__expanded-fill" :style="{ width: `${item.progress}%` }" />
              </div>

              <div class="ls__expanded-actions">
                <button class="ls__btn ls__btn--outline" @click="emit('open-materi', item.id)">
                  Materi latihan
                </button>
                <button class="ls__btn ls__btn--primary">Latihan Mengerjakan</button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ls {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Header */
.ls__header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.ls__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-dark);
}
.ls__title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-dark);
}
.ls__desc {
  font-size: 13px;
  color: var(--color-text-light);
  margin: 0;
}

/* List */
.ls__list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.ls__item {
  border-top: 1px solid var(--color-border);
}
.ls__item:last-child {
  border-bottom: 1px solid var(--color-border);
}

/* Row */
.ls__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  cursor: pointer;
  user-select: none;
}
.ls__row-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.ls__item-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-dark);
}
.ls__item-pct {
  font-size: 13px;
  color: var(--color-text-light);
}
.ls__chevron {
  transition: transform 0.2s;
  color: var(--color-text-light);
}
.ls__chevron--up {
  transform: rotate(180deg);
}

/* Expanded */
.ls__expanded-inner {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 16px;
}
.ls__expanded-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-dark);
  margin: 0;
}
.ls__expanded-desc {
  font-size: 13px;
  color: var(--color-text-light);
  margin: 0;
  line-height: 1.5;
}
.ls__expanded-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ls__expanded-date {
  font-size: 12px;
  color: var(--color-text-light);
}
.ls__expanded-pct {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-dark);
}
.ls__expanded-track {
  height: 8px;
  background: var(--color-border);
  border-radius: 999px;
  overflow: hidden;
}
.ls__expanded-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 999px;
  transition: width 0.4s ease;
}

/* Action buttons */
.ls__expanded-actions {
  display: flex;
  gap: 12px;
  margin-top: 4px;
}
.ls__btn {
  flex: 1;
  padding: 10px 0;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.ls__btn--outline {
  background: transparent;
  border: 1.5px solid var(--color-border);
  color: var(--color-text-dark);
}
.ls__btn--outline:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.ls__btn--primary {
  background: var(--color-primary-muted);
  border: none;
  color: var(--color-primary);
  font-weight: 600;
}
.ls__btn--primary:hover {
  background: var(--color-primary);
  color: #fff;
}

/* Transition */
.ls-expand-enter-active,
.ls-expand-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.ls-expand-enter-from,
.ls-expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.ls-expand-enter-to,
.ls-expand-leave-from {
  opacity: 1;
  max-height: 400px;
}
</style>
