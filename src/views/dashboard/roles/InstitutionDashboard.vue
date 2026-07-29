<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composable/useAuth'
import StatCards from '@/components/dashboard/StatCards.vue'
import SharedRecentActivity from '@/components/dashboard/SharedRecentActivity.vue'
import SharedActivityPanel from '@/components/dashboard/SharedActivityPanel.vue'
import SharedCourseProgressPanel from '@/components/dashboard/SharedCourseProgressPanel.vue'
import { dashboardService } from '@/services/DashboardService'

const { user } = useAuth()

const loading = ref(true)
const stats = ref<any>(null)
const recentActivities = ref<any[]>([])
const activities = ref<any[]>([])
const courses = ref<any[]>([])
const students = ref<any[]>([])
const selectedStudentId = ref<string | null>(null)
const applications = ref<any[]>([])

async function loadData() {
  loading.value = true
  try {
    const [instRes, studentsRes, actRes, courseRes] = await Promise.all([
      dashboardService.getInstitutionDashboardData(),
      dashboardService.getStudents(),
      dashboardService.getActivities(),
      dashboardService.getCourses(),
    ])

    if (instRes.success) {
      stats.value = instRes.data?.stats
      recentActivities.value = instRes.data?.recentActivities || []
      applications.value = instRes.data?.applications || []
    }

    if (studentsRes.success) {
      students.value = studentsRes.data || []
      if (students.value.length > 0) {
        selectedStudentId.value = students.value[0]._id
      }
    }
    
    if (actRes.success) {
      activities.value = actRes.data || []
    }

    if (courseRes.success) {
      courses.value = courseRes.data || []
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

function handleStudentChange(id: string) {
  selectedStudentId.value = id
}
</script>

<template>
  <div class="inst-dashboard">
    <div class="inst-dashboard__header">
      <h1 class="inst-dashboard__title">Selamat datang {{ user?.fullName || 'Riya Wijaya' }}</h1>
      <p class="inst-dashboard__subtitle">
        Anda belum memiliki data Anak, Yuk segera tambahkan data anak <span class="font-bold text-gray-800">disini</span> untuk memulai pembelajaran!
      </p>
    </div>

    <!-- Top Row: Stats and Recent Activity -->
    <div class="inst-dashboard__top-row">
      <div class="inst-dashboard__stats-col">
        <StatCards v-if="stats" :stats="stats" />
      </div>
      <div class="inst-dashboard__recent-col">
        <SharedRecentActivity :activities="recentActivities" />
      </div>
    </div>

    <!-- Middle Row: Shared Panels -->
    <div class="inst-dashboard__mid-row">
      <div class="inst-dashboard__activity-col">
        <SharedActivityPanel :activities="activities" :loading="loading" />
      </div>
      <div class="inst-dashboard__course-col">
        <SharedCourseProgressPanel 
          :students="students"
          :selected-student-id="selectedStudentId"
          :courses="courses"
          :loading="loading"
          @student-change="handleStudentChange"
        />
      </div>
    </div>

    <!-- Bottom Row: Application Table -->
    <div class="inst-dashboard__table-section">
      <div class="inst-dashboard__table-header">
        <div class="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff4d8d" stroke-width="2.5" stroke-linecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <h2 class="inst-dashboard__table-title">Daftar Pengajuan</h2>
        </div>
        <button class="inst-dashboard__table-link">Lihat Lebih Banyak</button>
      </div>

      <div class="inst-dashboard__table-container">
        <table class="inst-dashboard__table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Jenis Kelamin</th>
              <th>Tanggal Lahir</th>
              <th class="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="app in applications" :key="app.id">
              <td class="font-semibold">{{ app.name }}</td>
              <td>{{ app.gender }}</td>
              <td>{{ app.dob }}</td>
              <td class="text-right">
                <div class="flex items-center justify-end gap-3">
                  <button class="inst-dashboard__btn-outline">Detail</button>
                  <button class="inst-dashboard__btn-primary">Terima Pengajuan</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inst-dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.inst-dashboard__title {
  font-size: 24px;
  font-weight: 700;
  color: #2d2d2d;
  margin: 0 0 8px 0;
}

.inst-dashboard__subtitle {
  font-size: 15px;
  color: #666;
  margin: 0;
}

/* Top Row */
.inst-dashboard__top-row {
  display: flex;
  gap: 2rem;
}

.inst-dashboard__stats-col {
  flex: 1;
}

.inst-dashboard__recent-col {
  width: 400px;
  flex-shrink: 0;
}

@media (max-width: 1024px) {
  .inst-dashboard__top-row {
    flex-direction: column;
  }
  .inst-dashboard__recent-col {
    width: 100%;
  }
}

/* Middle Row */
.inst-dashboard__mid-row {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 2rem;
}

.inst-dashboard__activity-col {
  grid-column: span 5;
  display: flex;
  flex-direction: column;
}

.inst-dashboard__course-col {
  grid-column: span 7;
  display: flex;
  flex-direction: column;
}

@media (max-width: 1024px) {
  .inst-dashboard__mid-row {
    display: flex;
    flex-direction: column;
  }
}

/* Table Section */
.inst-dashboard__table-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  border: 1px solid #f0f0f0;
}

.inst-dashboard__table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.inst-dashboard__table-title {
  font-size: 22px;
  font-weight: 700;
  color: #ff4d8d;
  margin: 0;
}

.inst-dashboard__table-link {
  background: none;
  border: none;
  color: #ff4d8d;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
}

.inst-dashboard__table-container {
  overflow-x: auto;
}

.inst-dashboard__table {
  width: 100%;
  border-collapse: collapse;
}

.inst-dashboard__table th {
  text-align: left;
  font-weight: 600;
  color: #2d2d2d;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.inst-dashboard__table td {
  padding: 16px;
  color: #4b5563;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

.inst-dashboard__table tbody tr:last-child td {
  border-bottom: none;
}

.inst-dashboard__btn-outline {
  padding: 8px 16px;
  border: 1px solid #ff4d8d;
  color: #ff4d8d;
  background: #fff;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.inst-dashboard__btn-outline:hover {
  background: #fce8f0;
}

.inst-dashboard__btn-primary {
  padding: 8px 16px;
  background: #ff4d8d;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.inst-dashboard__btn-primary:hover {
  background: #e63e7a;
}
</style>
