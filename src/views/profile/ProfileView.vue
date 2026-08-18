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
  <div>
    <div class="pv">
      <div class="pv__card">
        <div v-if="loading" class="pv__loading">Memuat...</div>
        <p v-if="error" class="pv__error">{{ error }}</p>
        <!-- Title -->
        <h1 class="pv__title text-center self-center text-[32px] font-bold text-gray-900 mb-2">Perbarui Data Pengguna</h1>

        <!-- Avatar -->
        <div class="pv__avatar-section mb-6">
          <div class="pv__avatar border-[3px] border-primary rounded-full p-1 flex items-center justify-center">
            <img v-if="user?.avatarUrl" :src="user.avatarUrl" alt="avatar" class="pv__avatar-img" />
            <svg v-else width="72" height="72" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="38" stroke="var(--color-primary)" stroke-width="2" />
              <circle cx="40" cy="33" r="13" stroke="var(--color-primary)" stroke-width="2" />
              <path
                d="M15 68c4-10 12.5-15 25-15s21 5 25 15"
                stroke="var(--color-primary)"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <button class="pv__upload-btn bg-primary text-white border-none shadow-sm hover:opacity-90" @click="fileInput?.click()">
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

        <!-- Form card -->
        <div class="pv__form-card">

          <div class="pv__grid">
            <!-- LEFT COLUMN -->
            <div class="flex flex-col gap-6">
              <BaseTextField
                v-model="form.name"
                label="Nama Lengkap *"
                border="border border-gray-200"
                placeholder="Contoh: Debby"
              />
              <BaseTextField
                v-model="form.email"
                label="Email"
                border="border border-gray-200 bg-gray-50"
                type="email"
                placeholder="Contoh: debby123@gmail.com"
                disabled
              />
              <BaseTextField
                v-model="form.password"
                label="Kata Sandi"
                type="password"
                border="border border-gray-200"
                placeholder="Masukkan password baru jika ingin mengubahnya"
              />
            </div>

            <!-- RIGHT COLUMN -->
            <div class="flex flex-col gap-6">
              <BaseTextField
                v-model="form.address"
                label="Alamat *"
                border="border border-gray-200"
                placeholder="Contoh: Jl. Pegangsaan Timur"
              />
              <BaseTextField
                v-model="form.username"
                label="Nama Pengguna *"
                border="border border-gray-200"
                placeholder="Contoh: debby.kt"
              />
              <BaseTextField
                v-model="form.phone"
                label="Nomor Telepon *"
                border="border border-gray-200"
                placeholder="Contoh: +62 8123456"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-center gap-4 mt-8">
            <BaseButton variant="outline" color="primary" class="w-[140px] rounded-full font-bold shadow-sm" @click="router.back()">Kembali</BaseButton>
            <BaseButton color="primary" class="w-[140px] rounded-full font-bold shadow-sm" @click="save">Simpan</BaseButton>
          </div>
        </div>

        <!-- Logout -->
        <BaseButton variant="outline" color="primary" class="mt-4 rounded-full font-bold shadow-sm self-center px-8" @click="showLogoutConfirm = true">
          <template #leading><LogOut :size="16" class="rotate-180" /></template>
          Keluar
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
  </div>
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
  font-size: calc(28px * var(--text-scale, 1));
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
  font-size: calc(13px * var(--text-scale, 1));
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
  font-size: calc(16px * var(--text-scale, 1));
  font-weight: 700;
  margin: 0 0 2px;
  color: var(--color-text-dark);
}
.pv__meta {
  font-size: calc(13px * var(--text-scale, 1));
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
  font-size: calc(15px * var(--text-scale, 1));
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
  font-size: calc(13px * var(--text-scale, 1));
  font-weight: 500;
  color: var(--color-text-dark);
}
.pv__verified {
  font-size: calc(12px * var(--text-scale, 1));
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
  font-size: calc(14px * var(--text-scale, 1));
  font-weight: 600;
  color: var(--color-primary);
  cursor: pointer;
}
.pv__back-link:hover {
  opacity: 0.8;
}
</style>
