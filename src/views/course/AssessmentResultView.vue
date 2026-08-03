<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import AccessibilityMenu from '@/components/shared/AccessibilityMenu.vue'
import { useAccessibility } from '@/composable/useAccessibility'

const route = useRoute()
const router = useRouter()
const { fontSizeClass, dyslexiaClass } = useAccessibility()

const courseId = route.params.courseId as string
const moduleId = route.params.moduleId as string

function goToReview() {
  router.push({ name: 'assessment-review', params: { courseId, moduleId } })
}

function finish() {
  router.push({ name: 'course-detail', params: { courseId } })
}
</script>

<template>
  <div class="result-page" :class="[fontSizeClass, dyslexiaClass]">
    <div class="result-page__content">
      <div class="result-page__header">
        <h1 class="result-page__title">Horray! Kamu berhasil menyelesaikan ujian</h1>
        <h2 class="result-page__course-title">Mengenal Huruf Vokal</h2>
        <p class="result-page__module-name">Modul 1</p>
      </div>

      <div class="result-page__stats">
        <div class="result-page__stat-card">
          <div class="result-page__stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#F43F5E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 6V12L16 14" stroke="#F43F5E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="result-page__stat-value">20 Menit</div>
          <div class="result-page__stat-label">Waktu pengerjaan</div>
        </div>

        <div class="result-page__stat-card">
          <div class="result-page__stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#F43F5E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="result-page__stat-value">75</div>
          <div class="result-page__stat-label">Poin</div>
        </div>

        <div class="result-page__stat-card">
          <div class="result-page__stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11L12 14L22 4" stroke="#F43F5E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="#F43F5E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="result-page__stat-value">10/20</div>
          <div class="result-page__stat-label">Pertanyaan Benar</div>
        </div>
      </div>

      <div class="result-page__category-card">
        <h3 class="result-page__category-title">Kategori</h3>
        <div class="result-page__category-pills">
          <span class="result-page__pill">Mendengar</span>
          <span class="result-page__pill">Menulis</span>
          <span class="result-page__pill">Membaca</span>
        </div>
      </div>

      <div class="result-page__actions">
        <button class="result-page__btn result-page__btn--primary" @click="finish">Selesai</button>
        <button class="result-page__btn result-page__btn--outline" @click="goToReview">Lihat Jawaban</button>
      </div>
    </div>
    <AccessibilityMenu />
  </div>
</template>

<style scoped>
.result-page {
  min-height: 100vh;
  background: var(--color-bg);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
}

.result-page__content {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

.result-page__header {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.result-page__title {
  font-size: 1.125rem;
  color: var(--color-text-light);
  font-weight: 500;
  margin: 0;
}

.result-page__course-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-dark);
  margin: 0;
}

.result-page__module-name {
  font-size: 1.125rem;
  color: var(--color-text-light);
  margin: 0;
}

.result-page__stats {
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: space-between;
}

.result-page__stat-card {
  flex: 1;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
}

.result-page__stat-icon {
  margin-bottom: 0.5rem;
}

.result-page__stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-dark);
}

.result-page__stat-label {
  font-size: 0.875rem;
  color: var(--color-text-light);
}

.result-page__category-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1.5rem 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.result-page__category-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
}

.result-page__category-pills {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.result-page__pill {
  padding: 0.5rem 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: 2rem;
  font-size: 0.875rem;
  color: var(--color-text-dark);
  font-weight: 500;
}

.result-page__actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.result-page__btn {
  padding: 0.75rem 2.5rem;
  border-radius: 2rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.result-page__btn--primary {
  background: var(--color-primary);
  color: white;
  border: none;
}

.result-page__btn--primary:hover {
  background: var(--color-primary-hover, #db2777);
}

.result-page__btn--outline {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.result-page__btn--outline:hover {
  background: #fdf2f8;
}
</style>
