import {
  BEARER_ACCESS_TOKEN_COOKIE,
  BEARER_REFRESH_TOKEN_COOKIE,
} from '@/constants'
import { AuthTokens } from './types'
import { cookieManager } from '@/utils/cookies'

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
  cookies: Record<string, unknown>,
  name: string,
): string | null {
  if (!cookies) return null

  if (
    typeof cookies === 'object' &&
    'get' in cookies &&
    typeof cookies.get === 'function'
  ) {
    const cookie = (cookies.get as (name: string) => { value?: string })(name)
    return cookie?.value || null
  }

  return (cookies[name] as string) || null
}

export function getAccessToken(
  cookies?: Record<string, unknown>,
): string | null {
  if (isServer && cookies) {
    return getCookieFromCookiesObject(cookies, BEARER_ACCESS_TOKEN_COOKIE)
  }

  if (!isServer) {
    return cookieManager.getAccessToken()
  }

  return null
}

export function getRefreshToken(
  cookies?: Record<string, unknown>,
): string | null {
  if (isServer && cookies) {
    return getCookieFromCookiesObject(cookies, BEARER_REFRESH_TOKEN_COOKIE)
  }

  if (!isServer) {
    return cookieManager.getRefreshToken()
  }

  return null
}

export function getAuthTokens(
  cookies?: Record<string, unknown>,
): AuthTokens | null {
  if (isServer && cookies) {
    const accessToken = getCookieFromCookiesObject(
      cookies,
      BEARER_ACCESS_TOKEN_COOKIE,
    )
    const refreshToken = getCookieFromCookiesObject(
      cookies,
      BEARER_REFRESH_TOKEN_COOKIE,
    )

    if (!accessToken) return null

    return {
      accessToken,
      refreshToken: refreshToken || undefined,
    }
  }

  if (!isServer) {
    return cookieManager.getAuthTokens()
  }

  return null
}

export function formatApiError(error: unknown): string {
  const err = error as {
    response?: {
      data?: { message?: string; errors?: string[] }
      status?: number
      statusText?: string
    }
    message?: string
  }
  if (!err.response) {
    return err.message || 'Đã xảy ra lỗi không xác định'
  }

  const data = err.response.data

  if (data?.message) {
    return data.message
  }

  if (data?.errors && data.errors.length > 0) {
    return data.errors.join(', ')
  }

  return `Lỗi HTTP ${err.response.status}: ${err.response.statusText}`
}

export function isUnauthorizedError(error: unknown): boolean {
  const err = error as { response?: { status?: number } }
  return err.response?.status === 401
}

export function isServerError(error: unknown): boolean {
  const err = error as { response?: { status?: number } }
  const status = err.response?.status
  return status !== undefined && status >= 500 && status < 600
}

export function logError(error: unknown, context?: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[AxiosServer${context ? ` - ${context}` : ''}]:`, error)
  }
}
