export type ScreeningType = 'orang_tua' | 'anak'
export type ScreeningUIState = 'disable' | 'lihat_hasil' | ScreeningType
export type QuestionType = 'tap' | 'voice' | 'upload' | 'rapid-naming'

export interface ScreeningAnswer {
  questionId: string
  value: number
}

export interface ScreeningPayload {
  childId: string
  screeningType: ScreeningType
  answers: ScreeningAnswer[]
}

export interface ScreeningQuestion {
  id: string
  order: number
  text: string
  required: boolean
  questionType?: QuestionType
  mediaLabel?: string
  mediaUrl?: string
  options?: string[]
  rapidNamingType?: 'color' | 'picture'
  rapidNamingItems?: string[]
}

export interface CategoryScore {
  label: string
  score: number
  max: number
}

export interface ScreeningResult {
  id: string
  childId: string
  screeningType: ScreeningType
  answers: ScreeningAnswer[]
  score: number
  completedAt: string
  recommendation?: string
  categoryScores?: CategoryScore[]
  dyslexiaLevel?: number
}