<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { courseService } from '@/services/course.service'

const router = useRouter()
const route = useRoute()

const jenisModul = ref<'materi' | 'assessment'>('materi')
const form = ref({
  nama: '',
  deskripsi: '',
  tambahLatihan: false,
  poinMinimal: '',
  kategoriSoal: [] as string[]
})

const kategoriOptions = [
  { label: 'Huruf', value: 'huruf' },
  { label: 'Kata', value: 'kata' },
  { label: 'Kalimat', value: 'kalimat' },
  { label: 'Warna', value: 'warna' },
  { label: 'Objek', value: 'objek' },
]

async function handleSubmit() {
  const courseId = route.params.courseId as string
  
  if (jenisModul.value === 'materi') {
    await courseService.addModulToCourse(courseId, {
      label: form.value.nama,
      description: form.value.deskripsi,
      hasLatihan: form.value.tambahLatihan
    })
  } else {
    await courseService.addAssessmentToCourse(courseId, {
      title: form.value.nama,
      description: form.value.deskripsi,
      poinMinimal: Number(form.value.poinMinimal),
      skills: form.value.kategoriSoal
    })
  }
  
  // Navigate back to course detail
  router.push(`/course/${courseId}`)
}
</script>

<template>
  <div class="modul-form-page">
    <div class="page-header">
      <h1 class="page-title">Tambah Modul Baru</h1>
    </div>

    <form class="form-section" @submit.prevent="handleSubmit">
      <div class="form-row">
        <div class="form-group flex-1">
          <label>Nama Modul</label>
          <input 
            v-model="form.nama"
            type="text" 
            required 
            placeholder="Contoh: Belajar Membaca"
          />
        </div>
        <div class="form-group flex-1">
          <label>Deskripsi Singkat</label>
          <input 
            v-model="form.deskripsi"
            type="text" 
            required 
            placeholder="Contoh: Modul pembelajaran huruf"
          />
        </div>
      </div>

      <div class="form-group mb-6">
        <label>Jenis Modul</label>
        <div class="radio-group">
          <label class="radio-btn" :class="{ 'radio-active': jenisModul === 'materi' }">
            <input type="radio" v-model="jenisModul" value="materi" name="jenisModul" />
            <span class="radio-custom"></span>
            Materi Pembelajaran
          </label>
          <label class="radio-btn" :class="{ 'radio-active': jenisModul === 'assessment' }">
            <input type="radio" v-model="jenisModul" value="assessment" name="jenisModul" />
            <span class="radio-custom"></span>
            Soal Assessment
          </label>
        </div>
      </div>

      <template v-if="jenisModul === 'materi'">
        <div class="form-group mb-6">
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.tambahLatihan" />
            <span class="checkbox-custom"></span>
            Tambahkan Soal Latihan
          </label>
        </div>
      </template>

      <template v-else>
        <div class="form-group mb-6">
          <label>Poin Minimal</label>
          <input 
            v-model="form.poinMinimal"
            type="number" 
            required 
            placeholder="Contoh: 90"
          />
        </div>

        <div class="form-group mb-6">
          <label>Kategori Soal</label>
          <div class="checkbox-group">
            <label 
              v-for="opt in kategoriOptions" 
              :key="opt.value" 
              class="checkbox-btn" 
              :class="{ 'checkbox-active': form.kategoriSoal.includes(opt.value) }"
            >
              <input type="checkbox" v-model="form.kategoriSoal" :value="opt.value" />
              <span class="checkbox-custom-square"></span>
              {{ opt.label }}
            </label>
          </div>
        </div>
      </template>

      <div class="form-actions">
        <button type="button" class="btn-kembali" @click="router.back()">Kembali</button>
        <button type="submit" class="btn-selanjutnya">Selanjutnya</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.modul-form-page {
  padding: 2rem 5%;
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  min-height: 100vh;
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

.form-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.flex-1 {
  flex: 1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 15px;
  font-weight: 700;
  color: #374151;
}

.form-group input[type="text"],
.form-group input[type="number"] {
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
  width: 100%;
  color: #2d2d2d;
}

.form-group input[type="text"]:focus,
.form-group input[type="number"]:focus {
  border-color: #ff4d8d;
}

.form-group input::placeholder {
  color: #9ca3af;
}

.mb-6 { margin-bottom: 1.5rem; }

/* Custom Radio Group */
.radio-group {
  display: flex;
  gap: 1.5rem;
}

.radio-btn {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  color: #4b5563;
  transition: all 0.2s;
  position: relative;
}

.radio-btn input[type="radio"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.radio-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #e5e7eb;
  border-radius: 50%;
  position: relative;
  transition: all 0.2s;
}

.radio-active {
  border-color: #ff4d8d;
}

.radio-active .radio-custom {
  border-color: #ff4d8d;
}

.radio-active .radio-custom::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background-color: #ff4d8d;
  border-radius: 50%;
}

/* Custom Checkbox Simple */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-weight: 600;
  color: #2d2d2d;
  font-size: 15px;
}

.checkbox-label input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #e5e7eb;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s;
}

.checkbox-label input:checked ~ .checkbox-custom {
  background-color: #ff4d8d;
  border-color: #ff4d8d;
}

.checkbox-label input:checked ~ .checkbox-custom::after {
  content: "";
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* Custom Checkbox Group (For Categories) */
.checkbox-group {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.checkbox-btn {
  flex: 1;
  min-width: 140px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  color: #4b5563;
  transition: all 0.2s;
  position: relative;
}

.checkbox-btn input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkbox-custom-square {
  width: 20px;
  height: 20px;
  border: 2px solid #e5e7eb;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s;
}

.checkbox-active {
  border-color: #ff4d8d;
}

.checkbox-active .checkbox-custom-square {
  border-color: #ff4d8d;
}

.checkbox-active .checkbox-custom-square::after {
  content: "";
  position: absolute;
  left: 5px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid #ff4d8d;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* Actions */
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

.btn-selanjutnya {
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

.btn-selanjutnya:hover {
  background: #e6457e;
}
</style>
