/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue'
import type { ScreeningUIState } from '@/types/screening.types'
import type { ChildRecord } from '@/types/child.types'
import { screeningService } from '@/services/screening.service'

export function useScreening(childRecords: ReturnType<typeof ref<ChildRecord[]>>) {
  const screeningLoading = ref(false)
  const screeningError = ref<string | null>(null)

  function updateScreeningUIState(id: string, action: ScreeningUIState) {
    const record = childRecords.value?.find((r) => r.id === id)
    if (record) record.screeningAction = action
  }

  async function getScreeningQuestions(type: 'orang_tua' | 'anak') {
    return screeningService.getScreeningQuestions(type)
  }

  async function submitScreening(payload: Parameters<typeof screeningService.submitScreening>[0]) {
    screeningLoading.value = true
    screeningError.value = null
    try {
      await screeningService.submitScreening(payload)
    } catch (e: any) {
      screeningError.value = e?.data?.message ?? 'Gagal submit screening'
    } finally {
      screeningLoading.value = false
    }
  }

  async function getScreeningResult(childId: string) {
    return screeningService.getScreeningResult(childId)
  }

  return {
    screeningLoading,
    screeningError,
    updateScreeningUIState,
    getScreeningQuestions,
    submitScreening,
    getScreeningResult,
  }
}