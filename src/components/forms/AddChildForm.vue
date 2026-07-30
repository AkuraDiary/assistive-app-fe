<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AddChildPayload, JenisKelamin, JenisTerapi, Lembaga } from '@/types/child.types'
import { Pencil } from 'lucide-vue-next'
const props = defineProps<{
  lembagaList: Lembaga[]
  loading?: boolean
  initialData?: Partial<AddChildPayload> // ← add this
  showAvatarEdit?: boolean
  childAvatarUrl?: string
}>()

const emit = defineEmits<{
  (e: 'submit', payload: AddChildPayload): void
  (e: 'cancel'): void
  (e: 'avatar-change', file: File): void // ← new
}>()
const fullName = ref(props.initialData?.fullName ?? '')
const dateOfBirth = ref(props.initialData?.dateOfBirth ?? '')
const address = ref(props.initialData?.address ?? '')
const gender = ref<JenisKelamin | undefined>(props.initialData?.gender)
const therapyType = ref<JenisTerapi>(props.initialData?.therapyType ?? 'individu')
const applicationStatus = ref(props.initialData?.applicationStatus ?? 'menunggu')
const hasDiagnosis = ref<boolean | undefined>(props.initialData?.hasDiagnosis)
const institutionId = ref(props.initialData?.institutionId ?? '')
const showTooltip = ref(false)

const isLembaga = computed(() => therapyType.value === 'lembaga_sekolah')

function handleSubmit() {
  if (!fullName.value || !dateOfBirth.value) return
  if (isLembaga.value && !institutionId.value) return
  if (hasDiagnosis.value === undefined) return

  const payload: AddChildPayload = {
    fullName: fullName.value,
    dateOfBirth: dateOfBirth.value,
    address: address.value || undefined,
    gender: gender.value || undefined,
    therapyType: therapyType.value,
    hasDiagnosis: hasDiagnosis.value,
    applicationStatus: applicationStatus.value,
    institutionId: isLembaga.value ? institutionId.value : undefined,
  }
  emit('submit', payload)
}

const searchInstitution = ref('')
const filteredLembaga = computed(() => {
  if (!searchInstitution.value.trim()) return props.lembagaList
  const q = searchInstitution.value.toLowerCase()
  return props.lembagaList.filter(l => l.name.toLowerCase().includes(q))
})

const fileInput = ref<HTMLInputElement | null>(null)

function onAvatarChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  emit('avatar-change', file)
}

const step = ref(1)

function handleNextStep() {
  if (!fullName.value || !dateOfBirth.value) return
  if (hasDiagnosis.value === undefined) return
  step.value = 2
}
</script>

