export interface ProfileUser {
    id: string
    namaLengkap: string
    namapengguna: string
    email: string
    alamat: string
    noTelepon: string
    avatarUrl?: string
  }
  
  export interface UpdateProfilePayload {
    namaLengkap: string
    namapengguna: string
    alamat: string
    noTelepon: string
    kataSandi?: string // only sent if changed
  }