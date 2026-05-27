export type ActivityStatus = 'belum' | 'dipelajari' | 'selesai'

export interface ActivityEntry {
    id: string
    childId: string
    date: string
    durationMinutes: number
    topic: string
    score?: number
    status: ActivityStatus
    progress: number  
  }