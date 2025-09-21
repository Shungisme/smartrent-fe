import { useCallback } from 'react'
import { useAuthStore } from '@/store/auth/index.store'
import { AuthService } from '@/api/services/auth.service'
import {
  LoginRequest,
  AdminLoginRequest,
  RegisterRequest,
} from '@/api/types/auth.type'
import { cookieManager } from '@/utils/cookies'
import { VerificationAPI } from '@/api/types/verification.type'
import { decodeToken } from '@/utils/decode-jwt'

export const useAuth = () => {
  return useAuthStore()
}

export const useLogin = () => {
  const { setLoading, setError, login } = useAuthStore()

  const loginUser = useCallback(
    async (credentials: LoginRequest) => {
      setError(null)
      setLoading(true)

      const result = await AuthService.login(credentials)

      const { success, message, data: tokens } = result

      setLoading(false)

      if (!success) {
        setError(message)
        return result
      }

      const { user } = decodeToken(tokens.accessToken)

      login(user, tokens)
      return result
    },
    [setLoading, setError, login],
  )

  return { loginUser }
}

export const useAdminLogin = () => {
  const { setLoading, setError, login } = useAuthStore()

  const loginAdmin = useCallback(
    async (credentials: AdminLoginRequest) => {
      setError(null)
      setLoading(true)

      const result = await AuthService.adminLogin(credentials)

      const { success, message, data: tokens } = result

      if (!success) {
        setError(message)
        return result
      }

      const { user } = decodeToken(tokens.accessToken)

      login(user, tokens)
      return result
    },
    [setLoading, setError, login],
  )

  return { loginAdmin }
}

export const useRegister = () => {
  const { setLoading, setError } = useAuthStore()

  const registerUser = useCallback(
    async (data: RegisterRequest) => {
      setLoading(true)
      setError(null)

      const result = await AuthService.register(data)

      const { success, message } = result

      setLoading(false)
      if (!success) {
        setError(message)
        return result
      }

      return result
    },
    [setLoading, setError],
  )

  return { registerUser }
}

export const useLogout = () => {
  const { logout, setError } = useAuthStore()

  const logoutUser = useCallback(async () => {
    const accessToken = cookieManager.getAccessToken()
    if (accessToken) {
      const result = await AuthService.logout(accessToken)
      const { success, message } = result

      if (!success) {
        setError(message)
        return result
      }
      logout()
      return result
    }
  }, [logout])

  return { logoutUser }
}

export const useTokenRefresh = () => {
  const { refreshTokens, getStoredTokens, logout, setError } = useAuthStore()

  const refreshAuthTokens = useCallback(async () => {
    const currentTokens = getStoredTokens()
    if (!currentTokens?.refreshToken) {
      return { success: false, message: 'No refresh token available' }
    }

    const result = await AuthService.refreshToken(currentTokens.refreshToken)
    const { success, message, data: newTokens } = result

    if (!success) {
      setError(message)
      return result
    }

    refreshTokens(newTokens)
    logout()
    return result
  }, [refreshTokens, getStoredTokens])

  return { refreshAuthTokens }
}

export const useVerifyOtp = () => {
  const { setLoading, setError } = useAuthStore()

  const verifyOtp = useCallback(
    async (data: VerificationAPI) => {
      setLoading(true)
      setError(null)

      const result = await AuthService.verifyOtp(data)

      const { success, message } = result

      if (!success) {
        setError(message)
        return result
      }

      return result
    },
    [setLoading, setError],
  )

  return { verifyOtp }
}

export const useResendOtp = () => {
  const { setLoading, setError } = useAuthStore()

  const resendOtp = useCallback(
    async (email: string) => {
      setLoading(true)
      setError(null)

      const result = await AuthService.resendOtp(email)

      const { success, message } = result

      if (!success) {
        setError(message)
        return result
      }

      return result
    },
    [setLoading, setError],
  )

  return { resendOtp }
}

export const useValidToken = () => {
  const { setLoading, setError } = useAuthStore()

  const validToken = useCallback(
    async (token: string) => {
      setLoading(true)
      setError(null)

      const result = await AuthService.validToken(token)

      const { success, message } = result

      if (!success) {
        setError(message)
        return result
      }

      return result
    },
    [setLoading, setError],
  )

  return { validToken }
}
