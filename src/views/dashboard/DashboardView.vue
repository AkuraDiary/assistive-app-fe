<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DashboardNavbar from '@/components/dashboard/DashboardNavbar.vue'
import ChildrenTable from '@/components/dashboard/ChildrenTable.vue'
import AddChildForm from '@/components/forms/AddChildForm.vue'
import ActivityPanel from '@/components/dashboard/ActivityPanel.vue'
import CourseProgressPanel from '@/components/dashboard/CourseProgressPanel.vue'
import { useDashboard } from '@/composable/useDashboard'
import type {
  AddChildPayload,
  ScreeningAction,
  ScreeningPayload,
  ScreeningQuestion,
} from '@/types/dashboard.types'
import EmptyChildrenBanner from '@/components/dashboard/EmptyChildrenBanner.vue'
import ParentScreeningForm from '@/components/forms/ParentScreeningForm.vue'
import { dashboardService } from '@/services/dashboard.service'

const { state, hasChildren, initialize, selectChild, addChild, updateScreeningAction } =
  useDashboard()

const activeTab = ref<'dashboard' | 'course'>('dashboard')
const showAddForm = ref(false)
const formLoading = ref(false)
const showScreening = ref(false)
const screeningTarget = ref<{ childId: string; type: 'orang_tua' | 'anak' } | null>(null)
const screeningQuestions = ref<ScreeningQuestion[]>([])
const screeningLoading = ref(false)

onMounted(initialize)

async function handleSubmit(payload: AddChildPayload) {
  formLoading.value = true
  try {
    await addChild(payload)
    showAddForm.value = false
  } finally {
    formLoading.value = false
  }
}
async function handleScreeningAction(id: string, action: ScreeningAction) {
  if (action === 'lihat_hasil' || action === 'disable') return
  screeningTarget.value = { childId: id, type: action }
  screeningLoading.value = true
  screeningQuestions.value = await dashboardService.getScreeningQuestions(action)
  screeningLoading.value = false
  showScreening.value = true
}

async function handleScreeningSubmit(payload: ScreeningPayload) {
  screeningLoading.value = true
  try {
    await dashboardService.submitScreening(payload)
    updateScreeningAction(payload.childId, 'lihat_hasil')
    showScreening.value = false
    screeningTarget.value = null
  } finally {
    screeningLoading.value = false
  }
}

function handleScreeningCancel() {
  showScreening.value = false
  screeningTarget.value = null
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
      <!-- Child Form (fragment overlay) -->
      <Transition name="fade">
        <AddChildForm
          v-if="showAddForm"
          :lembaga-list="state.lembagaList"
          :loading="formLoading"
          @submit="handleSubmit"
          @cancel="showAddForm = false"
        />
      </Transition>
      <!-- Parent Screening Form (fragment overlay) -->
      <Transition name="fade">
        <ParentScreeningForm
          v-if="showScreening && screeningTarget"
          :child-id="screeningTarget.childId"
          :screening-type="screeningTarget.type"
          :questions="screeningQuestions"
          :loading="screeningLoading"
          @submit="handleScreeningSubmit"
          @cancel="handleScreeningCancel"
        />
      </Transition>

      <!-- Dashboard content -->
      <Transition name="fade">
        <div v-if="!showAddForm && !showScreening" class="dashboard__content">
          <!-- Header row -->
          <div class="dashboard__header">
            <div>
              <h1 class="dashboard__title">Selamat datang {{ state.user?.name ?? '...' }}</h1>
              <p class="dashboard__subtitle">
                {{
                  hasChildren
                    ? `${state.childRecords.length} anak terdaftar`
                    : 'Anda belum memiliki data Anak'
                }}
              </p>
            </div>

            <button
              v-if="hasChildren && !state.loading"
              class="dashboard__add-btn background-secondary"
              @click="showAddForm = true"
            >
              + Tambah Anak
            </button>
          </div>

          <!-- Children: empty banner or table -->
          <EmptyChildrenBanner
            v-if="!hasChildren && !state.loading"
            @add-child="showAddForm = true"
            @contact-support="() => {}"
          />

          <ChildrenTable
            v-else
            :records="state.childRecords"
            :loading="state.loading"
            @screening-action="handleScreeningAction"
          />

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
        </div>
      </Transition>
    </main>
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
}

.dashboard__content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dashboard__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.dashboard__title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 4px;
}

.dashboard__subtitle {
  font-size: 14px;
  color: #888;
  margin: 0;
}

.dashboard__add-btn {
  padding: 10px 20px;
  background: #625ccc;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.dashboard__add-btn:hover {
  background: #6a4db8;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
