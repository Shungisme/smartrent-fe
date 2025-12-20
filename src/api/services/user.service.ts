import { apiRequest } from '@/configs/axios/axiosClient'
import { ENV } from '@/constants/env'
import { ApiResponse } from '@/configs/axios/types'
import {
  UserProfile,
  CreateUserRequest,
  UpdateContactPhoneRequest,
  UserListResponse,
} from '@/api/types/user.type'

/**
 * User Service
 * Handles all user-related API operations
 */
export class UserService {
  /**
   * Get authenticated user's profile
   * GET /v1/users
   * Retrieves the profile information of the authenticated user.
   * The user ID is automatically extracted from the JWT token.
   */
  static async getUserProfile(): Promise<ApiResponse<UserProfile>> {
    const response = await apiRequest<UserProfile>({
      method: 'GET',
      url: ENV.API.USER.GET_PROFILE,
    })

    return response
  }

  /**
   * Create a new user account
   * POST /v1/users
   * Creates a new user account with the provided information.
   * The user will need to verify their email before the account is fully activated.
   */
  static async createUser(
    userData: CreateUserRequest,
  ): Promise<ApiResponse<UserProfile>> {
    const response = await apiRequest<UserProfile>({
      method: 'POST',
      url: ENV.API.USER.CREATE,
      data: userData,
      skipAuth: true,
    })

    return response
  }

  /**
   * Update user (admin operation)
   * PUT /v1/users/{userId}
   * Updates an existing user's information. Admin only.
   * @param userId - User ID to update
   * @param data - Partial user fields to update
   */
  static async updateUser(
    userId: string,
    data: Partial<Omit<UserProfile, 'userId'>> & { isVerified?: boolean },
  ): Promise<ApiResponse<UserProfile>> {
    const url = ENV.API.USER.UPDATE.replace(':userId', userId)
    const response = await apiRequest<UserProfile>({
      method: 'PUT',
      url,
      data,
    })
    return response
  }

  /**
   * Delete user (admin operation)
   * DELETE /v1/users/{userId}
   * Deletes a user from the system. Admin only.
   * @param userId - User ID to delete
   */
  static async deleteUser(userId: string): Promise<ApiResponse<null>> {
    const url = ENV.API.USER.DELETE.replace(':userId', userId)
    const response = await apiRequest<null>({
      method: 'DELETE',
      url,
    })
    return response
  }

  /**
   * Update contact phone number
   * PATCH /v1/users/contact-phone
   * Updates the authenticated user's contact phone number.
   *
   * Use Case:
   * - User clicks on phone number in listing detail but hasn't provided contact phone
   * - Frontend prompts user to input their contact phone
   * - This endpoint updates the user's contact phone
   *
   * Behavior:
   * - Requires authentication (user must be logged in)
   * - Validates Vietnam phone number format
   * - Resets phone verification status to false
   * - Clears user cache
   */
  static async updateContactPhone(
    phoneData: UpdateContactPhoneRequest,
  ): Promise<ApiResponse<UserProfile>> {
    const response = await apiRequest<UserProfile>({
      method: 'PATCH',
      url: ENV.API.USER.UPDATE_CONTACT_PHONE,
      data: phoneData,
    })

    return response
  }

  /**
   * Get paginated list of users
   * GET /v1/users/list
   * Retrieves a paginated list of all users in the system.
   * This endpoint requires authentication and is typically used for administrative purposes.
   *
   * @param page - Page number (1-indexed, must be >= 1)
   * @param size - Number of items per page
   */
  static async getUserList(
    page: number = 1,
    size: number = 10,
  ): Promise<ApiResponse<UserListResponse>> {
    const response = await apiRequest<UserListResponse>({
      method: 'GET',
      url: `${ENV.API.USER.LIST}?page=${page}&size=${size}`,
    })

    return response
  }
}

// Export individual methods for convenience
export const {
  getUserProfile,
  createUser,
  updateContactPhone,
  getUserList,
  updateUser,
  deleteUser,
} = UserService
