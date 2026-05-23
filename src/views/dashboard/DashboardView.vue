<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DashboardNavbar from '@/components/dashboard/DashboardNavbar.vue'
import EmptyChildrenBanner from '@/components/dashboard/EmptyChildrenBanner.vue'
import ActivityPanel from '@/components/dashboard/ActivityPanel.vue'
import CourseProgressPanel from '@/components/dashboard/CourseProgressPanel.vue'
import { useDashboard } from '@/composable/useDashboard'

const { state, hasChildren, initialize, selectChild, addChild } = useDashboard()

const activeTab = ref<'dashboard' | 'course'>('dashboard')
// const showAddModal = ref(false)

onMounted(initialize)

async function handleAddChild(name: string) {
    
}
</script>

<template>
  <div class="dashboard">
    <DashboardNavbar
      :user="state.user"
      :active-tab="activeTab"
      @tab-change="(tab) => (activeTab = tab)"
    />

    <main class="dashboard__main">
      <!-- Greeting -->
      <section class="dashboard__greeting">
        <h1 class="dashboard__greeting-title">Selamat datang "{{ state.user?.name ?? '...' }}"</h1>
        <p class="dashboard__greeting-subtitle">
          {{
            hasChildren
              ? `${state.children.length} anak terdaftar`
              : 'Anda belum memiliki data Anak'
          }}
        </p>
      </section>

      <!-- Empty state banner -->
      <Transition name="fade">
        <EmptyChildrenBanner
          v-if="!hasChildren && !state.loading"
          @contact-support="
            () => {
              /* route to support */
            }
          "
        />
      </Transition>

      <!-- Panels row -->
      <div class="dashboard__panels">
        <ActivityPanel :activities="state.activities" :loading="state.loading" />
        <CourseProgressPanel
          :children="state.children"
          :selected-child-id="state.selectedChildId"
          :courses="state.courses"
          :loading="state.loading"
          @child-change="selectChild"
        />
      </div>
    </main>

    <!-- Add child modal -->
    <!-- <Transition name="fade"> -->
      <!-- <AddChildModal v-if="showAddModal" @confirm="handleAddChild" @close="showAddModal = false" /> -->
    <!-- </Transition> -->
  </div>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f5f4f9;
  font-family: 'Inter', system-ui, sans-serif;
}

.dashboard__main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 2rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dashboard__greeting-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 4px;
}

.dashboard__greeting-subtitle {
  font-size: 14px;
  color: #888;
  margin: 0;
}

.dashboard__panels {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

@media (max-width: 768px) {
  .dashboard__panels {
    flex-direction: column;
  }
}

/* Global transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
