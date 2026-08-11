export interface AssessmentQuestion {
  id: string
  questionType: 'voice' | 'upload' | 'tap' | 'rapid-naming' |  string
  category: string
  text: string
  mediaLabel?: string
  audioUrl?: string
  rapidNamingType?: 'color' | 'picture' | string
  rapidNamingItems?: string[]
  options?: string[]
  correctAnswer?: string
}

export interface AssessmentAnswer {
  questionId: string
  value: string
  transcription?: string
  durationSpent?: number
}
