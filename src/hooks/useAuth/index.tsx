import { useCallback } from 'react'
import { useAuthStore } from '@/store/auth/index.store'
import { UserApi } from '@/api/types/user.type'
import { AuthService } from '@/api/services/auth.service'
import {
  LoginRequest,
  RegisterRequest,
  AdminLoginRequest,
} from '@/api/types/auth.type'
import { cookieManager } from '@/utils/cookies'
import { toast } from 'sonner'

interface User extends UserApi {}

export const useAuth = () => {
  return useAuthStore()
}

export const useLogin = () => {
  const { setLoading, setError, login } = useAuthStore()

  const loginUser = useCallback(
    async (credentials: LoginRequest) => {
      try {
        setLoading(true)
        setError(null)

        const tokens = await AuthService.login(credentials)

        if (!tokens) {
          return { success: false, error: 'No tokens available' }
        }

        const mockUser: User = {
          id: 'mock-user-id',
          phoneCode: '+84',
          phoneNumber: '0987654321',
          email: credentials.email,
          password: '',
          firstName: 'Mock',
          lastName: 'User',
          idDocument: '123456789',
          taxNumber: '0123456789',
        }

        login(mockUser, tokens)
        return { success: true, user: mockUser }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || error.message || 'Login failed'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, login],
  )

  return { loginUser }
}

export const useAdminLogin = () => {
  const { setLoading, setError, login } = useAuthStore()

  const loginAdmin = useCallback(
    async (credentials: AdminLoginRequest) => {
      try {
        setLoading(true)
        setError(null)

        const tokens = await AuthService.adminLogin(credentials)

        if (!tokens) {
          return { success: false, error: 'No tokens available' }
        }

        const mockAdmin: User = {
          id: 'mock-admin-id',
          phoneCode: '+84',
          phoneNumber: '0987654321',
          email: credentials.email,
          password: '',
          firstName: 'Admin',
          lastName: 'User',
          idDocument: '123456789',
          taxNumber: '0123456789',
        }

        login(mockAdmin, tokens)
        return { success: true, user: mockAdmin }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || error.message || 'Admin login failed'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, login],
  )

  return { loginAdmin }
}

export const useRegister = () => {
  const { setLoading, setError } = useAuthStore()

  const registerUser = useCallback(
    async (data: RegisterRequest) => {
      try {
        setLoading(true)
        setError(null)

        const userData = await AuthService.register(data)

        if (!userData) {
          return { success: false, error: 'User data is undefined' }
        }

        const user: User = {
          id: userData?.userId || '',
          phoneCode: userData?.phoneCode || '',
          phoneNumber: userData?.phoneNumber || '',
          email: userData?.email || '',
          password: userData?.password || '',
          firstName: userData?.firstName || '',
          lastName: userData?.lastName || '',
          idDocument: userData?.idDocument || '',
          taxNumber: userData?.taxNumber || '',
        }

        return { success: true, user }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Registration failed'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError],
  )

  return { registerUser }
}

export const useLogout = () => {
  const { logout } = useAuthStore()

  const logoutUser = useCallback(async () => {
    try {
      const accessToken = cookieManager.getAccessToken()
      if (accessToken) {
        await AuthService.logout(accessToken)
      }

      logout()

      // Show success toast using sonner
      toast.success('Đăng xuất thành công!')
    } catch (error) {
      console.error('Logout API error:', error)
      // Still logout locally even if API fails
      logout()
      toast.success('Đăng xuất thành công!')
    }
  }, [logout])

  return { logoutUser }
}

export const useUpdateProfile = () => {
  const { setLoading, setError, updateUser } = useAuthStore()

  const updateUserProfile = useCallback(
    async (userData: Partial<User>) => {
      try {
        setLoading(true)
        setError(null)

        updateUser(userData)
        return { success: true, user: userData }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Profile update failed'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, updateUser],
  )

  return { updateUserProfile }
}

export const usePasswordReset = () => {
  const { setLoading, setError } = useAuthStore()

  const requestPasswordReset = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      return { success: true }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Password reset request failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError])

  return { requestPasswordReset }
}

export const useTokenRefresh = () => {
  const { refreshTokens, getStoredTokens, logout } = useAuthStore()

  const refreshAuthTokens = useCallback(async () => {
    try {
      const currentTokens = getStoredTokens()
      if (!currentTokens?.refreshToken) {
        throw new Error('No refresh token available')
      }

      const newTokens = await AuthService.refreshToken(
        currentTokens.refreshToken,
      )
      if (!newTokens) {
        return { success: false, error: 'No new tokens available' }
      }
      refreshTokens(newTokens)
      return { success: true, tokens: newTokens }
    } catch (error) {
      console.error('Token refresh failed:', error)
      logout()
      return { success: false, error }
    }
  }, [refreshTokens, getStoredTokens, logout])

  return { refreshAuthTokens }
}
