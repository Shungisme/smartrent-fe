import axios, { AxiosInstance } from 'axios'
import { ENV } from '@/constants'
import { AxiosInstanceConfig, CustomAxiosRequestConfig } from './types'
import { setupInterceptors } from './interceptors'
import { logError } from './utils'

function createClientAxiosInstance(
  config: Partial<AxiosInstanceConfig> = {},
): AxiosInstance {
  const {
    baseURL = ENV.URL_API_BASE,
    timeout = 30000,
    withCredentials = true,
    errorHandler,
  } = config

  const instance = axios.create({
    baseURL,
    timeout,
    withCredentials,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  setupInterceptors(instance, undefined)

  if (errorHandler) {
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        errorHandler(error)
        return
      },
    )
  }

  return instance
}

export const instanceClientAxios = createClientAxiosInstance({
  baseURL: ENV.URL_API_BASE,
  withCredentials: true,
})

export async function apiRequest<T = any>(
  config: CustomAxiosRequestConfig,
): Promise<T | null> {
  try {
    const response = await instanceClientAxios(config)
    return response.data
  } catch (error) {
    logError(error, 'API Request')
    return null
  }
}

export const api = {
  get: <T = any>(url: string, config?: CustomAxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'GET', url }),

  post: <T = any>(url: string, data?: any, config?: CustomAxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'POST', url, data }),

  put: <T = any>(url: string, data?: any, config?: CustomAxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'PUT', url, data }),

  patch: <T = any>(
    url: string,
    data?: any,
    config?: CustomAxiosRequestConfig,
  ) => apiRequest<T>({ ...config, method: 'PATCH', url, data }),

  delete: <T = any>(url: string, config?: CustomAxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'DELETE', url }),
}
