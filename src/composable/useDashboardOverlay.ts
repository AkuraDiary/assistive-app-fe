import { ref } from 'vue'
import type {  ScreeningType, ScreeningQuestion } from '@/types/screening.types'
import type { AddChildPayload } from '@/types/child.types'

export type OverlayMode = 'none' | 'add_child' | 'edit_child' | 'screening' | 'result'

export function useDashboardOverlay() {
  const mode = ref<OverlayMode>('none')

  const addChildData = ref<{ _id?: string; data?: Partial<AddChildPayload> } | null>(null)

  const screeningData = ref<{
    childId: string
    type: ScreeningType
    questions: ScreeningQuestion[]
  } | null>(null)

  const resultData = ref<{ childId: string } | null>(null)

  const loading = ref(false)

  function openAddChild() {
    addChildData.value = null
    mode.value = 'add_child'
  }

  function openEditChild(_id: string, data: Partial<AddChildPayload>) {
    addChildData.value = { _id, data }
    mode.value = 'edit_child'
  }

  function openScreening(childId: string, type: ScreeningType, questions: ScreeningQuestion[]) {
    screeningData.value = { childId, type, questions }
    mode.value = 'screening'
  }

  function openResult(childId: string) {
    resultData.value = { childId }
    mode.value = 'result'
  }

  function close() {
    mode.value = 'none'
    addChildData.value = null
    screeningData.value = null
    resultData.value = null
  }

  return {
    mode,
    loading,
    addChildData,
    screeningData,
    resultData,
    openAddChild,
    openEditChild,
    openScreening,
    openResult,
    close,
  }
}