<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { dashboardService } from '@/services/dashboard.service'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const teacher = ref<any>(null)
const students = ref<any[]>([])

async function loadData() {
  loading.value = true
  try {
    const id = route.params.id as string
    const res = await dashboardService.getTeacherById(id)
    if (res.success && res.data) {
      teacher.value = res.data
      const studentRes = await dashboardService.getStudentsByTeacherId(id)
      if (studentRes.success) {
        students.value = studentRes.data || []
      }
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

function goBack() {
  router.push('/guru')
}
</script>

<template>
  <div class="guru-detail-page">
    <div v-if="loading" class="text-center py-10">Memuat data...</div>
    <div v-else-if="!teacher" class="text-center py-10">Data guru tidak ditemukan.</div>
    <div v-else class="guru-detail-page__content">
      <div class="guru-detail-page__header">
        <h1 class="guru-detail-page__title">Detail Guru</h1>
        <button class="btn-kembali" @click="goBack">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Kembali
        </button>
      </div>

      <div class="guru-detail-section">
        <h2 class="section-title">
          <span class="section-title-dash"></span>
          Identitas Guru
        </h2>
        <div class="identitas-grid">
          <div class="identitas-col">
            <div class="identitas-item">
              <span class="identitas-label">Nama Lengkap</span>
              <span class="identitas-value">{{ teacher.fullName }}</span>
            </div>
            <div class="identitas-item">
              <span class="identitas-label">No. HP/WhatsApp</span>
              <span class="identitas-value">{{ teacher.phone }}</span>
            </div>
            <div class="identitas-item">
              <span class="identitas-label">Alamat</span>
              <span class="identitas-value">{{ teacher.address }}</span>
            </div>
          </div>
          <div class="identitas-col">
            <div class="identitas-item">
              <span class="identitas-label">Jenis Kelamin</span>
              <span class="identitas-value">{{ teacher.gender === 'L' ? 'Laki-laki' : 'Perempuan' }}</span>
            </div>
            <div class="identitas-item">
              <span class="identitas-label">Tanggal Lahir</span>
              <span class="identitas-value">{{ teacher.dateOfBirth }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="guru-detail-section mt-12">
        <h2 class="section-title">
          <span class="section-title-dash"></span>
          Daftar Siswa
        </h2>
        <div class="table-container">
          <table class="student-table">
            <thead>
              <tr>
                <th class="py-4">Nama</th>
                <th class="py-4 text-center">Jenis Kelamin</th>
                <th class="py-4 text-center">Tanggal lahir</th>
                <th class="py-4 text-center">Jenis Terapi</th>
                <th class="py-4 text-center">Nama Lembaga Terapi</th>
                <th class="py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="students.length === 0">
                <td colspan="6" class="text-center py-6">Tidak ada siswa yang terdaftar.</td>
              </tr>
              <tr v-for="student in students" :key="student._id">
                <td class="font-bold text-gray-800">{{ student.fullName }}</td>
                <td class="text-center font-bold text-gray-700">{{ student.gender === 'L' ? 'Laki-laki' : 'Perempuan' }}</td>
                <td class="text-center text-gray-500">{{ student.dateOfBirth }}</td>
                <td class="text-center">
                  <span class="badge" :class="student.jenisTerapi === 'Lembaga' ? 'badge-blue' : 'badge-green'">
                    {{ student.jenisTerapi }}
                  </span>
                </td>
                <td class="text-center text-gray-500">{{ student.lembagaTerapi || '-' }}</td>
                <td class="text-center">
                  <div class="flex items-center justify-center gap-3">
                    <button class="btn-action">Lihat Course</button>
                    <button class="btn-action">Edit</button>
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
.guru-detail-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.guru-detail-page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.guru-detail-page__title {
  font-size: calc(28px * var(--text-scale, 1));
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
  font-size: calc(14px * var(--text-scale, 1));
  cursor: pointer;
  transition: all 0.2s;
}

.btn-kembali:hover {
  background: #fff0f5;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: calc(18px * var(--text-scale, 1));
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

.identitas-grid {
  display: grid;
  grid-template-columns: 300px 300px;
  gap: 4rem;
  padding-left: 28px;
}

.identitas-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.identitas-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.identitas-label {
  color: #6b7280;
  font-size: calc(15px * var(--text-scale, 1));
}

.identitas-value {
  color: #2d2d2d;
  font-weight: 600;
  font-size: calc(16px * var(--text-scale, 1));
}

.table-container {
  overflow-x: auto;
}

.student-table {
  width: 100%;
  border-collapse: collapse;
  font-size: calc(15px * var(--text-scale, 1));
}

.student-table th {
  text-align: left;
  font-weight: 600;
  color: #2d2d2d;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.student-table td {
  padding: 20px 16px;
  color: #4b5563;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

.badge {
  padding: 6px 16px;
  border-radius: 9999px;
  font-size: calc(13px * var(--text-scale, 1));
  font-weight: 600;
}

.badge-blue {
  background-color: #e0f2fe;
  color: #0284c7;
}

.badge-green {
  background-color: #dcfce3;
  color: #16a34a;
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
