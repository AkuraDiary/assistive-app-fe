<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { dashboardService } from '@/services/dashboard.service'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(true)
const teachers = ref<any[]>([])
const searchQuery = ref('')

async function loadData() {
  loading.value = true
  try {
    const res = await dashboardService.getTeachers()
    if (res.success) {
      teachers.value = res.data || []
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

const filteredTeachers = computed(() => {
  let list = teachers.value
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter((t) => t.fullName.toLowerCase().includes(q))
  }
  return list
})

function goToDetail(id: string) {
  router.push(`/guru/${id}`)
}

function goToEdit(id: string) {
  router.push(`/guru/${id}/edit`)
}

function goToCreate() {
  router.push('/guru/create')
}
</script>

<template>
  <div class="guru-page">
    <div class="guru-page__header">
      <h1 class="guru-page__title">Daftar Guru</h1>
      <div class="guru-page__actions">
        <div class="guru-page__search">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari Data Guru"
            class="guru-page__search-input"
          />
        </div>
        <button class="btn-solid-pink" @click="goToCreate">Tambah Data Guru</button>
      </div>
    </div>

    <div class="guru-page__table-section">
      <div class="guru-page__table-container">
        <table class="guru-page__table">
          <thead>
            <tr>
              <th class="py-4 text-left">Nama</th>
              <th class="py-4 text-center">Nomor Telepon</th>
              <th class="py-4 text-center">Alamat</th>
              <th class="py-4 text-center">Status Guru</th>
              <th class="py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="5" class="text-center py-8">Memuat data...</td>
            </tr>
            <tr v-else-if="filteredTeachers.length === 0">
              <td colspan="5" class="text-center py-8">Tidak ada data guru yang ditemukan.</td>
            </tr>
            <tr v-for="teacher in filteredTeachers" :key="teacher._id">
              <td class="font-bold text-gray-800">{{ teacher.fullName }}</td>
              <td class="text-center text-gray-700 font-bold">{{ teacher.phone }}</td>
              <td class="text-center text-gray-500">{{ teacher.address }}</td>
              <td class="text-center">
                <div class="status-toggle-wrapper">
                  <span class="status-text">{{
                    teacher.status === 'Aktif' || !teacher.status ? 'Aktif' : 'Tidak Aktif'
                  }}</span>
                  <label class="switch">
                    <input
                      type="checkbox"
                      :checked="teacher.status === 'Aktif' || !teacher.status"
                    />
                    <span class="slider round"></span>
                  </label>
                </div>
              </td>
              <td class="text-center">
                <div class="action-buttons">
                  <button @click="goToDetail(teacher._id)" class="btn-outline-pink-sm">
                    Detail
                  </button>
                  <button @click="goToEdit(teacher._id)" class="btn-outline-pink-sm">Edit</button>
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
.guru-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.guru-page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.guru-page__title {
  font-size: 28px;
  font-weight: 700;
  min-width: 250px;
  color: #2d2d2d;
  margin: 0;
}

.guru-page__search-input {
  padding: 12px 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  width: 300px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  background-color: #f9fafb;
}

.guru-page__search-input:focus {
  border-color: #ff4d8d;
  background-color: #ffffff;
}

.guru-page__table-section {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid #f0f0f0;
}

.guru-page__table-container {
  overflow-x: auto;
}

.guru-page__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
}

.guru-page__table th {
  border-bottom: 1px solid #f0f0f0;
  color: #6b7280;
  font-weight: 600;
  padding-bottom: 16px;
}

.guru-page__table td {
  padding: 16px 0;
  border-bottom: 1px solid #f9fafb;
}

.guru-page__table tr:last-child td {
  border-bottom: none;
}

/* Actions */
.guru-page__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.btn-solid-pink {
  padding: 12px 24px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-solid-pink:hover {
  background: #e62c76;
}

.btn-outline-pink-sm {
  padding: 4px 16px;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  background: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline-pink-sm:hover {
  background: #fff0f5;
}

.action-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* Toggle Switch */
.status-toggle-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.status-text {
  font-size: 12px;
  font-weight: 700;
  color: #111827;
}

.switch {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
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
  background-color: #e5e7eb;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: var(--color-primary);
}

input:checked + .slider:before {
  transform: translateX(16px);
}

.slider.round {
  border-radius: 20px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
