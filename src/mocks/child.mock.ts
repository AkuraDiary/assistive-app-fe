import type { ChildRecord, Lembaga } from '@/types/child.types'

export const mockLembaga: Lembaga[] = [
  { _id: 'l1', name: 'SLB Mutiara', description: 'Lorem ipsum odor amet,' },
  { _id: 'l2', name: 'SLB Harapan', description: 'Lorem ipsum odor amet,' },
]

export const mockChildRecords: ChildRecord[] = [
  {
    _id: 'c1',
    fullName: 'Fatur Rahman',
    dateOfBirth: '2026-05-02',
    gender: 'laki_laki',
    therapyType: 'individu',
    applicationStatus: 'diterima',
    screeningAction: 'lihat_hasil',
    institutionId: undefined,
  },
  {
    _id: 'c2',
    fullName: 'Budi Santoso',
    dateOfBirth: '2016-03-12',
    gender: 'laki_laki',
    therapyType: 'lembaga_sekolah',
    applicationStatus: 'menunggu',
    screeningAction: 'disable',
    institutionId: 'l1',
  },
  {
    _id: 'c3',
    fullName: 'Citra Kirana',
    dateOfBirth: '2015-11-20',
    gender: 'perempuan',
    therapyType: 'lembaga_sekolah',
    applicationStatus: 'diterima',
    screeningAction: 'orang_tua',
    avatar: '',
  },
]
