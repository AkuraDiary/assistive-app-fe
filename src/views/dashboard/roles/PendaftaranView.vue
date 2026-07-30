<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ApplicationDetailModal from '@/components/dashboard/ApplicationDetailModal.vue'
import { dashboardService } from '@/services/dashboard.service'

const loading = ref(true)
const applications = ref<any[]>([])
const searchQuery = ref('')
const showApplicationModal = ref(false)
const selectedApplication = ref<any>(null)

async function loadData() {
  loading.value = true
  try {
    const res = await dashboardService.getInstitutionDashboardData()
    if (res.success) {
      applications.value = res.data?.applications || []
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

const filteredApplications = computed(() => {
  let apps = applications.value.filter(a => a.status === 'menunggu')
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    apps = apps.filter(a => a.name.toLowerCase().includes(q))
  }
  return apps
})

function openDetailModal(app: any) {
  selectedApplication.value = app
  showApplicationModal.value = true
}

async function handleAcceptApplication(id: string) {
  showApplicationModal.value = false
  await dashboardService.updateApplicationStatus(id, 'diterima')
  await loadData()
}

async function handleRejectApplication(id: string) {
  showApplicationModal.value = false
  await dashboardService.updateApplicationStatus(id, 'ditolak')
  await loadData()
}
</script>

<template>
  <div class="pendaftaran-page">
    <div class="pendaftaran-page__header">
      <h1 class="pendaftaran-page__title">Daftar Pengajuan</h1>
      <div class="pendaftaran-page__search">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari Data Siswa" 
          class="pendaftaran-page__search-input" 
        />
      </div>
    </div>

    <div class="pendaftaran-page__table-section">
      <div class="pendaftaran-page__table-container">
        <table class="pendaftaran-page__table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Jenis Kelamin</th>
              <th>Tanggal Lahir</th>
              <th class="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="4" class="text-center py-8">Memuat data...</td>
            </tr>
            <tr v-else-if="filteredApplications.length === 0">
              <td colspan="4" class="text-center py-8">Tidak ada data pengajuan yang ditemukan.</td>
            </tr>
            <tr v-for="app in filteredApplications" :key="app.id">
              <td class="font-semibold">{{ app.name }}</td>
              <td>{{ app.gender }}</td>
              <td>{{ app.dob }}</td>
              <td class="text-right">
                <div class="flex items-center justify-end gap-3">
                  <button class="pendaftaran-page__btn-outline" @click="openDetailModal(app)">Detail</button>
                  <button class="pendaftaran-page__btn-primary" @click="handleAcceptApplication(app.id)">Terima Pengajuan</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ApplicationDetailModal
      :show="showApplicationModal"
      :application="selectedApplication"
      @close="showApplicationModal = false"
      @accept="handleAcceptApplication"
      @reject="handleRejectApplication"
    />
  </div>
</template>

<style scoped>
.pendaftaran-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.pendaftaran-page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pendaftaran-page__title {
  font-size: 28px;
  font-weight: 700;
  color: #2d2d2d;
  margin: 0;
}

.pendaftaran-page__search-input {
  padding: 12px 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  width: 300px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  background-color: #f9fafb;
}

.pendaftaran-page__search-input:focus {
  border-color: #ff4d8d;
  background-color: #ffffff;
}

.pendaftaran-page__table-section {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid #f0f0f0;
}

.pendaftaran-page__table-container {
  overflow-x: auto;
}

.pendaftaran-page__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
}

.pendaftaran-page__table th {
  text-align: left;
  font-weight: 600;
  color: #2d2d2d;
  padding: 16px;
  border-bottom: 2px solid #e5e7eb;
}

.pendaftaran-page__table td {
  padding: 20px 16px;
  color: #4b5563;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

.pendaftaran-page__table tbody tr:last-child td {
  border-bottom: none;
}

.pendaftaran-page__btn-outline {
  padding: 8px 20px;
  border: 1px solid #ff4d8d;
  color: #ff4d8d;
  background: #fff;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.pendaftaran-page__btn-outline:hover {
  background: #fce8f0;
}

.pendaftaran-page__btn-primary {
  padding: 8px 20px;
  background: #ff4d8d;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.pendaftaran-page__btn-primary:hover {
  background: #e63e7a;
}
</style>
