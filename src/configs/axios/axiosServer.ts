import axios, { AxiosInstance } from 'axios'
import { ENV } from '@/constants'
import { AxiosInstanceConfig } from './types'
import { setupInterceptors } from './interceptors'

function createServerAxiosInstance(cookies?: any): AxiosInstance {
  const config: Partial<AxiosInstanceConfig> = {
    baseURL: ENV.URL_API_BASE,
    timeout: 30000,
    withCredentials: false,
    maxRetries: 1,
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

  setupInterceptors(instance, cookies, config.maxRetries)

  return instance
}

export { createServerAxiosInstance }

export const instanceServerAxios = createServerAxiosInstance()
