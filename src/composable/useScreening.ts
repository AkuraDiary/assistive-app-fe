/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue'
import type { ScreeningUIState } from '@/types/screening.types'
import type { ChildRecord } from '@/types/child.types'
import { screeningService } from '@/services/screening.service'

export function useScreening(childRecords: ReturnType<typeof ref<ChildRecord[]>>) {
  const screeningLoading = ref(false)
  const screeningError = ref<string | null>(null)

  function updateScreeningUIState(id: string, action: ScreeningUIState) {
    const record = childRecords.value?.find((r) => r._id === id)
    if (record) record.screeningAction = action
  }

  async function getScreeningQuestions(type: 'orang_tua' | 'anak') {
    const res = await screeningService.getScreeningQuestions(type)
    if (res.success && res.data) {
      return res.data
    }
    return []
  }

  async function submitScreening(payload: Parameters<typeof screeningService.submitScreening>[0]) {
    screeningLoading.value = true
    screeningError.value = null
    try {
      const res = await screeningService.submitScreening(payload)
      if (!res.success) {
        throw new Error(res.message || 'Gagal submit screening')
      }
    } catch (e: any) {
      screeningError.value = e?.message ?? 'Gagal submit screening'
    } finally {
      screeningLoading.value = false
    }
  }

  async function getScreeningResult(childId: string) {
    const res = await screeningService.getScreeningResult(childId)
    if (res.success && res.data) {
      return res.data
    }
    return []
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