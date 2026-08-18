<script setup lang="ts">
import { ref } from 'vue'


const visible = ref(true)


</script>

<template>
  <Transition name="banner-fade">
    <div v-if="visible" class="drb">
      <div class="drb__toast">
        <span>Ayo kerjakan modul kamu hari ini!</span>
        <button class="drb__close" @click="visible = false">✕</button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.drb {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.drb__toast {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fef9ec;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: calc(14px * var(--text-scale, 1));
  font-weight: 600;
  color: var(--color-text-dark);
  box-shadow: var(--shadow-md);
}

.drb__close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: calc(13px * var(--text-scale, 1));
  color: var(--color-text-light);
  padding: 0;
  line-height: 1;
}
.drb__close:hover { color: var(--color-text-dark); }

.drb__date {
  background: #ede8fa;
  color: var(--color-primary);
  border-radius: 10px;
  padding: 8px 16px;
  font-size: calc(13px * var(--text-scale, 1));
  font-weight: 600;
}

.banner-fade-enter-active, .banner-fade-leave-active { transition: opacity 0.2s ease; }
.banner-fade-enter-from, .banner-fade-leave-to { opacity: 0; }
</style>