<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { dashboardService } from '@/services/dashboard.service'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const institution = ref<any>(null)
const teachers = ref<any[]>([])
const students = ref<any[]>([])

async function loadData() {
  loading.value = true
  try {
    const id = route.params.id as string
    const res = await dashboardService.getInstitutionById(id)
    if (res.success && res.data) {
      institution.value = res.data
      
      // Load mock teachers and students for this institution
      const teacherRes = await dashboardService.getTeachers()
      if (teacherRes.success) {
        teachers.value = teacherRes.data || []
      }
      
      const studentRes = await dashboardService.getStudents()
      if (studentRes.success) {
        students.value = (studentRes.data || []).filter(s => s.lembagaTerapi === institution.value.name)
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
  router.push('/lembaga')
}
</script>

<template>
  <div class="lembaga-detail-page">
    <div v-if="loading" class="text-center py-10">Memuat data...</div>
    <div v-else-if="!institution" class="text-center py-10">Data lembaga tidak ditemukan.</div>
    <div v-else class="lembaga-detail-page__content">
      <div class="lembaga-detail-page__header">
        <h1 class="lembaga-detail-page__title">Detail Lembaga</h1>
        <button class="btn-kembali" @click="goBack">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Kembali
        </button>
      </div>

      <div class="lembaga-detail-section">
        <h2 class="section-title">
          <span class="section-title-dash"></span>
          Identitas Lembaga
        </h2>
        <div class="identitas-grid">
          <div class="identitas-col">
            <div class="identitas-item">
              <span class="identitas-label">Nama Lengkap</span>
              <span class="identitas-value">{{ institution.name }}</span>
            </div>
            <div class="identitas-item">
              <span class="identitas-label">Email</span>
              <span class="identitas-value">{{ institution.email }}</span>
            </div>
            <div class="identitas-item">
              <span class="identitas-label">Nomor Telepon</span>
              <span class="identitas-value">{{ institution.phone }}</span>
            </div>
            <div class="identitas-item">
              <span class="identitas-label">Alamat</span>
              <span class="identitas-value">{{ institution.address }}</span>
            </div>
            <div class="identitas-item">
              <span class="identitas-label">Status Aktif</span>
              <div>
                <span class="badge" :class="institution.status === 'aktif' ? 'badge-green' : 'badge-red'">
                  {{ institution.status === 'aktif' ? 'Aktif' : 'Nonaktif' }}
                </span>
              </div>
            </div>
            <div class="identitas-item">
              <span class="identitas-label">Username Akun</span>
              <div class="flex items-center gap-4">
                <span class="identitas-value">{{ institution.username }}</span>
                <a href="#" class="link-detail-akun">Lihat Detail Akun →</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lembaga-detail-section mt-12">
        <h2 class="section-title">
          <span class="section-title-dash"></span>
          Daftar Guru
        </h2>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th class="py-4">Nama</th>
                <th class="py-4 text-center">Nomor Telepon</th>
                <th class="py-4 text-center">Alamat</th>
                <th class="py-4 text-center">Status Guru</th>
                <th class="py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="teachers.length === 0">
                <td colspan="5" class="text-center py-6">Tidak ada guru.</td>
              </tr>
              <tr v-for="teacher in teachers" :key="teacher._id">
                <td class="font-bold text-gray-800">{{ teacher.fullName }}</td>
                <td class="text-center text-gray-500">{{ teacher.phone }}</td>
                <td class="text-center text-gray-500">{{ teacher.address }}</td>
                <td class="text-center">
                  <span class="badge badge-green">Aktif</span>
                </td>
                <td class="text-center">
                  <div class="flex items-center justify-center gap-2">
                    <button class="btn-action">Detail</button>
                    <button class="btn-action">Edit</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="lembaga-detail-section mt-12">
        <h2 class="section-title">
          <span class="section-title-dash"></span>
          Daftar Siswa
        </h2>
        <div class="table-container">
          <table class="data-table">
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
                <td colspan="6" class="text-center py-6">Tidak ada siswa yang terdaftar di lembaga ini.</td>
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
                  <div class="flex items-center justify-center gap-2">
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
.lembaga-detail-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.lembaga-detail-page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.lembaga-detail-page__title {
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

.identitas-grid {
  background: #fff;
  padding: 0;
  max-width: 800px;
}

.identitas-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  font-weight: 600;
  font-size: 16px;
}

.link-detail-akun {
  color: #3b82f6;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
}

.link-detail-akun:hover {
  text-decoration: underline;
}

.table-container {
  overflow-x: auto;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid #f0f0f0;
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

.badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 9999px;
  font-size: 13px;
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

.badge-red {
  background-color: #fee2e2;
  color: #ef4444;
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
