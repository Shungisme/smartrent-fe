import { apiRequest } from '@/configs/axios/axiosClient'
import { PATHS } from '@/api/paths'
import {
  AiVerificationRequest,
  AiVerificationResult,
  AiDuplicateCheckResult,
  AiStoredModerationResult,
  AiServiceStatus,
  AiAutoVerifySetting,
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
   * Re-run AI moderation (verify + duplicate check) for an existing listing by ID
   * and PERSIST the fresh result as the latest stored moderation.
   * POST /v1/ai/listings/:listingId/verify
   *
   * Unlike {@link verifyListing} (stateless), this writes to
   * listing_ai_moderation, so the next {@link getStoredResult} — i.e. what the
   * review dialog loads when the post is reopened — reflects this run. Returns
   * the same shape as {@link getStoredResult} (verification + duplicateCheck +
   * analyzedAt). Used by the manual "AI verify / re-verify" button.
   *
   * @param listingId - ID of the listing to re-verify
   */
  static async reVerifyById(
    listingId: string,
  ): Promise<ApiResponse<AiStoredModerationResult>> {
    return apiRequest<AiStoredModerationResult>({
      method: 'POST',
      url: PATHS.AI_VERIFICATION.VERIFY_BY_ID.replace(':listingId', listingId),
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
      url: PATHS.AI_VERIFICATION.CHECK_DUPLICATE.replace(
        ':listingId',
        listingId,
      ),
      // Candidate retrieval + LLM + image hashing can take a while.
      timeout: 60000,
    })
  }

  /**
   * Fetch the AI moderation result the auto-moderation cronjob already stored
   * for a listing, so the review UI can show it without re-running the AI.
   * GET /v1/ai/listings/:listingId/moderation-result
   *
   * `data` is null when no stored result exists (e.g. the scheduler hasn't
   * processed the listing yet).
   *
   * @param listingId - ID of the listing
   */
  static async getStoredResult(
    listingId: string,
  ): Promise<ApiResponse<AiStoredModerationResult | null>> {
    return apiRequest<AiStoredModerationResult | null>({
      method: 'GET',
      url: PATHS.AI_VERIFICATION.MODERATION_RESULT.replace(
        ':listingId',
        listingId,
      ),
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
   * Read whether the review dialog auto-runs AI analysis on open.
   * GET /v1/ai/listings/auto-verify/status
   *
   * Admin only (Bearer token + X-Admin-Id added by the axios interceptor).
   */
  static async getAutoVerifyStatus(): Promise<
    ApiResponse<AiAutoVerifySetting>
  > {
    return apiRequest<AiAutoVerifySetting>({
      method: 'GET',
      url: PATHS.AI_VERIFICATION.AUTO_VERIFY_STATUS,
    })
  }

  /**
   * Enable or disable dialog auto-verify at runtime.
   * PUT /v1/ai/listings/auto-verify/toggle?enabled={true|false}
   *
   * Admin only. Persisted in the DB, survives server restarts.
   *
   * @param enabled - true to auto-run AI analysis when the review dialog opens, false to require a manual click
   */
  static async toggleAutoVerify(
    enabled: boolean,
  ): Promise<ApiResponse<AiAutoVerifySetting>> {
    return apiRequest<AiAutoVerifySetting>({
      method: 'PUT',
      url: PATHS.AI_VERIFICATION.AUTO_VERIFY_TOGGLE,
      params: { enabled },
    })
  }
}