<template>
  <div class="add-child-form">
    <h2 class="add-child-form__title">
      {{ props.initialData == null ? 'Tambah' : 'Edit' }} Data Anak
    </h2>

    <div v-show="step === 1" class="add-child-form__step-content">
      <div class="add-child-form__section">
        <span class="add-child-form__section-icon bg-pink"></span>
        Biodata Anak
      </div>

      <div v-if="props.showAvatarEdit" class="add-child-form__avatar-section">
        <div class="add-child-form__avatar">
          <img
            v-if="childAvatarUrl"
            :src="childAvatarUrl"
            alt="avatar"
            class="add-child-form__avatar-img"
          />
          <svg v-else width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="38" stroke="#8B73F6" stroke-width="2" />
            <circle cx="40" cy="33" r="13" stroke="#8B73F6" stroke-width="2" />
            <path
              d="M15 68c4-10 12.5-15 25-15s21 5 25 15"
              stroke="#8B73F6"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <button class="add-child-form__upload-btn" @click="fileInput?.click()">
          Unggah Foto <Pencil :size="14" />
        </button>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          style="display: none"
          @change="onAvatarChange"
        />
      </div>

      <!-- Nama Lengkap -->
      <div class="add-child-form__field">
        <label class="add-child-form__label">
          Nama Lengkap <span class="add-child-form__required">*</span>
        </label>
        <input v-model="fullName" class="add-child-form__input" placeholder="Contoh: Syahril" />
      </div>

      <!-- Tanggal Lahir -->
      <div class="add-child-form__field">
        <label class="add-child-form__label">
          Tanggal Lahir <span class="add-child-form__required">*</span>
        </label>
        <div class="add-child-form__input add-child-form__input--date">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ff4d8d"
          stroke-width="2"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <input
          v-model="dateOfBirth"
          type="date"
          class="add-child-form__date-input"
          placeholder="Hari/Bulan/Tahun"
        />
      </div>
    </div>



    <!-- Sudah pernah menjalani diagnosa? -->
    <div class="add-child-form__field">
      <label class="add-child-form__label">
        Sudah pernah menjalani diagnosa? <span class="add-child-form__required">*</span>
      </label>
      <div class="add-child-form__radio-group">
        <button
          class="add-child-form__radio"
          :class="{ 'add-child-form__radio--active': hasDiagnosis === true }"
          @click="hasDiagnosis = true"
        >
          <span
            class="add-child-form__radio-dot"
            :class="{ 'add-child-form__radio-dot--active': hasDiagnosis === true }"
          />
          Sudah
        </button>
        <button
          class="add-child-form__radio"
          :class="{ 'add-child-form__radio--active': hasDiagnosis === false }"
          @click="hasDiagnosis = false"
        >
          <span
            class="add-child-form__radio-dot"
            :class="{ 'add-child-form__radio-dot--active': hasDiagnosis === false }"
          />
          Belum
        </button>
      </div>
    </div>

    <!-- Jenis Kelamin -->
    <div class="add-child-form__field">
      <label class="add-child-form__label">Jenis kelamin</label>
      <select v-model="gender" class="add-child-form__select">
        <option :value="undefined">Pilih</option>
        <option value="laki_laki">Laki-laki</option>
        <option value="perempuan">Perempuan</option>
      </select>
    </div>

    <!-- Jenis Terapi -->
    <div class="add-child-form__field add-child-form__field--relative">
      <label class="add-child-form__label">
        Jenis Terapi
        <span
          class="add-child-form__info-trigger"
          @mouseenter="showTooltip = true"
          @mouseleave="showTooltip = false"
          @click="showTooltip = !showTooltip"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" fill="#E05C5C" />
            <path d="M12 16V12" stroke="white" stroke-width="2" stroke-linecap="round" />
            <circle cx="12" cy="8" r="1" fill="white" />
          </svg>
        </span>
      </label>

      <Transition name="fade">
        <div v-if="showTooltip" class="add-child-form__popup">
          <div class="add-child-form__popup-header">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" fill="#E05C5C" />
              <path d="M12 16V12" stroke="white" stroke-width="2" stroke-linecap="round" />
              <circle cx="12" cy="8" r="1" fill="white" />
            </svg>
            <span class="add-child-form__popup-title">Perbedaan Jenis terapi</span>
          </div>
          <hr class="add-child-form__popup-divider" />
          <div class="add-child-form__popup-content">
            <p><strong>Individu:</strong> belajar mandiri di rumah</p>
            <p><strong>Lembaga:</strong> belajar di sekolah</p>
          </div>
        </div>
      </Transition>
      <div class="add-child-form__radio-group">
        <button
          class="add-child-form__radio"
          :class="{ 'add-child-form__radio--active': therapyType === 'individu' }"
          @click="therapyType = 'individu'"
        >
          <span
            class="add-child-form__radio-dot"
            :class="{ 'add-child-form__radio-dot--active': therapyType === 'individu' }"
          />
          Individu
        </button>
        <button
          class="add-child-form__radio"
          :class="{ 'add-child-form__radio--active': therapyType === 'lembaga_sekolah' }"
          @click="therapyType = 'lembaga_sekolah'"
        >
          <span
            class="add-child-form__radio-dot"
            :class="{ 'add-child-form__radio-dot--active': therapyType === 'lembaga_sekolah' }"
          />
          Lembaga Sekolah
        </button>
      </div>
    </div>
    </div> <!-- END STEP 1 -->

    <!-- STEP 2: Pilih Lembaga (only when lembaga_sekolah) -->
    <Transition name="fade">
      <div v-if="step === 2 && isLembaga" class="add-child-form__step-content">
        <div class="add-child-form__section">
          <span class="add-child-form__section-icon bg-pink"></span>
          Data Lembaga
        </div>
        
        <div class="add-child-form__search-container">
          <input
            v-model="searchInstitution"
            type="text"
            class="add-child-form__input add-child-form__search-input"
            placeholder="Cari Nama Lembaga"
          />
        </div>

        <div class="add-child-form__lembaga-table-wrapper">
          <table class="add-child-form__lembaga-table">
            <thead>
              <tr>
                <th>Nama Lembaga</th>
                <th>Alamat</th>
                <th>Nomor Telepon</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="l in filteredLembaga" :key="l._id">
                <td class="font-semibold">{{ l.name }}</td>
                <td>{{ l.address || '-' }}</td>
                <td>{{ l.phone || '-' }}</td>
                <td>
                  <button 
                    v-if="institutionId === l._id"
                    class="add-child-form__btn-ajukan add-child-form__btn-ajukan--active"
                  >
                    Diajukan
                  </button>
                  <button 
                    v-else
                    class="add-child-form__btn-ajukan"
                    @click="institutionId = l._id"
                  >
                    Ajukan
                  </button>
                </td>
              </tr>
              <tr v-if="filteredLembaga.length === 0">
                <td colspan="4" class="text-center py-4 text-gray-500">Lembaga tidak ditemukan</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Transition>

    <!-- Actions -->
    <div class="add-child-form__actions">
      <button 
        v-if="step === 1" 
        class="add-child-form__btn add-child-form__btn--cancel" 
        @click="emit('cancel')"
      >
        Kembali
      </button>
      <button 
        v-if="step === 2" 
        class="add-child-form__btn add-child-form__btn--cancel" 
        @click="step = 1"
      >
        Kembali
      </button>

      <button
        v-if="step === 1 && isLembaga"
        class="add-child-form__btn add-child-form__btn--submit"
        @click="handleNextStep"
      >
        Selanjutnya
      </button>
      <button
        v-else
        class="add-child-form__btn add-child-form__btn--submit"
        :disabled="loading"
        @click="handleSubmit"
      >
        {{ loading ? 'Menyimpan...' : 'Simpan' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.add-child-form {
  max-width: 560px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.add-child-form__title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 1rem;
}

.add-child-form__section {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.add-child-form__section-icon {
  width: 16px;
  height: 6px;
  border-radius: 4px;
}

.bg-pink {
  background-color: #ff4d8d;
}

.add-child-form__step-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.add-child-form__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.add-child-form__label {
  font-size: 14px;
  font-weight: 500;
  color: #2d2d2d;
}

.add-child-form__required {
  color: #e05c5c;
}

.add-child-form__input {
  padding: 10px 14px;
  border: 1.5px solid #eaeaea;
  border-radius: 6px;
  font-size: 14px;
  color: #2d2d2d;
  background: #fff;
  outline: none;
  transition: border-color 0.2s;
}

.add-child-form__input:focus {
  border-color: #ff4d8d;
}

.add-child-form__input--date {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
}

.add-child-form__date-input {
  border: none;
  outline: none;
  font-size: 14px;
  color: #2d2d2d;
  background: transparent;
  flex: 1;
}

.add-child-form__select {
  padding: 10px 14px;
  border: 1.5px solid #eaeaea;
  border-radius: 6px;
  font-size: 14px;
  color: #2d2d2d;
  background: #fff;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23ff4d8d' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  cursor: pointer;
}

/* Radio group */
.add-child-form__radio-group {
  display: flex;
  gap: 12px;
}

.add-child-form__radio {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: 1.5px solid #eaeaea;
  border-radius: 6px;
  background: #fff;
  font-size: 14px;
  color: #2d2d2d;
  cursor: pointer;
  transition: all 0.2s;
}

.add-child-form__radio--active {
  border-color: #ff4d8d;
  background: #fce8f0;
}

.add-child-form__radio-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #eaeaea;
  flex-shrink: 0;
  transition: all 0.2s;
}

.add-child-form__radio-dot--active {
  border-color: #ff4d8d;
  background: #ff4d8d;
}

/* Lembaga info cards */
.add-child-form__lembaga-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}

.add-child-form__lembaga-card {
  padding: 12px 14px;
  border: 1.5px solid #e0d9f5;
  border-radius: 10px;
  font-size: 13px;
  color: #888;
  background: #fff;
}

/* Actions */
.add-child-form__actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 0.5rem;
}

