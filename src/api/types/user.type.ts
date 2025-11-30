// Request body for PUT /v1/users/{userId} (Admin update)
export interface UserUpdateRequest {
  email?: string
  firstName?: string
  lastName?: string
  idDocument?: string
  taxNumber?: string
  contactPhoneNumber?: string
  isVerified?: boolean
}
// User profile response from GET /v1/users
export interface UserProfile {
  userId: string
  phoneCode: string
  phoneNumber: string
  email: string
  firstName: string
  lastName: string
  idDocument: string
  taxNumber: string
  contactPhoneNumber?: string
  contactPhoneVerified?: boolean
}

// Legacy interface - kept for backward compatibility
export interface UserApi {
  id: string
  phoneCode: string
  phoneNumber: string
  email: string
  password: string
  firstName: string
  lastName: string
  idDocument: string
  taxNumber: string
}

// Request body for POST /v1/users (Create user)
export interface CreateUserRequest {
  phoneCode: string
  phoneNumber: string
  email: string
  password: string
  firstName: string
  lastName: string
  idDocument: string
  taxNumber: string
}

// Request body for PATCH /v1/users/contact-phone
export interface UpdateContactPhoneRequest {
  contactPhoneNumber: string
}

// Paginated response for GET /v1/users/list
export interface UserListPagination<T> {
  page: number
  size: number
  totalElements: number
  totalPages: number
  data: T[]
}

export type UserListResponse = UserListPagination<UserProfile>
