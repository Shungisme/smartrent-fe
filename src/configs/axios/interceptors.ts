import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { ENV } from '@/constants'
import { CustomAxiosRequestConfig, ApiResponse } from './types'
import {
  getAccessToken,
  formatApiError,
  isUnauthorizedError,
  isServerError,
  delay,
  calculateRetryDelay,
  logError,
} from './utils'

export function createAuthRequestInterceptor(cookies?: any) {
  return (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const customConfig = config as CustomAxiosRequestConfig
    if (customConfig.skipAuth) {
      return config
    }

    const accessToken = getAccessToken(cookies)

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

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[AxiosServer] ${config.method?.toUpperCase()} ${config.url}`,
        {
          headers: config.headers,
          data: config.data,
        },
      )
    }

    return config
  }
}

export function requestErrorInterceptor(error: AxiosError) {
  logError(error, 'Request Error')
  return Promise.reject(error)
}

export function responseSuccessInterceptor(response: AxiosResponse) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[AxiosServer] Response:`, {
      status: response.status,
      url: response.config.url,
      data: response.data,
    })
  }

  const data = response.data as ApiResponse

  if (data && typeof data === 'object' && 'success' in data && !data.success) {
    const error = new Error(data.message || 'API returned success = false')
    return Promise.reject(error)
  }

  return response
}

export function createResponseErrorInterceptor(maxRetries = 3) {
  return async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig & {
      _retry?: number
    }

    logError(error, 'Response Error')

    if (!originalRequest) {
      return Promise.reject(error)
    }

    if (isUnauthorizedError(error)) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('auth:unauthorized', { detail: error }),
        )
      }

      return Promise.reject(error)
    }

    if (isServerError(error) && originalRequest?.retry !== false) {
      const retryCount = originalRequest._retry || 0
      const maxRetriesConfig = originalRequest.retry || maxRetries

      if (retryCount < maxRetriesConfig) {
        originalRequest._retry = retryCount + 1

        const delayTime = calculateRetryDelay(retryCount + 1)
        await delay(delayTime)

        console.log(
          `[AxiosServer] Retrying request (${retryCount + 1}/${maxRetriesConfig}):`,
          originalRequest.url,
        )

        return axios(originalRequest)
      }
    }

    error.message = formatApiError(error)

    return Promise.reject(error)
  }
}

export function setupInterceptors(
  axiosInstance: any,
  cookies?: any,
  maxRetries = 3,
) {
  axiosInstance.interceptors.request.use(
    createAuthRequestInterceptor(cookies),
    requestErrorInterceptor,
  )

  axiosInstance.interceptors.response.use(
    responseSuccessInterceptor,
    createResponseErrorInterceptor(maxRetries),
  )

  return axiosInstance
}
