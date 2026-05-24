/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, reactive } from 'vue'
import { profileService } from '@/services/profile.service'
import type { ProfileUser, UpdateProfilePayload } from '@/types/profile.types'

export function useProfile() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const user = ref<ProfileUser | null>(null)

  async function fetchProfile() {
    loading.value = true
    error.value = null
    try {
      const res = await profileService.getProfile()
      if (res.success && res.data) user.value = res.data
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Gagal memuat profil'
    } finally {
      loading.value = false
    }
  }

  async function saveProfile(payload: UpdateProfilePayload) {
    loading.value = true
    error.value = null
    try {
      const res = await profileService.updateProfile(payload)
      if (res.success && res.data) user.value = res.data
      return true
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Gagal menyimpan profil'
      return false
    } finally {
      loading.value = false
    }
  }

  async function uploadAvatar(file: File) {
    loading.value = true
    try {
      const res = await profileService.uploadAvatar(file)
      if (res.success && res.data && user.value) {
        user.value.avatarUrl = res.data.avatarUrl
      }
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Gagal mengunggah foto'
    } finally {
      loading.value = false
    }
  }

  return { user, loading, error, fetchProfile, saveProfile, uploadAvatar }
}