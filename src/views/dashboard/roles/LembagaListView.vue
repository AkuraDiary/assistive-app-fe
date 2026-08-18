<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { dashboardService } from '@/services/dashboard.service'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(true)
const institutions = ref<any[]>([])
const searchQuery = ref('')

async function loadData() {
  loading.value = true
  try {
    const res = await dashboardService.getInstitutions()
    if (res.success) {
      institutions.value = res.data || []
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

const filteredInstitutions = computed(() => {
  let list = institutions.value
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter((i) => i.name.toLowerCase().includes(q))
  }
  return list
})

async function handleToggleStatus(institution: any) {
  await dashboardService.toggleInstitutionStatus(institution._id)
  await loadData()
}

function goToCreate() {
  router.push('/lembaga/create')
}

function goToDetail(id: string) {
  router.push(`/lembaga/${id}`)
}

function goToEdit(id: string) {
  router.push(`/lembaga/${id}/edit`)
}
</script>

<template>
  <div class="lembaga-page">
    <div class="lembaga-page__header">
      <h1 class="lembaga-page__title">Daftar Lembaga</h1>
      <div class="lembaga-page__actions">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari Data Lembaga"
          class="lembaga-page__search-input"
        />
        <button class="btn-primary" @click="goToCreate">+ Tambah Lembaga</button>
      </div>
    </div>

    <div class="lembaga-page__table-section">
      <div class="lembaga-page__table-container">
        <table class="lembaga-page__table">
          <thead>
            <tr>
              <th class="py-4">Nama Lembaga</th>
              <th class="py-4 text-center">Email</th>
              <th class="py-4 text-center">Alamat</th>
              <th class="py-4 text-center">Nomor Telepon</th>
              <th class="py-4 text-center">Status Aktif</th>
              <th class="py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="text-center py-8">Memuat data...</td>
            </tr>
            <tr v-else-if="filteredInstitutions.length === 0">
              <td colspan="6" class="text-center py-8">Tidak ada data lembaga yang ditemukan.</td>
            </tr>
            <tr v-for="inst in filteredInstitutions" :key="inst._id" :class="{'opacity-60': inst.status === 'nonaktif'}">
              <td class="font-bold text-gray-800">{{ inst.name }}</td>
              <td class="text-center font-bold text-gray-700">{{ inst.email }}</td>
              <td class="text-center text-gray-500">{{ inst.address }}</td>
              <td class="text-center text-gray-500">{{ inst.phone }}</td>
              <td class="text-center">
                <div class="flex items-center justify-center gap-3">
                  <span class="text-sm font-bold text-gray-900">
                    {{ inst.status === 'aktif' ? 'Aktif' : 'Tidak Aktif' }}
                  </span>
                  <label class="lembaga-page__switch" title="Toggle Status">
                    <input 
                      type="checkbox" 
                      :checked="inst.status === 'aktif'"
                      @change="handleToggleStatus(inst)"
                    >
                    <span class="lembaga-page__slider"></span>
                  </label>
                </div>
              </td>
              <td class="text-center">
                <div class="flex items-center justify-center gap-2">
                  <button class="btn-action" @click="goToEdit(inst._id)">Edit</button>
                  <button class="btn-action" @click="goToDetail(inst._id)">Detail</button>
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
.lembaga-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.lembaga-page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lembaga-page__title {
  font-size: calc(28px * var(--text-scale, 1));
  font-weight: 700;
  color: #2d2d2d;
  margin: 0;
}

.lembaga-page__actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.lembaga-page__search-input {
  padding: 12px 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  width: 300px;
  font-size: calc(14px * var(--text-scale, 1));
  outline: none;
  transition: border-color 0.2s;
  background-color: #f9fafb;
}

.lembaga-page__search-input:focus {
  border-color: #ff4d8d;
  background-color: #ffffff;
}

.btn-primary {
  padding: 12px 24px;
  background: #ff4d8d;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: calc(14px * var(--text-scale, 1));
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background: #e6457e;
}

.lembaga-page__table-section {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid #f0f0f0;
}

.lembaga-page__table-container {
  overflow-x: auto;
}

.lembaga-page__table {
  width: 100%;
  border-collapse: collapse;
  font-size: calc(15px * var(--text-scale, 1));
}

.lembaga-page__table th {
  text-align: left;
  font-weight: 600;
  color: #2d2d2d;
  padding: 16px;
  border-bottom: 2px solid #e5e7eb;
}

.lembaga-page__table td {
  padding: 20px 16px;
  color: #4b5563;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

.lembaga-page__table tbody tr:last-child td {
  border-bottom: none;
}

/* Switch Button Styles */
.lembaga-page__switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.lembaga-page__switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.lembaga-page__slider {
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

.lembaga-page__slider:before {
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

input:checked + .lembaga-page__slider {
  background-color: #ff4d8d;
  border-color: #ff4d8d;
}

input:checked + .lembaga-page__slider:before {
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
  font-size: calc(13px * var(--text-scale, 1));
  cursor: pointer;
  transition: all 0.2s;
}

.btn-action:hover {
  background: #fff0f5;
}
</style>
