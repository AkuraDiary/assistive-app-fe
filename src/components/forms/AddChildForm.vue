<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AddChildPayload, JenisTerapi, Lembaga } from '@/types/dashboard.types'

const props = defineProps<{
  lembagaList: Lembaga[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: AddChildPayload): void
  (e: 'cancel'): void
}>()

const namaLengkap = ref('')
const tanggalLahir = ref('')
const alamat = ref('')
const jenisKelamin = ref<'laki_laki' | 'perempuan' | ''>('')
const jenisTerapi = ref<JenisTerapi>('individu')
const lembagaId = ref('')
const showTooltip = ref(false)

// const selectedLembaga = computed(
//   () => props.lembagaList.find((l) => l.id === lembagaId.value) ?? null,
// )

const isLembaga = computed(() => jenisTerapi.value === 'lembaga_sekolah')

function handleSubmit() {
  if (!namaLengkap.value || !tanggalLahir.value) return
  if (isLembaga.value && !lembagaId.value) return

  const payload: AddChildPayload = {
    namaLengkap: namaLengkap.value,
    tanggalLahir: tanggalLahir.value,
    alamat: alamat.value || undefined,
    jenisKelamin: jenisKelamin.value || undefined,
    jenisTerapi: jenisTerapi.value,
    lembagaId: isLembaga.value ? lembagaId.value : undefined,
  }
  emit('submit', payload)
}
</script>

<template>
  <div class="add-child-form">
    <h2 class="add-child-form__title">Masukan Data Anak</h2>

    <!-- Nama Lengkap -->
    <div class="add-child-form__field">
      <label class="add-child-form__label">
        Nama Lengkap <span class="add-child-form__required">*</span>
      </label>
      <input v-model="namaLengkap" class="add-child-form__input" placeholder="Contoh: Syahril" />
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
          stroke="#9b8ec4"
          stroke-width="2"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <input
          v-model="tanggalLahir"
          type="date"
          class="add-child-form__date-input"
          placeholder="Hari/Bulan/Tahun"
        />
      </div>
    </div>

    <!-- Alamat (hidden when Lembaga selected — per design image 1 shows it, image 2 doesn't) -->
    <div v-if="!isLembaga" class="add-child-form__field">
      <label class="add-child-form__label">Alamat</label>
      <input
        v-model="alamat"
        class="add-child-form__input"
        placeholder="Contoh: Jl.Melaril No.10"
      />
    </div>

    <!-- Jenis Kelamin -->
    <div class="add-child-form__field">
      <label class="add-child-form__label">Jenis kelamin</label>
      <select v-model="jenisKelamin" class="add-child-form__select">
        <option value="">Pilih</option>
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
          :class="{ 'add-child-form__radio--active': jenisTerapi === 'individu' }"
          @click="jenisTerapi = 'individu'"
        >
          <span
            class="add-child-form__radio-dot"
            :class="{ 'add-child-form__radio-dot--active': jenisTerapi === 'individu' }"
          />
          Individu
        </button>
        <button
          class="add-child-form__radio"
          :class="{ 'add-child-form__radio--active': jenisTerapi === 'lembaga_sekolah' }"
          @click="jenisTerapi = 'lembaga_sekolah'"
        >
          <span
            class="add-child-form__radio-dot"
            :class="{ 'add-child-form__radio-dot--active': jenisTerapi === 'lembaga_sekolah' }"
          />
          Lembaga Sekolah
        </button>
      </div>
    </div>

    <!-- Pilih Lembaga (only when lembaga_sekolah) -->
    <Transition name="slide">
      <div v-if="isLembaga" class="add-child-form__field">
        <label class="add-child-form__label">
          Pilih Lembaga <span class="add-child-form__required">*</span>
        </label>
        <select v-model="lembagaId" class="add-child-form__select">
          <option value="">Pilih Lembaga</option>
          <option
            v-for="l in lembagaList"
            :key="l.id"
            :value="l.id"
            class="add-child-form__lembaga-card"
          >
            {{ l.name }} - {{ l.description }}
          </option>
        </select>
      </div>
    </Transition>

    <!-- Actions -->
    <div class="add-child-form__actions">
      <button class="add-child-form__btn add-child-form__btn--cancel" @click="emit('cancel')">
        Batal
      </button>
      <button
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
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
  margin: 0 0 0.5rem;
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
  border: 1.5px solid #e0d9f5;
  border-radius: 10px;
  font-size: 14px;
  color: #2d2d2d;
  background: #fff;
  outline: none;
  transition: border-color 0.2s;
}

.add-child-form__input:focus {
  border-color: #7c5ccc;
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
  border: 1.5px solid #e0d9f5;
  border-radius: 10px;
  font-size: 14px;
  color: #2d2d2d;
  background: #fff;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239b8ec4' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
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
  border: 1.5px solid #e0d9f5;
  border-radius: 10px;
  background: #fff;
  font-size: 14px;
  color: #2d2d2d;
  cursor: pointer;
  transition: all 0.2s;
}

.add-child-form__radio--active {
  border-color: #7c5ccc;
  background: #ede8fa;
}

.add-child-form__radio-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #c4b5e8;
  flex-shrink: 0;
  transition: all 0.2s;
}

.add-child-form__radio-dot--active {
  border-color: #7c5ccc;
  background: #7c5ccc;
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
  border: 1.5px solid #c4b5e8;
  color: #7c5ccc;
}

.add-child-form__btn--cancel:hover {
  background: #f5f0ff;
}

.add-child-form__btn--submit {
  background: #7c5ccc;
  border: none;
  color: #fff;
}

.add-child-form__btn--submit:hover:not(:disabled) {
  background: #6a4db8;
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
</style>
