import { AxiosRequestConfig } from 'axios'

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean
  timeout?: number
  _retry?: boolean
}

export interface ApiResponse<T = any> {
  data: T
  success: boolean
  message?: string
  errors?: string[]
  statusCode: number
}

export interface ApiErrorResponse {
  success: false
  message: string
  errors?: string[]
  statusCode: number
  timestamp: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken?: string
}

export interface InterceptorContext {
  isServer: boolean
  cookies?: any
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export type ErrorHandler = (error: any) => void

export interface AxiosInstanceConfig {
  baseURL: string
  timeout?: number
  withCredentials?: boolean
  errorHandler?: ErrorHandler
}
