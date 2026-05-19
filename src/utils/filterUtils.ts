/**
 * Utility functions for building and parsing API filter parameters
 * Converts between UI filter format and API filter format (key:value)
 */

/**
 * Build query parameters from filter values
 * Converts UI filters to API format: filter=key:value
 *
 * @example
 * Input: { firstName: 'John', role: ['SA', 'UA'] }
 * Output: { filter: ['firstName:John', 'role:SA,UA'] }
 */
export function buildFilterParams(
  filters: Record<string, unknown>,
): Record<string, unknown> {
  const filterArray: string[] = []

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return
    }

    if (Array.isArray(value)) {
      if (value.length > 0) {
        // CSV format for array values: role:SA,UA
        filterArray.push(`${key}:${value.join(',')}`)
      }
    } else {
      // Simple format: firstName:John
      filterArray.push(`${key}:${String(value)}`)
    }
  })

  return {
    filter: filterArray.length > 0 ? filterArray : undefined,
  }
}

/**
 * Parse API filter parameters back to UI format
 * Converts API format (key:value) back to UI filters
 *
 * @example
 * Input: { filter: ['firstName:John', 'role:SA,UA'] }
 * Output: { firstName: 'John', role: ['SA', 'UA'] }
 */
export function parseFilterParams(
  params: Record<string, unknown>,
): Record<string, unknown> {
  const filters: Record<string, unknown> = {}

  if (!params.filter) {
    return filters
  }

  const filterArray = Array.isArray(params.filter)
    ? params.filter
    : [params.filter]

  filterArray.forEach((filterStr) => {
    if (typeof filterStr === 'string') {
      const [key, value] = filterStr.split(':')
      if (key && value) {
        // Check if value contains commas (CSV format)
        if (value.includes(',')) {
          filters[key] = value.split(',').map((v) => v.trim())
        } else {
          filters[key] = value
        }
      }
    }
  })

  return filters
}

/**
 * Build complete query string for API request
 *
 * @example
 * Input: { page: 1, size: 20, firstName: 'John', role: ['SA', 'UA'] }
 * Output: { page: 1, size: 20, filter: ['firstName:John', 'role:SA,UA'] }
 */
export function buildApiParams(params: {
  page?: number
  size?: number
  [key: string]: unknown
}): Record<string, unknown> {
  const { page, size, ...filters } = params
  const result: Record<string, unknown> = {}

  if (page !== undefined) result.page = page
  if (size !== undefined) result.size = size

  const filterParams = buildFilterParams(filters)
  if (filterParams.filter) {
    result.filter = filterParams.filter
  }

  return result
}
