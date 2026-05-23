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
  ChildStatus,
  ScreeningUIState,
  ScreeningPayload,
} from '@/types/dashboard.types'
import EmptyChildrenBanner from '@/components/dashboard/EmptyChildrenBanner.vue'
import ParentScreeningForm from '@/components/forms/ParentScreeningForm.vue'
import { dashboardService } from '@/services/dashboard.service'
import { useDashboardOverlay } from '@/composable/useDashboardOverlay'

const {
  state,
  hasChildren,
  initialize,
  selectChild,
  addChild,
  updateChild,
  updateScreeningUIState,
} = useDashboard()
const overlay = useDashboardOverlay()

const activeTab = ref<'dashboard' | 'course'>('dashboard')

onMounted(initialize)
async function handleSubmit(payload: AddChildPayload) {
  overlay.loading.value = true
  try {
    if (overlay.addChildData.value?.id) {
      await updateChild(overlay.addChildData.value.id, payload)
    } else {
      await addChild(payload)
    }
    overlay.close()
  } finally {
    overlay.loading.value = false
  }
}

async function handleScreeningAction(id: string, action: ScreeningUIState) {
  if (action === 'disable' || action === 'lihat_hasil') return
  overlay.loading.value = true
  const questions = await dashboardService.getScreeningQuestions(action)
  overlay.loading.value = false
  overlay.openScreening(id, action, questions)
}

async function handleScreeningSubmit(payload: ScreeningPayload) {
  overlay.loading.value = true
  try {
    await dashboardService.submitScreening(payload)
    updateScreeningUIState(payload.childId, 'lihat_hasil')
    overlay.close()
  } finally {
    overlay.loading.value = false
  }
}

function handleStatusAction(id: string, status: ChildStatus) {
  if (status === 'diterima') {
    handleScreeningAction(id, 'orang_tua')
    return
  }
  if (status === 'ditolak') {
    const record = state.value.childRecords.find((r) => r.id === id)
    if (!record) return
    overlay.openEditChild(id, {
      namaLengkap: record.name,
      tanggalLahir: record.tanggal ?? '',
      jenisTerapi: record.lembaga === 'Individu' ? 'individu' : 'lembaga_sekolah',
      lembagaId: state.value.lembagaList.find((l) => l.name === record.lembaga)?.id,
    })
  }
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
      <Transition name="fade">
        <AddChildForm
          v-if="overlay.mode.value === 'add_child' || overlay.mode.value === 'edit_child'"
          :lembaga-list="state.lembagaList"
          :loading="overlay.loading.value"
          :initial-data="overlay.addChildData.value?.data"
          @submit="handleSubmit"
          @cancel="overlay.close()"
        />
      </Transition>

      <Transition name="fade">
        <ParentScreeningForm
          v-if="overlay.mode.value === 'screening' && overlay.screeningData.value"
          :child-id="overlay.screeningData.value.childId"
          :screening-type="overlay.screeningData.value.type"
          :questions="overlay.screeningData.value.questions"
          :loading="overlay.loading.value"
          @submit="handleScreeningSubmit"
          @cancel="overlay.close()"
        />
      </Transition>

      <Transition name="fade">
        <div v-if="overlay.mode.value === 'none'" class="dashboard__content">
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
              class="dashboard__add-btn"
              @click="overlay.openAddChild()"
            >
              + Tambah Anak
            </button>
          </div>

          <EmptyChildrenBanner
            v-if="!hasChildren && !state.loading"
            @add-child="overlay.openAddChild()"
            @contact-support="() => {}"
          />
          <ChildrenTable
            v-else
            :records="state.childRecords"
            :loading="state.loading"
            @screening-action="handleScreeningAction"
            @status-action="handleStatusAction"
          />

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
  background: var(--color-background);
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
  color: var(--color-text-dark);
  margin: 0 0 4px;
}

.dashboard__subtitle {
  font-size: 14px;
  color: var(--color-text-light);
  margin: 0;
}

.dashboard__add-btn {
  padding: 10px 20px;
  background: var(--color-primary);
  border-radius: var(--radius-md);
  transition: background var(--transition-base);
  color: #fff;
  border: none;

  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.dashboard__add-btn:hover {
  background: var(--color-primary-light);
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
