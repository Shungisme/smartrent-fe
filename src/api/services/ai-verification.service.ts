import { apiRequest } from '@/configs/axios/axiosClient'
import { PATHS } from '@/api/paths'
import {
  AiVerificationRequest,
  AiVerificationResult,
  AiServiceStatus,
  ApiResponse,
} from '@/api/types/ai-verification.type'

/**
 * AI Listing Verification Service for Admin Portal
 *
 * Thin wrapper around the Spring Boot AI moderation endpoints. The AI never
 * writes to the database from these calls — verification is run on-demand
 * against a payload and the structured result is returned for the admin to
 * use when making the manual moderation decision.
 */
export class AiVerificationService {
  /**
   * Run AI moderation on a listing payload.
   * POST /v1/ai/listings/verify
   *
   * Stateless: does not persist anything. Returns the full structured
   * analysis (score, suggested status, validations, violations, suggestions).
   *
   * @param payload - Full listing payload to analyse
   */
  static async verifyListing(
    payload: AiVerificationRequest,
  ): Promise<ApiResponse<AiVerificationResult>> {
    return apiRequest<AiVerificationResult>({
      method: 'POST',
      url: PATHS.AI_VERIFICATION.VERIFY,
      data: payload,
      // AI multimodal analysis can take ~20-30s; override the default timeout.
      timeout: 60000,
    })
  }

  /**
   * Check whether the Python AI service is reachable.
   * GET /v1/ai/listings/service-status
   */
  static async getServiceStatus(): Promise<ApiResponse<AiServiceStatus>> {
    return apiRequest<AiServiceStatus>({
      method: 'GET',
      url: PATHS.AI_VERIFICATION.SERVICE_STATUS,
    })
  }
}
