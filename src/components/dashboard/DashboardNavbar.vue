<script setup lang="ts">
import AppLogo from '../shared/AppLogo.vue'
import { ref, computed } from 'vue'
import ProfilePopup from './ProfilePopup.vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composable/useAuth'

const router = useRouter()
const { user, logout } = useAuth()
const showProfile = ref(false)

const tabs = computed(() => {
  const role = user.value?.role || 'parent'
  
  if (role === 'admin') {
    return [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Lembaga', path: '/lembaga' },
      { name: 'Paket Penjualan', path: '/paket-penjualan' },
      { name: 'Manajemen Pengguna', path: '/manajemen-pengguna' },
    ]
  } else if (role === 'institution') {
    return [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Pendaftaran', path: '/pendaftaran' },
      { name: 'Siswa', path: '/siswa' },
      { name: 'Guru', path: '/guru' },
    ]
  } else {
    // parent & teacher
    return [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Course', path: '/course' },
    ]
  }
})

function emmitProfile() {
  router.push('/profile')
  showProfile.value = false
}

function emmitSettings() {
  showProfile.value = false
}

async function emmitLogout() {
  await logout()
  router.push('/login')
  showProfile.value = false
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar__brand">
      <div class="navbar__logo">
        <AppLogo />
      </div>
    </div>

    <div class="navbar__tabs">
      <RouterLink
        v-for="tab in tabs"
        :key="tab.path"
        :to="tab.path"
        class="navbar__tab"
        active-class="navbar__tab--active"
      >
        {{ tab.name }}
      </RouterLink>
    </div>

    <div class="navbar__user">
      <div class="navbar__avatar-wrap">
        <button class="navbar__avatar" @click="showProfile = !showProfile">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="15" stroke="var(--color-primary)" stroke-width="2" />
            <circle cx="16" cy="13" r="5" stroke="var(--color-primary)" stroke-width="2" />
            <path
              d="M6 27c1.5-4 5-6 10-6s8.5 2 10 6"
              stroke="var(--color-primary)"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
        <Transition name="pp-fade">
          <ProfilePopup
            v-if="showProfile"
            @profile="emmitProfile"
            @settings="emmitSettings"
            @logout="emmitLogout"
            @close="showProfile = false"
          />
        </Transition>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  justify-self: center;
  justify-content: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 2rem;
  width: 100%;
}

.navbar__logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.navbar__brand-name {
  font-size: calc(13px * var(--text-scale, 1));
  font-weight: 600;
  color: #9b6fe8;
  letter-spacing: 0.02em;
}

.navbar__tabs {
  display: flex;
  gap: 12px;
}

.navbar__tab {
  padding: 8px 24px;
  border-radius: 999px;
  border: 1px solid var(--color-primary);
  background: transparent;
  font-size: calc(14px * var(--text-scale, 1));
  font-weight: 600;
  color: var(--color-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.navbar__tab:hover {
  background: var(--color-primary-light);
  color: white;
  border-color: var(--color-primary-light);
}

.navbar__tab--active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(255, 64, 129, 0.3); /* Adjust to match primary color shadow if needed */
}

.navbar__avatar {
  cursor: pointer;
  transition: opacity 0.2s;
}
.navbar__avatar:hover {
  opacity: 0.7;
}

.navbar__avatar-wrap {
  position: relative;
}
.navbar__avatar {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.pp-fade-enter-active,
.pp-fade-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.pp-fade-enter-from,
.pp-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
