export type UserData = {
  id: string
  name: string
  avatar?: string
  type: 'landlord' | 'tenant'
  joinDate: string
  lastOnline: string
  posts: number | null
  status: 'normal' | 'banned'
}
