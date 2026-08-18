<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { dashboardService } from '@/services/dashboard.service'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => route.name === 'roles-edit')
const loading = ref(false)
const saving = ref(false)
const modules = ref<any[]>([])

const form = ref({
  name: '',
  description: '',
  access: [] as any[]
})

async function loadData() {
  loading.value = true
  try {
    const modRes = await dashboardService.getModules()
    if (modRes.success) {
      modules.value = modRes.data || []
    }

    if (isEdit.value) {
      const id = route.params.id as string
      const res = await dashboardService.getRoleById(id)
      if (res.success && res.data) {
        form.value.name = res.data.name || ''
        form.value.description = res.data.description || ''
        // Clone access so we don't mutate state directly before saving
        form.value.access = res.data.access ? JSON.parse(JSON.stringify(res.data.access)) : []
      }
    } else {
      // Setup default access for new role based on modules
      form.value.access = modules.value.map(m => ({
        moduleId: m.id,
        moduleName: m.name,
        canView: false,
        canAdd: false,
        canEdit: false,
        canDelete: false,
        canDetail: false
      }))
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
      await dashboardService.updateRole(id, form.value)
    } else {
      await dashboardService.createRole(form.value)
    }
    router.push('/manajemen-pengguna/roles')
  } finally {
    saving.value = false
  }
}

function goBack() {
  router.push('/manajemen-pengguna/roles')
}
</script>

<template>
  <div class="role-form-page">
    <div class="page-header">
      <h1 class="page-title">
        {{ isEdit ? 'Ubah Data Role' : 'Tambah Role Baru' }}
      </h1>
    </div>

    <div v-if="loading" class="text-center py-10">Memuat data...</div>
    
    <div v-else class="form-section">
      <form @submit.prevent="handleSubmit">
        <div class="form-group mb-6">
          <label>Nama Role</label>
          <input 
            v-model="form.name"
            type="text" 
            required 
            placeholder="Contoh: Admin"
          />
        </div>

        <div class="form-group mb-8">
          <label>Deskripsi</label>
          <textarea 
            v-model="form.description"
            rows="4" 
            placeholder="deskripsi"
          ></textarea>
        </div>

        <div class="access-section">
          <label class="access-label">Pengaturan Akses</label>
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
                <tr v-for="(acc, index) in form.access" :key="acc.moduleId">
                  <td class="font-bold text-gray-800 pl-4">{{ acc.moduleName }}</td>
                  <td class="text-center">
                    <label class="custom-checkbox">
                      <input type="checkbox" v-model="form.access[index].canView">
                      <span class="checkmark"></span>
                    </label>
                  </td>
                  <td class="text-center">
                    <label class="custom-checkbox">
                      <input type="checkbox" v-model="form.access[index].canAdd">
                      <span class="checkmark"></span>
                    </label>
                  </td>
                  <td class="text-center">
                    <label class="custom-checkbox">
                      <input type="checkbox" v-model="form.access[index].canEdit">
                      <span class="checkmark"></span>
                    </label>
                  </td>
                  <td class="text-center">
                    <label class="custom-checkbox">
                      <input type="checkbox" v-model="form.access[index].canDelete">
                      <span class="checkmark"></span>
                    </label>
                  </td>
                  <td class="text-center">
                    <label class="custom-checkbox">
                      <input type="checkbox" v-model="form.access[index].canDetail">
                      <span class="checkmark"></span>
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>
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
.role-form-page {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: calc(28px * var(--text-scale, 1));
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
  font-size: calc(14px * var(--text-scale, 1));
  font-weight: 700;
  color: #374151;
}

.form-group input,
.form-group textarea {
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: calc(14px * var(--text-scale, 1));
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #ff4d8d;
}

.access-section {
  margin-top: 1rem;
}

.access-label {
  display: block;
  font-size: calc(14px * var(--text-scale, 1));
  font-weight: 700;
  color: #374151;
  margin-bottom: 12px;
}

.table-container {
  overflow-x: auto;
  border-top: 1px solid #e5e7eb;
}

.access-table {
  width: 100%;
  border-collapse: collapse;
  font-size: calc(14px * var(--text-scale, 1));
}

.access-table th {
  font-weight: 700;
  color: #374151;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.access-table td {
  padding: 20px 16px;
  color: #4b5563;
}

/* Custom Checkbox */
.custom-checkbox {
  display: inline-block;
  position: relative;
  width: 22px;
  height: 22px;
  cursor: pointer;
  user-select: none;
}

.custom-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 22px;
  width: 22px;
  background-color: #fff;
  border: 1px solid #ff4d8d;
  border-radius: 4px;
  transition: all 0.2s;
}

.custom-checkbox:hover input ~ .checkmark {
  background-color: #fff0f5;
}

.custom-checkbox input:checked ~ .checkmark {
  background-color: #ff4d8d;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.custom-checkbox input:checked ~ .checkmark:after {
  display: block;
}

.custom-checkbox .checkmark:after {
  left: 7px;
  top: 3px;
  width: 6px;
  height: 12px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
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
  font-size: calc(15px * var(--text-scale, 1));
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
  font-size: calc(15px * var(--text-scale, 1));
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