.add-child-form__btn {
  padding: 10px 36px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.add-child-form__btn--cancel {
  background: #fff;
  border: 1px solid #ff4d8d;
  color: #ff4d8d;
}

.add-child-form__btn--cancel:hover {
  background: #fce8f0;
}

.add-child-form__btn--submit {
  background: #ff4d8d;
  border: none;
  color: #fff;
}

.add-child-form__btn--submit:hover:not(:disabled) {
  background: #e63e7a;
}

.add-child-form__btn--submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.add-child-form__label {
  font-size: 14px;
  font-weight: 500;
  color: #2d2d2d;
}

.add-child-form__info-trigger {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

/* Info Popup styling */
/* 1. Anchors the absolute coordinate sandbox to this field container */
.add-child-form__field--relative {
  position: relative;
}

/* 2. Keeps the label text and icon sitting cleanly side-by-side */
.add-child-form__label-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 3. The true floating card layout */
.add-child-form__popup {
  position: absolute;
  top: 26px; /* Floats right under the label row */
  left: 105px; /* Shifts it to the right, next to the icon */
  z-index: 999; /* Ensures it sits on top of everything else */
  width: 210px;
  background: #ffffff;
  border-radius: 8px;
  padding: 10px 12px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.12);
  border: 1px solid #eaeaea;
  pointer-events: none; /* Makes it hover-safe so users can still click inputs below it */

  /* 2. Soft drop shadow matching the UI */
  box-shadow: 0px 8px 24px rgba(149, 157, 165, 0.15);
  pointer-events: none;
}

.add-child-form__popup-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.add-child-form__popup-title {
  font-size: 11px;

  color: #0066ff;
}

.add-child-form__popup-content {
  font-size: 11px;
  line-height: 1.4;
  color: #4a4a4a;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.add-child-form__label-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.add-child-form__popup-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-child-form__popup-title {
  font-size: 13px;
  font-weight: 500;
  color: #4a90e2; /* Clean blue title link text color */
}

/* Gray separator horizontal rule */
.add-child-form__popup-divider {
  border: none;
  border-top: 1px solid #215c97;
  margin: 10px 0;
}

.add-child-form__popup-content {
  font-size: 12px;
  line-height: 1.5;
  color: #555555;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.add-child-form__popup-content p {
  margin: 0;
}

/* Avatar */
.pv__avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.pv__avatar {
  width: 80px;
  height: 80px;
}

.pv__avatar-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}
.pv__upload-btn:hover {
  background: var(--color-surface-blue);
}

