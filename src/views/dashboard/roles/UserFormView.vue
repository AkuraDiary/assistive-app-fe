<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { dashboardService } from '@/services/dashboard.service'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => route.name === 'users-edit')
const loading = ref(false)
const saving = ref(false)
const roles = ref<any[]>([])

const form = ref({
  name: '',
  username: '',
  email: '',
  password: '',
  roleId: ''
})

async function loadData() {
  loading.value = true
  try {
    const rolesRes = await dashboardService.getRoles()
    if (rolesRes.success) {
      roles.value = rolesRes.data || []
    }

    if (isEdit.value) {
      const id = route.params.id as string
      const res = await dashboardService.getUserById(id)
      if (res.success && res.data) {
        form.value.name = res.data.name || ''
        form.value.username = res.data.username || ''
        form.value.email = res.data.email || ''
        form.value.roleId = res.data.roleId || ''
        // Password remains empty unless user wants to change it
      }
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

async function handleSubmit() {
  saving.value = true
  try {
    if (isEdit.value) {
      const id = route.params.id as string
      await dashboardService.updateUser(id, form.value)
    } else {
      await dashboardService.createUser(form.value)
    }
    router.push('/manajemen-pengguna/users')
  } finally {
    saving.value = false
  }
}

function goBack() {
  router.push('/manajemen-pengguna/users')
}
</script>

<template>
  <div class="user-form-page">
    <div class="page-header">
      <h1 class="page-title">
        {{ isEdit ? 'Ubah Data Akun' : 'Tambah Akun Baru' }}
      </h1>
    </div>

    <div v-if="loading" class="text-center py-10">Memuat data...</div>
    
    <div v-else class="form-section">
      <form @submit.prevent="handleSubmit">
        <div class="form-group mb-6">
          <label>Nama <span class="text-red-500">*</span></label>
          <input 
            v-model="form.name"
            type="text" 
            required 
            placeholder="Contoh: Admin"
          />
        </div>

        <div class="form-group mb-6">
          <label>Username <span class="text-red-500">*</span></label>
          <input 
            v-model="form.username"
            type="text" 
            required 
            placeholder="Contoh: admin"
          />
        </div>

        <div class="form-group mb-6">
          <label>Email <span class="text-red-500">*</span></label>
          <input 
            v-model="form.email"
            type="email" 
            required 
            placeholder="Contoh: admin@gmail.com"
          />
        </div>

        <div class="form-group mb-6">
          <label>Password <span v-if="!isEdit" class="text-red-500">*</span></label>
          <input 
            v-model="form.password"
            type="password" 
            :required="!isEdit" 
            :placeholder="isEdit ? 'Masukkan password baru jika ingin mengganti password' : 'Masukkan password'"
          />
        </div>

        <div class="form-group mb-8">
          <label>Role <span class="text-red-500">*</span></label>
          <div class="select-wrapper">
            <select v-model="form.roleId" required>
              <option value="" disabled selected>Pilih</option>
              <option v-for="role in roles" :key="role._id" :value="role._id">
                {{ role.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-kembali" @click="goBack">Kembali</button>
          <button type="submit" class="btn-simpan" :disabled="saving">
            {{ saving ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.user-form-page {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 3rem;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #2d2d2d;
  margin: 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 700;
  color: #374151;
}

.text-red-500 {
  color: #ef4444;
}

.form-group input,
.form-group select {
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
  width: 100%;
  color: #2d2d2d;
  background-color: white;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #ff4d8d;
}

.form-group input::placeholder {
  color: #9ca3af;
}

/* Custom Select styling to add the pink arrow */
.select-wrapper {
  position: relative;
  width: 100%;
}

.select-wrapper select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
}

.select-wrapper::after {
  content: "";
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 0; 
  height: 0; 
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #ff4d8d;
  pointer-events: none;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 4rem;
}

.btn-kembali {
  padding: 12px 40px;
  border: 1px solid #ff4d8d;
  color: #ff4d8d;
  background: white;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-kembali:hover {
  background: #fff0f5;
}

.btn-simpan {
  padding: 12px 40px;
  background: #ff4d8d;
  color: white;
  border: none;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-simpan:hover:not(:disabled) {
  background: #e6457e;
}

.btn-simpan:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.mb-6 { margin-bottom: 1.5rem; }
.mb-8 { margin-bottom: 2rem; }
</style>
