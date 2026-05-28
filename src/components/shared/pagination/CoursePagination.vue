<script setup lang="ts">
const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()

function pages(): (number | '...')[] {
  const total = props.totalPages
  const current = props.currentPage
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)

  if (current <= 3) return [1, 2, 3, '...', total]
  if (current >= total - 2) return [1, '...', total - 2, total - 1, total]
  return [1, '...', current, '...', total]
}
</script>

<template>
  <div class="cp">
    <button
      class="cp__btn"
      :disabled="currentPage === 1"
      @click="emit('page-change', currentPage - 1)"
    >
      Kembali
    </button>

    <div class="cp__pages">
      <button
        v-for="(p, i) in pages()"
        :key="i"
        class="cp__page"
        :class="{
          'cp__page--active': p === currentPage,
          'cp__page--ellipsis': p === '...',
        }"
        :disabled="p === '...'"
        @click="p !== '...' && emit('page-change', p as number)"
      >
        {{ p }}
      </button>
    </div>

    <button
      class="cp__btn"
      :disabled="currentPage === totalPages"
      @click="emit('page-change', currentPage + 1)"
    >
      Lanjut
    </button>
  </div>
</template>

<style scoped>
.cp {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cp__btn {
  padding: 6px 16px;
  border-radius: 8px;
  border: 1.5px solid var(--color-border);
  background: var(--color-white);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-dark);
  cursor: pointer;
  transition: all 0.15s;
}
.cp__btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-white);
  background-color: var(--color-primary);
}
.cp__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.cp__pages {
  display: flex;
  align-items: center;
  gap: 4px;
}

.cp__page {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1.5px solid transparent;

  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-dark);
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cp__page:hover:not(:disabled):not(.cp__page--active) {
  border-color: var(--color-border);
  background: var(--color-background);
}
.cp__page--active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}
.cp__page--ellipsis {
  cursor: default;
  color: var(--color-text-light);
  border: none;
}
</style>
