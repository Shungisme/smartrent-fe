import { InternalAxiosRequestConfig } from 'axios'
import { ENV } from '@/constants'
import { CustomAxiosRequestConfig } from './types'
import { getAccessToken, getRefreshToken } from './utils'
import { AuthService } from '@/api/services/auth.service'
import { cookieManager } from '@/utils/cookies'

const refreshToken = async (): Promise<string | null> => {
  try {
    const refreshTokenValue = getRefreshToken()
    if (!refreshTokenValue) return null

    const tokens = await AuthService.refreshToken(refreshTokenValue)

    if (!tokens) return null

    if (typeof document !== 'undefined') {
      cookieManager.setAuthTokens(tokens)
    }

    return tokens.accessToken
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
