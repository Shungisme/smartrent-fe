export type UserData = {
  id: string
  name: string
  avatar?: string
  type: 'normal_user' | 'broker'
  joinDate: string
  lastOnline: string
  posts: number | null
  status: 'normal' | 'banned'
}
