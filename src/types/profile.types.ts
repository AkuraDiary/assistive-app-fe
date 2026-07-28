export interface ProfileUser {
  _id: string
  name: string
  username: string
  email: string
  address: string
  phone: string
  avatarUrl?: string
}

export interface UpdateProfilePayload {
  name: string
  username: string
  address: string
  phone: string
  password?: string // only sent if changed
}