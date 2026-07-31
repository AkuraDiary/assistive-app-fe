<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { dashboardService } from '@/services/dashboard.service'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(true)
const roles = ref<any[]>([])

async function loadData() {
  loading.value = true
  try {
    const res = await dashboardService.getRoles()
    if (res.success) {
      roles.value = res.data || []
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

async function handleToggleStatus(role: any) {
  await dashboardService.toggleRoleStatus(role._id)
  await loadData()
}

function goToCreate() {
  router.push('/manajemen-pengguna/roles/create')
}

function goToDetail(id: string) {
  router.push(`/manajemen-pengguna/roles/${id}`)
}

function goToEdit(id: string) {
  router.push(`/manajemen-pengguna/roles/${id}/edit`)
}
</script>

<template>
  <div class="role-page">
    <div class="sidebar">
      <div class="sidebar-item active">
        Daftar Role
        <div class="active-indicator"></div>
      </div>
      <div class="sidebar-item">
        Daftar Pengguna
      </div>
    </div>

    <div class="content">
      <div class="page-header">
        <h1 class="page-title">Daftar Role</h1>
        <button class="btn-primary" @click="goToCreate">+ Tambah Role</button>
      </div>

      <div class="table-section">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th class="py-4">Nama Role</th>
                <th class="py-4 text-center">Deskripsi</th>
                <th class="py-4 text-center">Status</th>
                <th class="py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="4" class="text-center py-8">Memuat data...</td>
              </tr>
              <tr v-else-if="roles.length === 0">
                <td colspan="4" class="text-center py-8">Tidak ada data role yang ditemukan.</td>
              </tr>
              <tr v-for="role in roles" :key="role._id" :class="{'opacity-60': role.status === 'nonaktif'}">
                <td class="font-bold text-gray-800">{{ role.name }}</td>
                <td class="text-center text-gray-500">{{ role.description }}</td>
                <td class="text-center">
                  <div class="flex items-center justify-center gap-3">
                    <span class="text-sm font-bold text-gray-900">
                      {{ role.status === 'aktif' ? 'Aktif' : 'Tidak Aktif' }}
                    </span>
                    <label class="switch" title="Toggle Status">
                      <input 
                        type="checkbox" 
                        :checked="role.status === 'aktif'"
                        @change="handleToggleStatus(role)"
                      >
                      <span class="slider"></span>
                    </label>
                  </div>
                </td>
                <td class="text-center">
                  <div class="flex items-center justify-center gap-2">
                    <button class="btn-action" @click="goToDetail(role._id)">Detail</button>
                    <button class="btn-action" @click="goToEdit(role._id)">Edit</button>
                  </div>
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
.role-page {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.sidebar {
  width: 250px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid #f0f0f0;
  overflow: hidden;
  height: fit-content;
}

.sidebar-item {
  padding: 16px 20px;
  font-weight: 600;
  color: #4b5563;
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s;
}

.sidebar-item:hover {
  background-color: #f9fafb;
}

.sidebar-item.active {
  background-color: #f3f4f6;
  color: #2d2d2d;
}

.active-indicator {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: #ff4d8d;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #2d2d2d;
  margin: 0;
}

.btn-primary {
  padding: 12px 24px;
  background: #ff4d8d;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background: #e6457e;
}

.table-section {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid #f0f0f0;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
}

.data-table th {
  text-align: left;
  font-weight: 600;
  color: #2d2d2d;
  padding: 16px;
  border-bottom: 2px solid #e5e7eb;
}

.data-table td {
  padding: 20px 16px;
  color: #4b5563;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

/* Switch Button Styles */
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  transition: .3s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 2px;
  bottom: 2px;
  background-color: #ff4d8d;
  transition: .3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #ff4d8d;
  border-color: #ff4d8d;
}

input:checked + .slider:before {
  transform: translateX(20px);
  background-color: #fff;
}

.opacity-60 {
  opacity: 0.6;
}

.btn-action {
  padding: 6px 16px;
  border: 1px solid #ff4d8d;
  color: #ff4d8d;
  background: white;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-action:hover {
  background: #fff0f5;
}
</style>
