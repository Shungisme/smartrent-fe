import { AxiosRequestConfig } from 'axios'

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean
  timeout?: number
  _retry?: boolean
}

export interface ApiResponse<T = unknown> {
  data: T
  message: string | null
  code: string
  success: boolean
}

export interface AuthTokens {
  accessToken: string
  refreshToken?: string
}

export interface InterceptorContext {
  isServer: boolean
  cookies?: Record<string, unknown>
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export type ErrorHandler = (error: unknown) => void

export interface AxiosInstanceConfig {
  baseURL: string
  timeout?: number
  withCredentials?: boolean
  errorHandler?: ErrorHandler
}
