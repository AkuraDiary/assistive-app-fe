<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { LogOut, ArrowLeft, Pencil } from 'lucide-vue-next'
import BaseTextField from '@/components/shared/input/BaseTextField.vue'
import BaseButton from '@/components/shared/button/BaseButton.vue'
import { useProfile } from '@/composable/useProfile'
import ConfirmModal from '@/components/shared/modal/ConfirmModal.vue'
import { useAuth } from '@/composable/useAuth'
const showLogoutConfirm = ref(false)

const router = useRouter()
const { user, loading, error, fetchProfile, saveProfile, uploadAvatar } = useProfile()

const isEditing = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const { logout: authLogout } = useAuth()
const form = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
  address: '',
  phone: '',
})

let snapshot = { ...form }

// seed form once user loads
watch(user, (u) => {
  if (!u) return
  form.name = u.name
  form.username = u.username
  form.email = u.email
  form.address = u.address
  form.phone = u.phone
  form.password = ''
})

onMounted(fetchProfile)

function startEdit() {
  snapshot = { ...form }
  isEditing.value = true
}

function cancel() {
  Object.assign(form, snapshot)
  isEditing.value = false
}

async function save() {
  const ok = await saveProfile({
    name: form.name,
    username: form.username,
    address: form.address,
    phone: form.phone,
    ...(form.password ? { password: form.password } : {}),
  })
  if (ok) isEditing.value = false
}

async function onAvatarChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  await uploadAvatar(file)
}

async function logout() {
  // TODO: clear auth store
  await authLogout()
  router.push('/login')
}
</script>

<template>
  <div class="pv">
    <div class="pv__card">
      <div v-if="loading" class="pv__loading">Memuat...</div>
      <p v-if="error" class="pv__error">{{ error }}</p>
      <!-- Title -->
      <h1 class="pv__title">Profil</h1>

      <!-- Avatar -->
      <div class="pv__avatar-section">
        <div class="pv__avatar">
          <img v-if="user?.avatarUrl" :src="user.avatarUrl" alt="avatar" class="pv__avatar-img" />
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
        <button class="pv__upload-btn" @click="fileInput?.click()">
          Unggah Foto <Pencil :size="14" />
        </button>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="pv__file-input"
          @change="onAvatarChange"
        />
      </div>

      <!-- Name / username / email summary -->
      <div class="pv__identity">
        <p class="pv__name">{{ form.name }}</p>
        <p class="pv__meta">{{ form.username }}</p>
        <p class="pv__meta">{{ form.email }}</p>
      </div>

      <!-- Form card -->
      <div class="pv__form-card">
        <p class="pv__form-title">Informasi Pribadi Orang Tua</p>

        <div class="pv__grid">
          <BaseTextField
            v-model="form.name"
            label="Nama Lengkap"
            border="border border-primary"
            placeholder="Nama lengkap"
            :disabled="!isEditing"
          />
          <BaseTextField
            v-model="form.username"
            label="Nama Pengguna"
            border="border border-primary"
            placeholder="Nama pengguna"
            :disabled="!isEditing"
          />

          <!-- Email with Verified badge -->
          <div class="pv__field-wrap">
            <div class="pv__label-row">
              <span class="pv__label">Email</span>
              <span class="pv__verified">● Verified</span>
            </div>
            <BaseTextField
              v-model="form.email"
              border="border border-primary"
              type="email"
              placeholder="Email"
              disabled
            />
          </div>

          <BaseTextField
            v-model="form.password"
            label="Kata Sandi"
            type="password"
            border="border border-primary"
            placeholder="Kata sandi"
            :disabled="!isEditing"
          />

          <BaseTextField
            v-model="form.address"
            label="Alamat"
            border="border border-primary"
            placeholder="Alamat"
            :disabled="!isEditing"
          />
          <BaseTextField
            v-model="form.phone"
            label="No. Telepon"
            border="border border-primary"
            placeholder="+62"
            :disabled="!isEditing"
          />
        </div>

        <!-- Actions -->
        <div class="pv__actions">
          <!-- View mode -->
          <template v-if="!isEditing">
            <BaseButton color="primary" @click="startEdit">
              <template #leading><Pencil :size="14" /></template>
              Ubah data
            </BaseButton>
            <button class="pv__back-link" @click="router.back()">
              <ArrowLeft :size="14" /> Kembali
            </button>
          </template>

          <!-- Edit mode -->
          <template v-else>
            <BaseButton color="primary" @click="save">Simpan</BaseButton>
            <button class="pv__back-link" @click="cancel"><ArrowLeft :size="14" /> Batal</button>
          </template>
        </div>
      </div>

      <!-- Logout -->
      <BaseButton variant="outline" color="primary" @click="showLogoutConfirm = true">
        <template #leading><LogOut :size="16" /></template>
        KELUAR
      </BaseButton>
    </div>
  </div>

  <Transition name="fade">
    <ConfirmModal
      v-if="showLogoutConfirm"
      message="Apakah Anda Yakin Keluar?"
      confirm-label="IYA"
      cancel-label="TIDAK"
      confirm-color="info"
      cancel-color="error"
      @confirm="logout"
      @cancel="showLogoutConfirm = false"
    />
  </Transition>
</template>

<style scoped>
.pv {
  min-height: 100vh;
  background: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.pv__card {
  background: var(--color-white);
  border-radius: 20px;
  padding: 2.5rem 3rem;
  width: 100%;
  max-width: 860px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.pv__title {
  align-self: flex-start;
  font-size: 28px;
  font-weight: 800;
  color: var(--color-text-dark);
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

.pv__upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border-radius: 999px;
  border: 1.5px solid var(--color-border);
  background: var(--color-white);
  font-size: 13px;
  color: var(--color-text-dark);
  cursor: pointer;
  transition: background 0.15s;
}
.pv__upload-btn:hover {
  background: var(--color-surface-primary);
}

.pv__file-input {
  display: none;
}

/* Identity summary */
.pv__identity {
  text-align: center;
}
.pv__name {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 2px;
  color: var(--color-text-dark);
}
.pv__meta {
  font-size: 13px;
  color: var(--color-text-light);
  margin: 0;
}

/* Form card */
.pv__form-card {
  width: 100%;
  background: var(--color-background);
  border-radius: var(--radius-lg);
  padding: 1.5rem 2rem 2rem;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.pv__form-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-dark);
  margin: 0;
}

.pv__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 1.5rem;
}

/* Email label row */
.pv__field-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.pv__label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.pv__label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-dark);
}
.pv__verified {
  font-size: 12px;
  color: var(--color-success);
  font-weight: 500;
}

/* Actions */
.pv__actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.pv__back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
  cursor: pointer;
}
.pv__back-link:hover {
  opacity: 0.8;
}
</style>
