import { apiRequest } from '@/configs/axios/axiosClient'
import { PATHS } from '@/api/paths'
import {
  AiVerificationRequest,
  AiVerificationResult,
  AiDuplicateCheckResult,
  AiServiceStatus,
  AiSchedulerStatus,
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
   * Run the AI duplicate-detection pipeline for an existing listing by ID.
   * POST /v1/ai/listings/:listingId/check-duplicate
   *
   * Stateless: persists nothing. Returns the decision (PASS/SUSPICIOUS/DUPLICATE),
   * highest similarity score, and matched listings for the admin to review.
   *
   * @param listingId - ID of the listing to check
   */
  static async checkDuplicate(
    listingId: string,
  ): Promise<ApiResponse<AiDuplicateCheckResult>> {
    return apiRequest<AiDuplicateCheckResult>({
      method: 'POST',
      url: PATHS.AI_VERIFICATION.CHECK_DUPLICATE.replace(':listingId', listingId),
      // Candidate retrieval + LLM + image hashing can take a while.
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

  /**
   * Read whether the background AI auto-moderation cronjob is enabled.
   * GET /v1/ai/listings/scheduler/status
   *
   * Admin only (Bearer token + X-Admin-Id added by the axios interceptor).
   */
  static async getSchedulerStatus(): Promise<ApiResponse<AiSchedulerStatus>> {
    return apiRequest<AiSchedulerStatus>({
      method: 'GET',
      url: PATHS.AI_VERIFICATION.SCHEDULER_STATUS,
    })
  }

  /**
   * Enable or disable the AI auto-moderation scheduler at runtime.
   * PUT /v1/ai/listings/scheduler/toggle?enabled={true|false}
   *
   * Admin only. The toggle is an in-memory runtime flag on the backend and
   * resets to enabled on server restart.
   *
   * @param enabled - true to resume batch processing, false to pause it
   */
  static async toggleScheduler(
    enabled: boolean,
  ): Promise<ApiResponse<AiSchedulerStatus>> {
    return apiRequest<AiSchedulerStatus>({
      method: 'PUT',
      url: PATHS.AI_VERIFICATION.SCHEDULER_TOGGLE,
      params: { enabled },
    })
  }
}
