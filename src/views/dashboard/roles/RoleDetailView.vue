<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { dashboardService } from '@/services/dashboard.service'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const role = ref<any>(null)

async function loadData() {
  loading.value = true
  try {
    const id = route.params.id as string
    const res = await dashboardService.getRoleById(id)
    if (res.success && res.data) {
      role.value = res.data
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

function goBack() {
  router.push('/manajemen-pengguna/roles')
}
</script>

<template>
  <div class="role-detail-page">
    <div class="page-header">
      <h1 class="page-title">Detail Role</h1>
      <button class="btn-kembali" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Kembali
      </button>
    </div>

    <div v-if="loading" class="text-center py-10">Memuat data...</div>
    <div v-else-if="!role" class="text-center py-10">Data role tidak ditemukan.</div>
    <div v-else class="content-section">
      <div class="identitas-grid">
        <div class="identitas-item">
          <span class="identitas-label">Nama Role</span>
          <span class="identitas-value">{{ role.name }}</span>
        </div>
        <div class="identitas-item">
          <span class="identitas-label">Deskripsi</span>
          <span class="identitas-value">{{ role.description }}</span>
        </div>
        <div class="identitas-item">
          <span class="identitas-label">Status Aktif</span>
          <div>
            <span class="badge" :class="role.status === 'aktif' ? 'badge-green' : 'badge-red'">
              {{ role.status === 'aktif' ? 'Aktif' : 'Nonaktif' }}
            </span>
          </div>
        </div>
      </div>

      <div class="akses-section mt-12">
        <h2 class="section-title">
          <span class="section-title-dash"></span>
          Daftar Akses
        </h2>
        <div class="table-container">
          <table class="access-table">
            <thead>
              <tr>
                <th class="py-4 pl-4 text-left">Nama Modul</th>
                <th class="py-4 text-center">Lihat</th>
                <th class="py-4 text-center">Tambah</th>
                <th class="py-4 text-center">Edit</th>
                <th class="py-4 text-center">Hapus</th>
                <th class="py-4 text-center">Detail</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="acc in role.access" :key="acc.moduleId">
                <td class="font-bold text-gray-800 pl-4">{{ acc.moduleName }}</td>
                <td class="text-center">
                  <div v-if="acc.canView" class="checked-icon"></div>
                  <span v-else class="dash-icon">-</span>
                </td>
                <td class="text-center">
                  <div v-if="acc.canAdd" class="checked-icon"></div>
                  <span v-else class="dash-icon">-</span>
                </td>
                <td class="text-center">
                  <div v-if="acc.canEdit" class="checked-icon"></div>
                  <span v-else class="dash-icon">-</span>
                </td>
                <td class="text-center">
                  <div v-if="acc.canDelete" class="checked-icon"></div>
                  <span v-else class="dash-icon">-</span>
                </td>
                <td class="text-center">
                  <div v-if="acc.canDetail" class="checked-icon"></div>
                  <span v-else class="dash-icon">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.role-detail-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #2d2d2d;
  margin: 0;
}

.btn-kembali {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  border: 1px solid #ff4d8d;
  color: #ff4d8d;
  background: white;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-kembali:hover {
  background: #fff0f5;
}

.identitas-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.identitas-item {
  display: grid;
  grid-template-columns: 200px 1fr;
  align-items: center;
}

.identitas-label {
  color: #6b7280;
  font-size: 15px;
}

.identitas-value {
  color: #2d2d2d;
  font-weight: 700;
  font-size: 16px;
}

.badge {
  display: inline-block;
  padding: 4px 16px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 700;
}

.badge-green {
  background-color: #dcfce3;
  color: #16a34a;
}

.badge-red {
  background-color: #fee2e2;
  color: #ef4444;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 700;
  color: #2d2d2d;
  margin-bottom: 2rem;
}

.section-title-dash {
  width: 16px;
  height: 4px;
  background-color: #ff4d8d;
  border-radius: 2px;
}

.table-container {
  overflow-x: auto;
  border-top: 1px solid #e5e7eb;
}

.access-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.access-table th {
  font-weight: 700;
  color: #2d2d2d;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.access-table td {
  padding: 20px 16px;
  color: #4b5563;
}

.checked-icon {
  display: inline-block;
  width: 22px;
  height: 22px;
  background-color: #ff4d8d;
  border-radius: 4px;
  position: relative;
  margin: 0 auto;
}

.checked-icon:after {
  content: "";
  position: absolute;
  left: 7px;
  top: 3px;
  width: 6px;
  height: 12px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.dash-icon {
  font-size: 24px;
  font-weight: 700;
  color: #2d2d2d;
}
</style>
