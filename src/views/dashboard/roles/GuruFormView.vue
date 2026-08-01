<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isEdit = route.name === 'guru-edit'

const form = ref({
  namaLengkap: '',
  nomorTelepon: '',
  alamat: ''
})

onMounted(() => {
  if (isEdit) {
    // Mock load data
    form.value.namaLengkap = 'Riya Wijaya'
    form.value.nomorTelepon = '08123456789'
    form.value.alamat = 'Jl. Sukarejo'
  }
})

function onBack() {
  router.push('/guru')
}

function onSave() {
  console.log('Saved guru data:', form.value)
  onBack()
}
</script>

<template>
  <div class="guru-form-page">
    <h1 class="page-title">{{ isEdit ? 'Ubah Data Guru' : 'Tambah Data Guru' }}</h1>
    
    <div class="form-container">
      <div class="form-group">
        <label>Nama Lengkap <span class="required">*</span></label>
        <input 
          v-model="form.namaLengkap" 
          type="text" 
          class="input-field" 
        />
      </div>

      <div class="form-group">
        <label>Nomor Telepon</label>
        <input 
          v-model="form.nomorTelepon" 
          type="text" 
          class="input-field" 
        />
      </div>

      <div class="form-group">
        <label>Alamat</label>
        <input 
          v-model="form.alamat" 
          type="text" 
          class="input-field" 
        />
      </div>
    </div>

    <div class="form-actions">
      <button class="btn-outline-pink" @click="onBack">Kembali</button>
      <button class="btn-solid-pink" @click="onSave">Simpan</button>
    </div>
  </div>
</template>

<style scoped>
.guru-form-page {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: white;
  border-radius: 12px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
}

.required {
  color: #ef4444;
}

.input-field {
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
  outline: none;
  transition: border-color 0.2s;
}

.input-field:focus {
  border-color: var(--color-primary);
}

.form-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 40px;
}

.btn-outline-pink {
  padding: 12px 40px;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  background: white;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline-pink:hover {
  background: #fff0f5;
}

.btn-solid-pink {
  padding: 12px 40px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-solid-pink:hover {
  background: #e62c76;
}
</style>
