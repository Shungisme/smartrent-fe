import { UserApi, AdminApi } from '@/api/types/user.type'
import { jwtDecode } from 'jwt-decode'

interface CustomJwtPayload {
  sub: string
  scope: string
  iss: string
  rfId: string
  exp: number
  iat: number
  user: UserApi | AdminApi
  jti: string
}

export const decodeToken = (token: string): CustomJwtPayload => {
  const decoded = jwtDecode<CustomJwtPayload>(token)
  return decoded
}