.pv__file-input {
  display: none;
}

/* Avatar section */
.add-child-form__avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.add-child-form__avatar {
  width: 80px;
  height: 80px;
}

.add-child-form__avatar-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.add-child-form__upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border-radius: 999px;
  border: 1.5px solid #e0d9f5;
  background-color: var(--color-white);
  text-decoration-color: var(--color-white);

  font-size: 13px;
  color: #2d2d2d;
  cursor: pointer;
  transition: background 0.15s;
}

.add-child-form__upload-btn:hover {
  background: var(--color-surface-primary);
}

/* Lembaga Table Styles */
.add-child-form__search-container {
  margin-bottom: 12px;
}
.add-child-form__search-input {
  width: 300px;
}
.add-child-form__lembaga-table-wrapper {
  overflow-x: auto;
  border-top: 1px solid #eaeaea;
  margin-top: 8px;
}
.add-child-form__lembaga-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  text-align: left;
}
.add-child-form__lembaga-table th {
  padding: 12px 16px;
  font-weight: 600;
  color: #2d2d2d;
  border-bottom: 1px solid #eaeaea;
}
.add-child-form__lembaga-table td {
  padding: 16px;
  color: #555;
  border-bottom: 1px solid #f5f5f5;
  vertical-align: middle;
}
.add-child-form__btn-ajukan {
  padding: 6px 16px;
  border: 1px solid #ff4d8d;
  color: #ff4d8d;
  background: #fff;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.add-child-form__btn-ajukan:hover {
  background: #fce8f0;
}
.add-child-form__btn-ajukan--active {
  background: #ff4d8d;
  color: #fff;
}
.add-child-form__btn-ajukan--active:hover {
  background: #e63e7a;
}
</style>
