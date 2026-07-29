<script setup lang="ts">
import { User, Book, Edit3, CheckSquare } from 'lucide-vue-next'

const props = defineProps<{
  stats: {
    totalSiswa: number
    modul: number
    dikerjakan: number
    selesai: number
  }
}>()

const items = [
  { 
    label: 'Total Siswa', 
    value: props.stats.totalSiswa, 
    color: '#ff4d8d', 
    bgColor: '#fce8f0', 
    icon: User 
  },
  { 
    label: 'Modul', 
    value: props.stats.modul, 
    color: '#3b82f6', 
    bgColor: '#e0f2fe', 
    icon: Book 
  },
  { 
    label: 'Dikerjakan', 
    value: props.stats.dikerjakan, 
    color: '#10b981', 
    bgColor: '#d1fae5', 
    icon: Edit3 
  },
  { 
    label: 'Selesai', 
    value: props.stats.selesai, 
    color: '#8b5cf6', 
    bgColor: '#ede9fe', 
    icon: CheckSquare 
  },
]
</script>

<template>
  <div class="stat-cards">
    <div 
      v-for="item in items" 
      :key="item.label" 
      class="stat-card"
    >
      <div class="stat-card__header">
        <component :is="item.icon" class="w-5 h-5" :style="{ color: item.color }" />
        <span class="stat-card__label" :style="{ color: item.color }">{{ item.label }}</span>
      </div>
      <div class="stat-card__value-wrapper">
        <div class="stat-card__value" :style="{ color: item.color }">{{ item.value }}</div>
        <div class="stat-card__underline" :style="{ backgroundColor: item.color }" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

@media (max-width: 640px) {
  .stat-cards {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}

.stat-card__header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-card__label {
  font-size: 16px;
  font-weight: 700;
}

.stat-card__value-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-card__value {
  font-size: 48px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-card__underline {
  width: 48px;
  height: 3px;
  border-radius: 4px;
}
</style>
