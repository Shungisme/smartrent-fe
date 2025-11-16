/**
 * VIP Tier Service
 *
 * Service layer for VIP tier management operations
 */

import { apiRequest } from '@/configs/axios/axiosClient'
import { ENV } from '@/constants/env'
import { PATHS } from '@/api/paths'
import type {
  VIPTier,
  VIPTiersResponse,
  VIPTierCode,
} from '@/api/types/vip-tier.type'

export class VIPTierService {
  /**
   * Get all active VIP tiers
   *
   * @returns Promise with array of active VIP tiers
   *
   * @example
   * ```typescript
   * const tiers = await VIPTierService.getActiveVIPTiers();
   * console.log('Active tiers:', tiers);
   * ```
   */
  static async getActiveVIPTiers(): Promise<VIPTiersResponse> {
    const response = await apiRequest<VIPTiersResponse>({
      method: 'GET',
      url: ENV.API + PATHS.VIP_TIER.GET_ACTIVE,
    })

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch active VIP tiers')
    }

    return response.data
  }

  /**
   * Get VIP tier by tier code
   *
   * @param tierCode - The tier code (NORMAL, SILVER, GOLD, DIAMOND)
   * @returns Promise with VIP tier details
   *
   * @example
   * ```typescript
   * const silverTier = await VIPTierService.getVIPTierByCode('SILVER');
   * console.log('Silver tier:', silverTier);
   * ```
   */
  static async getVIPTierByCode(
    tierCode: VIPTierCode | string,
  ): Promise<VIPTier> {
    const url =
      ENV.API + PATHS.VIP_TIER.GET_BY_CODE.replace(':tierCode', tierCode)

    const response = await apiRequest<VIPTier>({
      method: 'GET',
      url,
    })

    if (!response.success || !response.data) {
      throw new Error(
        response.message || `Failed to fetch VIP tier: ${tierCode}`,
      )
    }

    return response.data
  }

  /**
   * Get all VIP tiers (including inactive)
   *
   * @returns Promise with array of all VIP tiers
   *
   * @example
   * ```typescript
   * const allTiers = await VIPTierService.getAllVIPTiers();
   * console.log('All tiers (including inactive):', allTiers);
   * ```
   */
  static async getAllVIPTiers(): Promise<VIPTiersResponse> {
    const response = await apiRequest<VIPTiersResponse>({
      method: 'GET',
      url: ENV.API + PATHS.VIP_TIER.GET_ALL,
    })

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch all VIP tiers')
    }

    return response.data
  }
}
