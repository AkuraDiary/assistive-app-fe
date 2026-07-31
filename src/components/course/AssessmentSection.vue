<script setup lang="ts">
import type { CourseModule } from '@/types/course.types'

defineProps<{
  modules: CourseModule[]
}>()

const emit = defineEmits<{
  (e: 'open-assessment', moduleId: string): void
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
            <span class="as__tag">Kata</span>
            <span class="as__tag">Kalimat</span>
            <span class="as__tag">Objek</span>
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

        <button 
          class="as__btn" 
          :class="item.isLocked ? 'as__btn--locked' : 'as__btn--primary'"
          :disabled="item.isLocked"
          @click="emit('open-assessment', item.id)"
        >
          <svg v-if="item.isLocked" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          {{ item.isLocked ? 'Terkunci' : 'Mulai Ujian' }}
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
</style>
