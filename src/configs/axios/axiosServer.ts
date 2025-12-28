import axios, { AxiosInstance } from 'axios'
import { ENV } from '@/constants'
import { AxiosInstanceConfig } from './types'
import { setupInterceptors } from './interceptors'

function createServerAxiosInstance(
  cookies?: Record<string, unknown>,
): AxiosInstance {
  const config: Partial<AxiosInstanceConfig> = {
    baseURL: ENV.URL_API_BASE,
    timeout: ENV.API_TIMEOUT,
    withCredentials: false,
  }

  const instance = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout,
    withCredentials: config.withCredentials,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  setupInterceptors(instance, cookies)

  return instance
}

export { createServerAxiosInstance }

export const instanceServerAxios = createServerAxiosInstance()
