import type { ScreeningUIState } from "./screening.types"

export type ChildStatus = 'menunggu' | 'diterima' | 'ditolak'
export type JenisKelamin = 'laki_laki' | 'perempuan'
export type JenisTerapi = 'individu' | 'lembaga_sekolah'

export interface Child {
  id: string
  name: string
  avatar?: string
}

export interface ChildRecord {
  id: string
  name: string
  avatar?: string
  tanggal?: string
  lembaga: string
  status: ChildStatus
  screeningAction: ScreeningUIState
}

export interface AddChildPayload {
  namaLengkap: string
  tanggalLahir: string
  alamat?: string
  jenisKelamin?: JenisKelamin
  jenisTerapi: JenisTerapi
  lembagaId?: string
}

export interface Lembaga {
  id: string
  name: string
  description?: string
}