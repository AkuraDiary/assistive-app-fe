import type { ScreeningUIState } from './screening.types'

export type ChildStatus = 'menunggu' | 'diterima' | 'ditolak'
export type JenisKelamin = 'laki_laki' | 'perempuan'
export type JenisTerapi = 'individu' | 'lembaga_sekolah'

export interface ChildRecord {
  _id: string
  fullName: string
  avatar?: string
  dateOfBirth?: string
  gender?: JenisKelamin
  therapyType?: JenisTerapi
  hasDiagnosis?: boolean
  institutionId?: string | null
  applicationStatus: ChildStatus
  screeningAction: ScreeningUIState
  deletedAt?: string | null
}

export interface AddChildPayload {
  fullName: string
  dateOfBirth: string
  address?: string
  applicationStatus?: ChildStatus
  gender?: JenisKelamin
  hasDiagnosis?: boolean
  therapyType: JenisTerapi
  institutionId?: string | null
}

export interface Lembaga {
  _id: string
  name: string
  description?: string
  address?: string
  phone?: string
}
