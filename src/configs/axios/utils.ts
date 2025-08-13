import {
  BEARER_ACCESS_TOKEN_COOKIE,
  BEARER_REFRESH_TOKEN_COOKIE,
} from '@/constants'
import { AuthTokens, ApiErrorResponse } from './types'

export const isServer = typeof window === 'undefined'

export function getCookieFromDocument(name: string): string | null {
  if (isServer) return null

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }

  return null
}

export function getCookieFromCookiesObject(
  cookies: any,
  name: string,
): string | null {
  if (!cookies) return null

  if (cookies.get) {
    const cookie = cookies.get(name)
    return cookie?.value || null
  }

  return cookies[name] || null
}

export function getAccessToken(cookies?: any): string | null {
  if (isServer && cookies) {
    return getCookieFromCookiesObject(cookies, BEARER_ACCESS_TOKEN_COOKIE)
  }

  if (!isServer) {
    return getCookieFromDocument(BEARER_ACCESS_TOKEN_COOKIE)
  }

  return null
}

export function getRefreshToken(cookies?: any): string | null {
  if (isServer && cookies) {
    return getCookieFromCookiesObject(cookies, BEARER_REFRESH_TOKEN_COOKIE)
  }

  if (!isServer) {
    return getCookieFromDocument(BEARER_REFRESH_TOKEN_COOKIE)
  }

  return null
}

export function getAuthTokens(cookies?: any): AuthTokens | null {
  const accessToken = getAccessToken(cookies)
  const refreshToken = getRefreshToken(cookies)

  if (!accessToken) return null

  return {
    accessToken,
    refreshToken: refreshToken || undefined,
  }
}

export function formatApiError(error: any): string {
  if (!error.response) {
    return error.message || 'Đã xảy ra lỗi không xác định'
  }

  const data = error.response.data as ApiErrorResponse

  if (data?.message) {
    return data.message
  }

  if (data?.errors && data.errors.length > 0) {
    return data.errors.join(', ')
  }

  return `Lỗi HTTP ${error.response.status}: ${error.response.statusText}`
}

export function isUnauthorizedError(error: any): boolean {
  return error.response?.status === 401
}

export function isServerError(error: any): boolean {
  const status = error.response?.status
  return status >= 500 && status < 600
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function calculateRetryDelay(attempt: number, baseDelay = 1000): number {
  return baseDelay * Math.pow(2, attempt - 1)
}

export function logError(error: any, context?: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[AxiosServer${context ? ` - ${context}` : ''}]:`, error)
  }
}
