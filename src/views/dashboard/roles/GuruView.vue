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
</script>

<template>
  <div class="guru-page">
    <div class="guru-page__header">
      <h1 class="guru-page__title">Daftar Guru</h1>
      <div class="guru-page__search">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari Data Guru"
          class="guru-page__search-input"
        />
      </div>
    </div>

    <div class="guru-page__table-section">
      <div class="guru-page__table-container">
        <table class="guru-page__table">
          <thead>
            <tr>
              <th class="py-4">Nama Lengkap</th>
              <th class="py-4 text-center">Jenis Kelamin</th>
              <th class="py-4 text-center">No. HP</th>
              <th class="py-4 text-center">Alamat</th>
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
              <td class="text-center font-bold text-gray-700">{{ teacher.gender === 'L' ? 'Laki-laki' : 'Perempuan' }}</td>
              <td class="text-center text-gray-500">{{ teacher.phone }}</td>
              <td class="text-center text-gray-500">{{ teacher.address }}</td>
              <td class="text-center">
                <button 
                  @click="goToDetail(teacher._id)"
                  class="px-6 py-2 text-sm font-semibold border-2 border-pink-500 text-pink-500 rounded-full hover:bg-pink-50 transition-colors"
                >
                  Detail
                </button>
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
  text-align: left;
  font-weight: 600;
  color: #2d2d2d;
  padding: 16px;
  border-bottom: 2px solid #e5e7eb;
}

.guru-page__table td {
  padding: 20px 16px;
  color: #4b5563;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

.guru-page__table tbody tr:last-child td {
  border-bottom: none;
}
</style>
