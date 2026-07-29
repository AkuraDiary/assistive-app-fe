<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composable/useAuth'
import SharedRecentActivity from '@/components/dashboard/SharedRecentActivity.vue'
import AdminStatsChart from '@/components/dashboard/AdminStatsChart.vue'
import { dashboardService } from '@/services/DashboardService'

const { user } = useAuth()

const loading = ref(true)
const recentActivities = ref<any[]>([])
const chartData = ref<any>(null)
const institutions = ref<any[]>([])

// Filter selections
const selectedInstitutionId = ref<string>('all')
const selectedYear = ref<string>('2026')

async function loadData() {
  loading.value = true
  try {
    const res = await dashboardService.getAdminDashboardData()
    if (res.success) {
      recentActivities.value = res.data?.recentActivities || []
      chartData.value = res.data?.chartData || null
      institutions.value = res.data?.institutions || []
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

function handleInstitutionChange(e: Event) {
  selectedInstitutionId.value = (e.target as HTMLSelectElement).value
  // Fetch new data for the selected institution
}

function handleYearChange(e: Event) {
  selectedYear.value = (e.target as HTMLSelectElement).value
  // Fetch new data for the selected year
}
</script>

<template>
  <div class="admin-dashboard">
    <div class="admin-dashboard__header">
      <h1 class="admin-dashboard__title">Selamat datang Admin {{ user?.fullName?.split(' ')[0] || 'Stevan' }}</h1>
      <p class="admin-dashboard__subtitle">Pantau aktivitas masing-masing lembaga!</p>
    </div>

    <!-- Top Row: Recent Activity -->
    <div class="admin-dashboard__recent-row">
      <SharedRecentActivity :activities="recentActivities" />
    </div>

    <!-- Chart Section -->
    <div class="admin-dashboard__chart-section">
      <div class="admin-dashboard__chart-header">
        <div class="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff4d8d" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          <h2 class="admin-dashboard__chart-title">Statistik Lembaga</h2>
        </div>
        
        <div class="admin-dashboard__filters">
          <select class="admin-dashboard__select" :value="selectedInstitutionId" @change="handleInstitutionChange">
            <option value="all">Semua Lembaga</option>
            <option v-for="inst in institutions" :key="inst.id" :value="inst.id">{{ inst.name }}</option>
          </select>

          <select class="admin-dashboard__select" :value="selectedYear" @change="handleYearChange">
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </div>

      <div class="admin-dashboard__chart-body">
        <div v-if="loading" class="flex justify-center py-20">
          <div class="w-8 h-8 border-2 border-pink-100 border-t-pink-500 rounded-full animate-spin"></div>
        </div>
        <AdminStatsChart v-else-if="chartData" :chart-data="chartData" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.admin-dashboard__title {
  font-size: 24px;
  font-weight: 700;
  color: #2d2d2d;
  margin: 0 0 8px 0;
}

.admin-dashboard__subtitle {
  font-size: 15px;
  color: #666;
  margin: 0;
}

/* Recent Activity */
.admin-dashboard__recent-row {
  max-width: 100%;
}

/* Chart Section */
.admin-dashboard__chart-section {
  background: #fff;
  border-radius: 12px;
  padding: 32px 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  border: 1px solid #f0f0f0;
}

.admin-dashboard__chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.admin-dashboard__chart-title {
  font-size: 22px;
  font-weight: 700;
  color: #ff4d8d;
  margin: 0;
}

.admin-dashboard__filters {
  display: flex;
  gap: 12px;
}

.admin-dashboard__select {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 36px 8px 12px;
  font-size: 14px;
  color: #2d2d2d;
  background: #fff url('data:image/svg+xml;utf8,<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="%236b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>') no-repeat right 12px center;
  cursor: pointer;
  outline: none;
  appearance: none;
  min-width: 120px;
}

@media (max-width: 768px) {
  .admin-dashboard__chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .admin-dashboard__filters {
    width: 100%;
  }
  .admin-dashboard__select {
    flex: 1;
  }
}

.admin-dashboard__chart-body {
  width: 100%;
}
</style>
