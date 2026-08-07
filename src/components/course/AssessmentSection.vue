<script setup lang="ts">
import type { CourseModule } from '@/types/course.types'

defineProps<{
  modules: CourseModule[]
  isEditMode: boolean
  progress: number
}>()

const emit = defineEmits<{
  (e: 'open-assessment', moduleId: string): void
  (e: 'edit-assessment', moduleId: string): void
}>()
</script>

<template>
  <div class="as">
    <!-- Section header -->
    <div class="as__header">
      <div class="as__title-row">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
        <span class="as__title">Assessment</span>
      </div>
      <p class="as__desc">Waktunya membuktikan kemampuanmu! Pastikan semua modul telah selesai dipelajari sebelum memulai ujian akhir ini</p>
    </div>

    <!-- Module list -->
    <div class="as__list">
      <div
        v-for="item in modules"
        :key="item.id"
        class="as__card"
      >
        <div class="as__card-header">
          <span class="as__card-title">{{ item.title }}</span>
          <div class="as__card-tags">
            <span v-for="cat in (item.categories || [])" :key="cat" class="as__tag">
              {{ cat.charAt(0).toUpperCase() + cat.slice(1) }}
            </span>
          </div>
        </div>

        <p class="as__card-desc">
          {{ item.description ?? 'Evaluasi akhir pemahaman huruf vokal melalui tes mendengar, menulis, dan membaca.' }}
        </p>

        <div class="as__card-skills">
          <span v-for="skill in (item.skills ?? ['Mendengar', 'Menulis', 'Membaca'])" :key="skill" class="as__skill">
            {{ skill }}
          </span>
        </div>

        <template v-if="isEditMode">
          <div style="display: flex; gap: 12px; margin-top: 8px;">
            <button class="as__btn as__btn--primary" style="flex: 1;" @click="emit('edit-assessment', item.id)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Assessment
            </button>
            <button class="as__btn as__btn--danger" style="flex: 1;" @click.stop>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                <line x1="12" y1="2" x2="12" y2="12" />
              </svg>
              Nonaktifkan Assessment
            </button>
          </div>
        </template>
        <template v-else>
          <button 
            class="as__btn" 
            :class="progress < 100 || item.isLocked ? 'as__btn--locked' : 'as__btn--primary'"
            :disabled="progress < 100 || item.isLocked"
            @click="emit('open-assessment', item.id)"
          >
            <svg v-if="progress < 100 || item.isLocked" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            {{ progress < 100 || item.isLocked ? 'Terkunci' : 'Mulai Ujian' }}
          </button>
        </template>
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
  gap: 1.5rem;
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
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-dark);
}
.as__desc {
  font-size: 12px;
  color: var(--color-text-light);
  margin: 0;
}

/* List */
.as__list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Card */
.as__card {
  border: 1.5px solid var(--color-primary);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.as__card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.as__card-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-dark);
}

.as__card-tags {
  display: flex;
  gap: 6px;
}

.as__tag {
  background: var(--color-primary);
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 999px;
  text-transform: capitalize;
}

.as__card-desc {
  font-size: 12px;
  color: var(--color-text-light);
  line-height: 1.4;
  margin: 0;
}

.as__card-skills {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.as__skill {
  border: 1px solid var(--color-border);
  color: var(--color-text-light);
  font-size: 10px;
  padding: 4px 10px;
  border-radius: 999px;
  background: #fff;
}

/* Button */
.as__btn {
  margin-top: 8px;
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.as__btn--locked {
  background: rgba(255, 60, 138, 0.4); /* Faded pink */
  color: #fff;
  cursor: not-allowed;
}

.as__btn--primary {
  background: var(--color-primary);
  color: #fff;
}
.as__btn--primary:hover {
  background: #e62c76;
}

.as__btn--danger {
  background: #d32f2f;
  color: #fff;
  border: none;
}
.as__btn--danger:hover {
  background: #b71c1c;
}
</style>
