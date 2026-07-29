<script setup lang="ts">
import { onMounted, computed } from 'vue'

import CourseTable from '@/components/course/CourseTable.vue'
import CoursePagination from '@/components/shared/pagination/CoursePagination.vue'
import { useDashboard } from '@/composable/useDashboard'
import { useRouter } from 'vue-router'
import type { CourseStatus } from '@/types/course.types'

const router = useRouter()

const {
  loading,
  selectedChildId,
  paginatedCourses,
  filteredCourses,
  filterStatus,
  currentPage,
  perPage,
  totalPages,
  initialize,
  setFilter,
  setPage,
  setPerPage,
} = useDashboard()

onMounted(initialize)

const totalCount = computed(() => filteredCourses.value.length)

const filterOptions: { label: string; value: CourseStatus | 'semua' }[] = [
  { label: 'Semua Status', value: 'semua' },
  { label: 'Dipelajari', value: 'dipelajari' },
  { label: 'Diselesaikan', value: 'selesai' },
  { label: 'Belum dikerjakan', value: 'belum' },
]
</script>

<template>
  <div class="cl">
    <main class="cl__main">
      <div class="cl__card">
        <!-- Header -->
        <div class="cl__header">
          <div>
            <h1 class="cl__title">Course List</h1>
            <p class="cl__subtitle">Total Course : {{ totalCount }}</p>
          </div>

          <!-- Filter dropdown -->
          <div class="cl__filter-wrap">
            <select
              class="cl__filter"
              :value="filterStatus"
              @change="
                setFilter(($event.target as HTMLSelectElement).value as CourseStatus | 'semua')
              "
            >
              <option v-for="opt in filterOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>
        <div v-if="!selectedChildId" class="cl__empty-state">
          <p class="cl__empty-text">
            Pilih anak terlebih dahulu di Dashboard untuk melihat course.
          </p>
          <button class="cl__back-btn" @click="router.push('/dashboard')">
            ← Kembali ke Dashboard
          </button>
        </div>
        <!-- Table -->
        <CourseTable
          v-else
          :courses="paginatedCourses"
          :loading="loading"
          @detail="(id) => router.push(`/course/${id}`)"
          @action="(id) => console.log('action', id)"
        />

        <!-- Footer -->
        <div class="cl__footer">
          <div class="cl__per-page">
            <span class="cl__footer-label">Tampil</span>
            <select
              class="cl__per-page-select"
              :value="perPage"
              @change="setPerPage(Number(($event.target as HTMLSelectElement).value))"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
            <span class="cl__footer-label">data per halaman</span>
          </div>

          <CoursePagination
            :current-page="currentPage"
            :total-pages="totalPages"
            @page-change="setPage"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.cl {
  min-height: 100vh;
  background: var(--color-background);
}

.cl__main {
  max-width: 95%;
  margin: 0 auto;

  padding: 2rem 2rem 3rem;
}

.cl__card {
  background: var(--color-primary-muted);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Header */
.cl__header {
  padding: 1rem 1rem 0rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.cl__title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-dark);
  margin: 0 0 4px;
}

.cl__subtitle {
  font-size: 13px;
  color: var(--color-text-light);
  margin: 0;
}

/* Filter */
.cl__filter-wrap {
  position: relative;
}

.cl__filter {
  padding: 8px 36px 8px 14px;
  border-radius: 10px;
  border: 1.5px solid var(--color-border);
  background: var(--color-white);
  font-size: 13px;
  color: var(--color-text-dark);
  cursor: pointer;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239b8ec4' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  transition: border-color 0.15s;
  min-width: 160px;
}
.cl__filter:hover,
.cl__filter:focus {
  border-color: var(--color-primary);
}

/* Footer */
.cl__footer {
  padding: 0rem 1rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  border-top: 1px solid var(--color-border);
}

.cl__per-page {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cl__footer-label {
  font-size: 13px;
  color: var(--color-text-light);
}

.cl__per-page-select {
  padding: 4px 8px;
  border-radius: 6px;
  border: 1.5px solid var(--color-border);
  background: var(--color-white);
  font-size: 13px;
  color: var(--color-text-dark);
  cursor: pointer;
  outline: none;
}

.cl__empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 300px;
}

.cl__empty-text {
  font-size: 14px;
  color: var(--color-text-light);
  margin: 0;
  text-align: center;
}

.cl__back-btn {
  padding: 8px 20px;
  border-radius: 10px;
  border: 1.5px solid var(--color-primary);
  background: transparent;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-primary);
  cursor: pointer;
  transition: all 0.15s;
}
.cl__back-btn:hover {
  background: var(--color-primary);
  color: #fff;
}
</style>
