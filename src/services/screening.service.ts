import type { ScreeningQuestion, ScreeningPayload, ScreeningResult } from '@/types/screening.types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
const USE_MOCK = !BASE_URL

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`)
  return res.json() as Promise<T>
}

const MOCK_SCREENING_QUESTIONS_ORTU: ScreeningQuestion[] = [
  { id: 'q1', order: 1, text: 'Apakah beliau mengalami kesulitan dalam mengeja?', required: true },
  { id: 'q2', order: 2, text: 'Apakah beliau mengalami kesulitan dalam penamaan huruf?', required: true },
  { id: 'q3', order: 3, text: 'Apakah beliau mengalami kesulitan dalam pelafalan bunyi huruf?', required: true },
  { id: 'q4', order: 4, text: 'Apakah beliau membaca dengan lambat?', required: true },
  { id: 'q5', order: 5, text: 'Apakah beliau sering membalik huruf saat menulis?', required: true },
]

const MOCK_SCREENING_QUESTIONS_ANAK: ScreeningQuestion[] = [
  { id: 'q1', order: 1, text: '', required: true, questionType: 'tap', mediaLabel: 'Animasi' },
  { id: 'q2', order: 2, text: '', required: true, questionType: 'tap', mediaLabel: 'Animasi', options: ['A', 'I', 'U'] },
  { id: 'q3', order: 3, text: 'Ini dibaca apa?', required: true, questionType: 'voice', mediaLabel: 'Huruf/Teks' },
  { id: 'q4', order: 4, text: 'Tulislah jawaban Anda di kertas, lalu unggah sebagai foto/gambar.', required: true, questionType: 'upload', mediaLabel: 'Huruf/Teks' },
]

const MOCK_SCREENING_RESULTS: ScreeningResult[] = []

export const screeningService = {
  async getScreeningQuestions(type: 'orang_tua' | 'anak'): Promise<ScreeningQuestion[]> {
    if (USE_MOCK) return type === 'orang_tua' ? [...MOCK_SCREENING_QUESTIONS_ORTU] : [...MOCK_SCREENING_QUESTIONS_ANAK]
    return request<ScreeningQuestion[]>(`/api/v1/screening/questions?type=${type}`)
  },

  async submitScreening(payload: ScreeningPayload): Promise<void> {
    if (USE_MOCK) {
      MOCK_SCREENING_RESULTS.push({
        id: `sr${Date.now()}`,
        childId: payload.childId,
        screeningType: payload.screeningType,
        answers: payload.answers,
        score: Math.round((payload.answers.reduce((s, a) => s + a.value, 0) / payload.answers.length) * 20),
        completedAt: new Date().toISOString(),
        recommendation: 'Perlu evaluasi lebih lanjut.',
      })
      return
    }
    return request<void>('/api/v1/screening/submit', { method: 'POST', body: JSON.stringify(payload) })
  },

  async getScreeningResult(childId: string): Promise<ScreeningResult[]> {
    if (USE_MOCK) {
      const existing = MOCK_SCREENING_RESULTS.filter((r) => r.childId === childId)
      if (existing.length) return existing
      return [{
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
      }]
    }
    return request<ScreeningResult[]>(`/api/v1/screening/results?childId=${childId}`)
  },
}