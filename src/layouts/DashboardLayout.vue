<script setup lang="ts">
import DashboardNavbar from '@/components/dashboard/DashboardNavbar.vue'
</script>

<template>
  <div class="dashboard-layout">
    <DashboardNavbar />
    
    <div class="dashboard-layout__content">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  background: var(--color-background);
  display: flex;
  flex-direction: column;
}
.dashboard-layout__content {
  flex: 1;
}
/* Reusing the fade transition globally from App.vue or redefining here */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
