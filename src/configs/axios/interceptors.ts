import { InternalAxiosRequestConfig } from 'axios'
import { ENV } from '@/constants'
import { CustomAxiosRequestConfig } from './types'
import { getAccessToken, getRefreshToken } from './utils'
import { AuthService } from '@/api/services/auth.service'
import { cookieManager } from '@/utils/cookies'
import { decodeToken } from '@/utils/decode-jwt'

const refreshToken = async (): Promise<string | null> => {
  try {
    const refreshTokenValue = getRefreshToken()
    if (!refreshTokenValue) return null

    const result = await AuthService.refreshToken(refreshTokenValue)

    const { data, success } = result

    if (!success) return null

    if (typeof document !== 'undefined') {
      cookieManager.setAuthTokens(data)
    }

    return data.accessToken
  } catch (error) {
    console.error('Token refresh failed:', error)
    return null
  }
}

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp < currentTime
  } catch {
    return true
  }
}

const clearAuthTokens = () => {
  if (typeof document !== 'undefined') {
    cookieManager.clearAuthTokens()
  }
}

const getAdminIdFromToken = (token: string): string | null => {
  try {
    const decoded = decodeToken(token)

    return decoded.sub as string // Temporarily use 'sub' as adminId

    // if (!decoded.user) {
    //   return null
    // }

    // const user = decoded.user as AdminApi
    // return (user && user.adminId) ? user.adminId : null
  } catch (error) {
    console.error('Failed to extract adminId from token:', error)
    return null
  }
}

export function createAuthRequestInterceptor(cookies?: any) {
  return async (
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> => {
    const customConfig = config as CustomAxiosRequestConfig
    if (customConfig.skipAuth) {
      return config
    }

    let accessToken = getAccessToken(cookies)

    if (accessToken && isTokenExpired(accessToken)) {
      console.log('Access token expired, refreshing...')

      const refreshTokenValue = getRefreshToken()
      if (!refreshTokenValue || isTokenExpired(refreshTokenValue)) {
        console.log('Refresh token expired or not found, logging out...')
        clearAuthTokens()

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:unauthorized'))
        }
        return config
      }

      const newToken = await refreshToken()

      if (newToken) {
        accessToken = newToken
      } else {
        clearAuthTokens()

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:unauthorized'))
        }
        return config
      }
    }

    if (accessToken) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${accessToken}`

      // Add X-Admin-Id header for admin requests
      const adminId = getAdminIdFromToken(accessToken)
      console.log('Admin ID from token:', adminId)
      if (adminId) {
        config.headers['X-Admin-Id'] = adminId
      }
    }

    if (!config.baseURL && !config.url?.startsWith('http')) {
      config.baseURL = ENV.URL_API_BASE
    }

    if (!config.timeout) {
      config.timeout = 30000
    }

    return config
  }
}

export function setupInterceptors(axiosInstance: any, cookies?: any) {
  axiosInstance.interceptors.request.use(createAuthRequestInterceptor(cookies))

  return axiosInstance
}
