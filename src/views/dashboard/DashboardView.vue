<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import DashboardNavbar from '@/components/dashboard/DashboardNavbar.vue'
import ChildrenTable from '@/components/dashboard/ChildrenTable.vue'
import AddChildForm from '@/components/forms/AddChildForm.vue'
import ActivityPanel from '@/components/dashboard/ActivityPanel.vue'
import CourseProgressPanel from '@/components/dashboard/CourseProgressPanel.vue'
import ScreeningResultPanel from '@/components/dashboard/ScreeningResultPanel.vue'
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
import { useRouter } from 'vue-router'
import DailyReminderBanner from '@/components/dashboard/DailyReminderBanner.vue'
import BaseButton from '@/components/shared/button/BaseButton.vue'
import ConfirmModal from '@/components/shared/modal/ConfirmModal.vue'
const router = useRouter()

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
const showLogoutConfirm = ref(false)

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

function handleEdit(id: string) {
  const record = state.value.childRecords.find((r) => r.id === id)
  if (!record) return
  overlay.openEditChild(id, {
    namaLengkap: record.name,
    tanggalLahir: record.tanggal ?? '',
    jenisTerapi: record.lembaga === 'Individu' ? 'individu' : 'lembaga_sekolah',
    lembagaId: state.value.lembagaList.find((l) => l.name === record.lembaga)?.id,
  })
}

function handleDelete(id: string) {
  // wire to your delete API when ready
  console.log('delete', id)
}

async function handleScreeningAction(id: string, action: ScreeningUIState) {
  if (action === 'disable') return

  if (action === 'lihat_hasil') {
    overlay.openResult(id)
    return
  }

  if (action === 'anak') {
    router.push(`/screening/${id}/anak`) // dedicated page
    return
  }

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
  if (status === 'menunggu') return
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

const props = defineProps<{
  date?: string // ISO string, defaults to today
}>()
const formattedDate = computed(() => {
  const d = props.date ? new Date(props.date) : new Date()
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
})

function handleLogout() {
  // TODO: clear auth store
  router.push('/login')
}
</script>

<template>
  <div class="dashboard">
    <DashboardNavbar
      :user="state.user"
      :active-tab="activeTab"
      @tab-change="(tab) => (activeTab = tab)"
      @logout="showLogoutConfirm = true"
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
        <ScreeningResultPanel
          v-if="overlay.mode.value === 'result' && overlay.resultData.value"
          :child-id="overlay.resultData.value.childId"
          :child-name="
            state.childRecords.find((r) => r.id === overlay.resultData.value!.childId)?.name
          "
          @back="overlay.close()"
          @save="overlay.close()"
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
            <div class="dashboard__header-right">
              <DailyReminderBanner />

              <div class="dashboard__date-chip">{{ formattedDate }}</div>
            </div>
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
            :show-actions="true"
            @edit="handleEdit"
            @delete="handleDelete"
            @screening-action="handleScreeningAction"
            @status-action="handleStatusAction"
          />
          <BaseButton
            v-if="hasChildren && !state.loading"
            class="dashboard__add-btn"
            @click="overlay.openAddChild()"
          >
            + Tambah Anak
          </BaseButton>
          <div class="dashboard__panels">
            <ActivityPanel :activities="state.activities" :loading="state.loading" />
            <CourseProgressPanel
              :children="state.childRecords"
              :selected-child-id="state.selectedChildId"
              :courses="state.courses"
              :loading="state.loading"
              @child-change="selectChild"
            />
          </div>
        </div>
      </Transition>

      <Transition name="fade">
        <ConfirmModal
          v-if="showLogoutConfirm"
          message="Apakah Anda Yakin Keluar?"
          confirm-label="IYA"
          cancel-label="TIDAK"
          @confirm="handleLogout"
          @cancel="showLogoutConfirm = false"
        />
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

.dashboard__header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.dashboard__date-chip {
  background: #ede8fa;
  color: var(--color-primary);
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
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
