<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { dashboardService } from '@/services/dashboard.service'

const loading = ref(true)
const students = ref<any[]>([])
const searchQuery = ref('')
const showConfirmModal = ref(false)
const studentToDeactivate = ref<any>(null)

async function loadData() {
  loading.value = true
  try {
    const res = await dashboardService.getStudents()
    if (res.success) {
      students.value = res.data || []
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

const filteredStudents = computed(() => {
  let list = students.value
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter((s) => s.fullName.toLowerCase().includes(q))
  }
  return list
})

async function handleToggleStatus(student: any) {
  const newStatus = student.status === 'aktif' ? 'nonaktif' : 'aktif'
  await dashboardService.updateStudentStatus(student._id, newStatus)
  await loadData()
}
</script>

<template>
  <div class="siswa-page">
    <div class="siswa-page__header">
      <h1 class="siswa-page__title">Daftar Siswa</h1>
      <div class="siswa-page__search">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari Data Siswa"
          class="siswa-page__search-input"
        />
      </div>
    </div>

    <div class="siswa-page__table-section">
      <div class="siswa-page__table-container">
        <table class="siswa-page__table">
          <thead>
            <tr>
              <th class="py-4">Nama</th>
              <th class="py-4 text-center">Jenis Kelamin</th>
              <th class="py-4 text-center">Tanggal lahir</th>
              <th class="py-4 text-center">Nama Wali</th>
              <th class="py-4 text-center leading-tight">Guru<br>Pendamping</th>
              <th class="py-4 text-center">Status Siswa</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="text-center py-8">Memuat data...</td>
            </tr>
            <tr v-else-if="filteredStudents.length === 0">
              <td colspan="6" class="text-center py-8">Tidak ada data siswa yang ditemukan.</td>
            </tr>
            <tr v-for="student in filteredStudents" :key="student._id" :class="{'opacity-60': student.status === 'nonaktif'}">
              <td class="font-bold text-gray-800">{{ student.fullName }}</td>
              <td class="text-center font-bold text-gray-700">{{ student.gender === 'L' ? 'Laki-laki' : 'Perempuan' }}</td>
              <td class="text-center text-gray-500">{{ student.dateOfBirth }}</td>
              <td class="text-center text-gray-500">{{ student.parentName }}</td>
              <td class="text-center text-gray-500">{{ student.teacherName }}</td>
              <td class="text-center">
                <div class="flex items-center justify-center gap-3">
                  <span class="text-sm font-bold text-gray-900">
                    {{ student.status === 'aktif' ? 'Aktif' : 'Tidak Aktif' }}
                  </span>
                  <label class="siswa-page__switch" title="Toggle Status">
                    <input 
                      type="checkbox" 
                      :checked="student.status === 'aktif'"
                      @change="handleToggleStatus(student)"
                    >
                    <span class="siswa-page__slider"></span>
                  </label>
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
.siswa-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.siswa-page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.siswa-page__title {
  font-size: calc(28px * var(--text-scale, 1));
  font-weight: 700;
  color: #2d2d2d;
  margin: 0;
}

.siswa-page__search-input {
  padding: 12px 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  width: 300px;
  font-size: calc(14px * var(--text-scale, 1));
  outline: none;
  transition: border-color 0.2s;
  background-color: #f9fafb;
}

.siswa-page__search-input:focus {
  border-color: #ff4d8d;
  background-color: #ffffff;
}

.siswa-page__table-section {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid #f0f0f0;
}

.siswa-page__table-container {
  overflow-x: auto;
}

.siswa-page__table {
  width: 100%;
  border-collapse: collapse;
  font-size: calc(15px * var(--text-scale, 1));
}

.siswa-page__table th {
  text-align: left;
  font-weight: 600;
  color: #2d2d2d;
  padding: 16px;
  border-bottom: 2px solid #e5e7eb;
}

.siswa-page__table td {
  padding: 20px 16px;
  color: #4b5563;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

.siswa-page__table tbody tr:last-child td {
  border-bottom: none;
}

/* Switch Button Styles */
.siswa-page__switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.siswa-page__switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.siswa-page__slider {
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

.siswa-page__slider:before {
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

input:checked + .siswa-page__slider {
  background-color: #ff4d8d;
  border-color: #ff4d8d;
}

input:checked + .siswa-page__slider:before {
  transform: translateX(20px);
  background-color: #fff;
}

.opacity-60 {
  opacity: 0.6;
}
</style>
