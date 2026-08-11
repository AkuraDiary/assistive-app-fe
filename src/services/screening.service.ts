import type { ScreeningQuestion, ScreeningPayload, ScreeningResult } from '@/types/screening.types'
import { apiService, USE_MOCK, type ApiResponse } from './api'
import { mockScreeningQuestionsOrtu, mockScreeningQuestionsAnak, mockScreeningResults } from '@/mocks/screening.mock'

export const screeningService = {
  async getScreeningQuestions(type: 'orang_tua' | 'anak'): Promise<ApiResponse<ScreeningQuestion[]>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      return {
        success: true,
        data: type === 'orang_tua'
          ? [...mockScreeningQuestionsOrtu]
          : [...mockScreeningQuestionsAnak]
      }
    }
    return await apiService.get<ScreeningQuestion[]>(`/screening/questions?type=${type}`)
  },

  async submitScreening(payload: ScreeningPayload): Promise<ApiResponse<void>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      mockScreeningResults.push({
        id: `sr${Date.now()}`,
        childId: payload.childId,
        screeningType: payload.screeningType,
        answers: payload.answers,
        score: Math.round(
          (payload.answers.reduce((s, a) => s + a.value, 0) / payload.answers.length) * 20,
        ),
        completedAt: new Date().toISOString(),
        recommendation: 'Perlu evaluasi lebih lanjut.',
      })
      return { success: true }
    }
    return await apiService.post('/screening/submit', payload)
  },

  async getScreeningResult(childId: string): Promise<ApiResponse<ScreeningResult[]>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      const existing = mockScreeningResults.filter((r) => r.childId === childId)
      if (existing.length) return { success: true, data: existing }
      return {
        success: true,
        data: [
          {
            id: `sr-demo-${childId}`,
            childId,
            screeningType: 'anak',
            answers: [],
            score: 30,
            completedAt: new Date().toISOString(),
            recommendation: 'abcdefghijklmnopqrstuvw',
            dyslexiaLevel: 2,
            categoryScores: [
              { label: 'Huruf', score: 7, max: 10 },
              { label: 'Kata', score: 8, max: 10 },
              { label: 'Kalimat', score: 9, max: 10 },
              { label: 'Objek', score: 6, max: 10 },
              { label: 'Warna', score: 9, max: 10 },
            ],
          },
        ]
      }
    }
    return await apiService.get<ScreeningResult[]>(`/screening/results?childId=${childId}`)
  },
}
