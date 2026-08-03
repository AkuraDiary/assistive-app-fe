<script setup lang="ts">
import { ref } from 'vue'
import { useAccessibility } from '@/composable/useAccessibility'

const { fontSize, dyslexiaFont, increase, decrease, fontDefault, toggleDyslexia } =
  useAccessibility()
const open = ref(false)
</script>

<template>
  <div class="a11y-menu">
    <Transition name="a11y-panel">
      <div v-if="open" class="a11y-menu__panel">
        <div class="a11y-menu__row">
          <span class="a11y-menu__label">Font Size</span>
          <div class="a11y-menu__font-btns">
            <button class="a11y-menu__font-btn" @click="decrease">A-</button>
            <button class="a11y-menu__font-btn" @click="fontDefault">A</button>
            <button class="a11y-menu__font-btn" @click="increase">A+</button>
          </div>
        </div>
        <div class="a11y-menu__row">
          <span class="a11y-menu__label">Dyslexia Font</span>
          <button
            class="a11y-menu__toggle"
            :class="{ 'a11y-menu__toggle--on': dyslexiaFont }"
            @click="toggleDyslexia"
          >
            <span class="a11y-menu__toggle-thumb" />
          </button>
        </div>
      </div>
    </Transition>
    <button class="a11y-menu__trigger" @click="open = !open">
      <img
        src="@/assets/images/ic_a11y.png"
        alt="Company Logo"
        class="h-10 w-auto object-contain"
      />
      <Transition name="a11y-panel">
        <div class="flex" v-if="open">
          <span class="a11y-menu__trigger-label">Accessibility</span>
        </div>
      </Transition>
    </button>
  </div>
</template>

<style scoped>
.a11y-menu {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  z-index: 100;
}

.a11y-menu__panel {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  gap: 4px;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  min-width: 200px;
}

.a11y-menu__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.a11y-menu__label {
  font-size: 13px;
  color: var(--color-text-dark);
  font-weight: 500;
}

.a11y-menu__font-btns {
  display: flex;
  gap: 4px;
}

.a11y-menu__font-btn {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  color: var(--color-text-dark);
  transition: background var(--transition-fast);
}

.a11y-menu__font-btn:hover,
.a11y-menu__font-btn--active {
  background: var(--color-primary-lighter);
  border-color: var(--color-primary);
}

/* Toggle */
.a11y-menu__toggle {
  width: 40px;
  height: 22px;
  border-radius: 999px;
  background: var(--color-border);
  border: none;
  cursor: pointer;
  padding: 2px;
  transition: background var(--transition-fast);
  position: relative;
}
.a11y-menu__toggle--on {
  background: var(--color-primary);
}
.a11y-menu__toggle-thumb {
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: white;
  transition: transform var(--transition-fast);
}
.a11y-menu__toggle--on .a11y-menu__toggle-thumb {
  transform: translateX(18px);
}

/* Trigger */
.a11y-menu__trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-secondary);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  padding: 0.625rem;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--shadow-md);
}
.a11y-menu__trigger-label {
  margin: 4px 4px;
  font-size: 16px;
}

/* Transition */
.a11y-panel-enter-active,
.a11y-panel-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}
.a11y-panel-enter-from,
.a11y-panel-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
