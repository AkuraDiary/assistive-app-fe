<script setup lang="ts">
import type { AssessmentItem } from '@/types/course.types'

defineProps<{
  assessments: AssessmentItem[]
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
  <div class="as">
    <!-- Section header -->
    <div class="as__header">
      <div class="as__title-row">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />
          <path d="M17.5 2.5a2.121 2.121 0 013 3L12 14l-4 1 1-4 7.5-7.5z" />
        </svg>
        <span class="as__title">Assessment</span>
      </div>
      <p class="as__desc">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
      </p>
    </div>

    <!-- Assessment list -->
    <div class="as__list">
      <div
        v-for="item in assessments"
        :key="item.id"
        class="as__item"
      >
        <!-- Top row -->
        <div class="as__item-header">
          <div class="as__item-info">
            <span class="as__item-title">{{ item.title }}</span>
            <p class="as__item-desc">{{ item.description ?? '-' }}</p>
            <div class="as__skills">
              <span
                v-for="skill in item.skills"
                :key="skill"
                class="as__skill-tag"
              >
                {{ skill }}
              </span>
            </div>
            <p v-if="item.tanggalDikerjakan" class="as__item-date">
              Dikerjakan: {{ formatDate(item.tanggalDikerjakan) }}
            </p>
          </div>
          <span class="as__level-badge">{{ item.level }}</span>
        </div>

        <!-- CTA -->
        <button
          class="as__cta"
          :class="{ 'as__cta--locked': item.isLocked }"
          :disabled="item.isLocked"
        >
          <template v-if="item.isLocked">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 11H6V8a6 6 0 1112 0v3zm-6 9a3 3 0 110-6 3 3 0 010 6z" />
            </svg>
            Terkunci
          </template>
          <template v-else>
            Mulai Assessment
          </template>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.as {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Header */
.as__header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.as__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-dark);
}
.as__title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-dark);
}
.as__desc {
  font-size: 13px;
  color: var(--color-text-light);
  margin: 0;
  line-height: 1.5;
}

/* List */
.as__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Item */
.as__item {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.as__item-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.as__item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.as__item-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-dark);
}

.as__item-desc {
  font-size: 13px;
  color: var(--color-text-light);
  margin: 0;
  line-height: 1.5;
}

.as__item-date {
  font-size: 12px;
  color: var(--color-text-light);
  margin: 0;
}

/* Skills */
.as__skills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 2px;
}
.as__skill-tag {
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  font-size: 12px;
  color: var(--color-text-light);
  background: var(--color-background);
}

/* Level badge */
.as__level-badge {
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--color-primary-muted);
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

/* CTA button */
.as__cta {
  width: 100%;
  padding: 11px 0;
  border-radius: 10px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.15s;
  background: var(--color-primary-muted);
  color: var(--color-primary);
}
.as__cta:hover:not(:disabled) {
  background: var(--color-primary);
  color: #fff;
}
.as__cta--locked {
  background: var(--color-primary-muted);
  color: var(--color-primary);
  cursor: not-allowed;
  opacity: 0.8;
}
</style>