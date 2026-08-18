<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { dashboardService } from '@/services/dashboard.service'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => route.name === 'lembaga-edit')
const loading = ref(false)
const saving = ref(false)

const form = ref({
  name: '',
  email: '',
  phone: '',
  address: ''
})

async function loadData() {
  if (isEdit.value) {
    loading.value = true
    try {
      const id = route.params.id as string
      const res = await dashboardService.getInstitutionById(id)
      if (res.success && res.data) {
        form.value = {
          name: res.data.name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          address: res.data.address || ''
        }
      }
    } finally {
      loading.value = false
    }
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
      await dashboardService.updateInstitution(id, form.value)
    } else {
      await dashboardService.createInstitution(form.value)
    }
    router.push('/lembaga')
  } finally {
    saving.value = false
  }
}

function goBack() {
  router.push('/lembaga')
}
</script>

<template>
  <div class="lembaga-form-page">
    <div class="lembaga-form-page__header">
      <h1 class="lembaga-form-page__title">
        {{ isEdit ? 'Ubah Lembaga' : 'Tambah Lembaga Baru' }}
      </h1>
    </div>

    <div v-if="loading" class="text-center py-10">Memuat data...</div>
    
    <div v-else class="lembaga-form-section">
      <form @submit.prevent="handleSubmit" class="form-grid">
        <div class="form-group">
          <label>Nama Lembaga</label>
          <input 
            v-model="form.name"
            type="text" 
            required 
            placeholder="Contoh: Lembaga A"
          />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input 
            v-model="form.email"
            type="email" 
            required 
            placeholder="Contoh: telkomuniversity@telkom.ac.id"
          />
        </div>

        <div class="form-group">
          <label>Nomor Telepon</label>
          <input 
            v-model="form.phone"
            type="text" 
            required 
            placeholder="Contoh: 081231321312"
          />
        </div>

        <div class="form-group">
          <label>Alamat</label>
          <input 
            v-model="form.address"
            type="text" 
            required 
            placeholder="Contoh: Jl. Ketintang"
          />
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
.lembaga-form-page {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.lembaga-form-page__header {
  margin-bottom: 3rem;
}

.lembaga-form-page__title {
  font-size: calc(28px * var(--text-scale, 1));
  font-weight: 700;
  color: #2d2d2d;
  margin: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: calc(14px * var(--text-scale, 1));
  font-weight: 600;
  color: #374151;
}

.form-group input {
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: calc(14px * var(--text-scale, 1));
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #ff4d8d;
}

.form-actions {
  grid-column: 1 / -1;
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
</style>
