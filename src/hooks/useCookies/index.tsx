import { useCallback } from 'react'
import { cookieManager, CookieOptions, AuthTokens } from '@/utils/cookies'

/**
 * Hook for managing cookies in React components
 */
export const useCookies = () => {
  const setCookie = useCallback(
    (name: string, value: string, options?: CookieOptions) => {
      cookieManager.set(name, value, options)
    },
    [],
  )

  const getCookie = useCallback((name: string) => {
    return cookieManager.get(name)
  }, [])

  const removeCookie = useCallback(
    (name: string, options?: Pick<CookieOptions, 'path' | 'domain'>) => {
      cookieManager.remove(name, options)
    },
    [],
  )

  const hasCookie = useCallback((name: string) => {
    return cookieManager.has(name)
  }, [])

  const getAllCookies = useCallback(() => {
    return cookieManager.getAll()
  }, [])

  const clearAllCookies = useCallback(() => {
    cookieManager.clearAll()
  }, [])

  return {
    setCookie,
    getCookie,
    removeCookie,
    hasCookie,
    getAllCookies,
    clearAllCookies,
  }
}

/**
 * Hook specifically for auth-related cookies
 */
export const useAuthCookies = () => {
  const setAuthTokens = useCallback((tokens: AuthTokens) => {
    cookieManager.setAuthTokens(tokens)
  }, [])

  const getAuthTokens = useCallback(() => {
    return cookieManager.getAuthTokens()
  }, [])

  const clearAuthTokens = useCallback(() => {
    cookieManager.clearAuthTokens()
  }, [])

  const isAuthenticated = useCallback(() => {
    return cookieManager.isAuthenticated()
  }, [])

  const getAccessToken = useCallback(() => {
    return cookieManager.getAccessToken()
  }, [])

  const getRefreshToken = useCallback(() => {
    return cookieManager.getRefreshToken()
  }, [])

  return {
    setAuthTokens,
    getAuthTokens,
    clearAuthTokens,
    isAuthenticated,
    getAccessToken,
    getRefreshToken,
  }
}
