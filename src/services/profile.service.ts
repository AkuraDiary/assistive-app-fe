import { authAPI, type ApiResponse } from './api'
import type { ProfileUser, UpdateProfilePayload } from '@/types/profile.types'
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
const USE_MOCK = !BASE_URL
let MOCK_PROFILE: ProfileUser = {
  id: '1',
  namaLengkap: 'Debby',
  namapengguna: 'debby.kt',
  email: 'debby123@gmail.com',
  alamat: 'Jl. Pegangsaan Timur',
  noTelepon: '+62 8123456',
  avatarUrl: undefined,
}

export const profileService = {
  getProfile(): Promise<ApiResponse<ProfileUser>> {
    if (USE_MOCK) return Promise.resolve({ success: true, data: { ...MOCK_PROFILE } })
    return authAPI.get('/profile')
  },

  updateProfile(payload: UpdateProfilePayload): Promise<ApiResponse<ProfileUser>> {
    if (USE_MOCK) {
      MOCK_PROFILE = { ...MOCK_PROFILE, ...payload }
      return Promise.resolve({ success: true, data: { ...MOCK_PROFILE } })
    }
    return authAPI.put('/profile', payload)
  },

  uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    if (USE_MOCK) {
      const avatarUrl = URL.createObjectURL(file)
      MOCK_PROFILE.avatarUrl = avatarUrl
      return Promise.resolve({ success: true, data: { avatarUrl } })
    }
    const form = new FormData()
    form.append('avatar', file)
    return authAPI.post('/profile/avatar', form)
  },
}
