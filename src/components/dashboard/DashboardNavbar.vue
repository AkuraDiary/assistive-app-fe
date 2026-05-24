<script setup lang="ts">
import type { DashboardUser } from '@/types/dashboard.types'
import AppLogo from '../shared/AppLogo.vue'
import { ref } from 'vue'
import ProfilePopup from './ProfilePopup.vue'

const showProfile = ref(false)

const props = defineProps<{
  user: DashboardUser | null
  activeTab: 'dashboard' | 'course'
}>()

function emmitProfile() {
  emit('profile')
  showProfile.value = false
}

function emmitSettings() {
  emit('settings')
  showProfile.value = false
}

function emmitLogout() {
  emit('logout')
  showProfile.value = false
}
const emit = defineEmits<{
  (e: 'tab-change', tab: 'dashboard' | 'course'): void
  (e: 'logout'): void // NEW
  (e: 'profile'): void // NEW
  (e: 'settings'): void // NEW
}>()
</script>

<template>
  <nav class="navbar">
    <div class="navbar__brand">
      <div class="navbar__logo">
        <AppLogo />
      </div>
    </div>

    <div class="navbar__tabs">
      <button
        class="navbar__tab"
        :class="{ 'navbar__tab--active': props.activeTab === 'dashboard' }"
        @click="emit('tab-change', 'dashboard')"
      >
        Dashboard
      </button>
      <button
        class="navbar__tab"
        :class="{ 'navbar__tab--active': props.activeTab === 'course' }"
        @click="emit('tab-change', 'course')"
      >
        Course
      </button>
    </div>

    <div class="navbar__user">
      <div class="navbar__avatar-wrap">
        <button class="navbar__avatar" @click="showProfile = !showProfile">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="15" stroke="#8B73F6D9" stroke-width="2" />
          <circle cx="16" cy="13" r="5" stroke="#8B73F6D9" stroke-width="2" />
          <path
            d="M6 27c1.5-4 5-6 10-6s8.5 2 10 6"
            stroke="#8B73F6D9"
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 2rem;
}

.navbar__logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.navbar__brand-name {
  font-size: 13px;
  font-weight: 600;
  color: #9b6fe8;
  letter-spacing: 0.02em;
}

.navbar__tabs {
  display: flex;
  background: #ede8fa;
  border-radius: 999px;
  padding: 4px;
  gap: 4px;
}

.navbar__tab {
  padding: 8px 28px;
  border-radius: 999px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: #9b8ec4;
  cursor: pointer;
  transition: all 0.2s ease;
}

.navbar__tab--active {
  background: #7c5ccc;
  color: #fff;
  box-shadow: 0 2px 8px rgba(124, 92, 204, 0.3);
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
