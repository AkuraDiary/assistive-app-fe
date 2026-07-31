<script setup lang="ts">
import { ref } from 'vue'
import type { CourseModule } from '@/types/course.types'

defineProps<{
  modules: CourseModule[]
}>()

const expandedId = ref<string | null>(null)

function toggle(id: string) {
  expandedId.value = expandedId.value === id ? null : id
}
const emit = defineEmits<{
  (e: 'open-materi', moduleId: string): void
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
        <span class="ls__title">Latihan</span>
      </div>
      <p class="ls__desc">Pelajari materinya dan kerjakan latihan untuk menguji pemahamanmu.</p>
    </div>

    <!-- Module list -->
    <div class="ls__list">
      <div
        v-for="item in modules"
        :key="item.id"
        class="ls__item"
        :class="{ 'ls__item--expanded': expandedId === item.id }"
      >
        <!-- Row -->
        <div class="ls__row" @click="toggle(item.id)">
          <div class="ls__row-left">
            <span class="ls__item-title">{{ item.title }}</span>
          </div>
          <div class="ls__row-right">
            <span v-if="item.progress !== undefined" class="ls__item-pct" :class="{ 'ls__item-pct--pink': expandedId === item.id }">{{ item.progress }} %</span>
            <svg
              class="ls__chevron"
              :class="{ 'ls__chevron--up': expandedId === item.id, 'ls__chevron--pink': expandedId === item.id }"
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
              <p class="ls__expanded-desc">{{ item.description ?? 'Belajar huruf vocal' }}</p>

              <div class="ls__expanded-meta">
                <span class="ls__expanded-date">
                  Terakhir Dikerjakan: {{ formatDate(item.tanggalDikerjakan) }}
                </span>
                <span v-if="item.progress !== undefined" class="ls__expanded-pct-bold">{{ item.progress }}%</span>
              </div>

              <div v-if="item.progress !== undefined" class="ls__expanded-track">
                <div class="ls__expanded-fill" :style="{ width: `${item.progress}%` }" />
              </div>

              <div class="ls__expanded-actions">
                <button class="ls__btn ls__btn--primary" @click="emit('open-materi', item.id)">
                  Lanjutan pelajaran
                </button>
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
  gap: 1.5rem;
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
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-dark);
}
.ls__desc {
  font-size: 12px;
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
  padding: 16px 0;
  cursor: pointer;
  user-select: none;
}
.ls__row-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
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
  font-weight: 600;
  color: var(--color-text-dark);
  transition: color 0.2s;
}
.ls__item-pct--pink {
  color: var(--color-primary);
}
.ls__chevron {
  transition: transform 0.2s, color 0.2s;
  color: var(--color-text-light);
}
.ls__chevron--pink {
  color: var(--color-primary);
}
.ls__chevron--up {
  transform: rotate(180deg);
}

/* Expanded */
.ls__expanded-inner {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 16px;
}
.ls__expanded-desc {
  font-size: 12px;
  color: var(--color-text-light);
  margin: 0;
  line-height: 1.5;
}
.ls__expanded-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}
.ls__expanded-date {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-light);
}
.ls__expanded-pct-bold {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-dark);
}
.ls__expanded-track {
  height: 8px;
  background: rgba(255, 60, 138, 0.15); /* light pink background */
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
  margin-top: 8px;
}
.ls__btn {
  flex: 1;
  padding: 12px 0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  text-align: center;
}
.ls__btn--primary {
  background: var(--color-primary);
  border: none;
  color: #fff;
}
.ls__btn--primary:hover {
  background: #e62c76;
}

/* Transition */
.ls-expand-enter-active,
.ls-expand-leave-active {
  transition: all 0.3s ease;
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
