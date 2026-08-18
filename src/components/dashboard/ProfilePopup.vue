<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { User, Settings, LogOut } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'profile'): void
  (e: 'settings'): void
  (e: 'logout'): void
  (e: 'close'): void
}>()

const popupRef = ref<HTMLElement | null>(null)

function handleClickOutside(e: MouseEvent) {
  if (popupRef.value && !popupRef.value.contains(e.target as Node)) {
    emit('close')
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))
</script>

<template>
  <div ref="popupRef" class="pp">
    <button class="pp__item" @click="emit('profile')">
      <User class="pp__icon" :size="16" />
      Profil saya
    </button>
    <button class="pp__item" @click="emit('settings')">
      <Settings class="pp__icon" :size="16" />
      Pengaturan
    </button>
    <button class="pp__item pp__item--danger" @click="emit('logout')">
      <LogOut class="pp__icon" :size="16" />
      Keluar
    </button>
  </div>
</template>

<style scoped>
.pp {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--color-white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border);
  min-width: 160px;
  z-index: 100;
  overflow: hidden;
  padding: 4px 0;
}

.pp__item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 16px;
  background: transparent;
  border: none;
  font-size: calc(14px * var(--text-scale, 1));
  color: var(--color-text-dark);
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
}

.pp__item:hover {
  background: var(--color-surface-blue);
}

.pp__item--danger {
  color: var(--color-error);
}

.pp__item--danger:hover {
  background: var(--color-error-light);
}

.pp__icon {
  flex-shrink: 0;
  color: inherit;
}
</style>