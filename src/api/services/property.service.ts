import { PropertyCard } from '@/api/types/property.type'
import { ListFilters, ListFetcherResponse } from '@/contexts/list/index.type'
import { mockProperties } from '@/components/organisms/propertyList/index.helper'

export const propertyFetcher = async (
  filters: ListFilters,
): Promise<ListFetcherResponse<PropertyCard>> => {
  await new Promise((resolve) => setTimeout(resolve, 300))

  let filteredProperties = [...mockProperties]

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filteredProperties = filteredProperties.filter(
      (property) =>
        property.title.toLowerCase().includes(searchLower) ||
        property.description.toLowerCase().includes(searchLower) ||
        property.address.toLowerCase().includes(searchLower) ||
        property.city.toLowerCase().includes(searchLower) ||
        property.property_type.toLowerCase().includes(searchLower),
    )
  }

  if (filters.propertyType) {
    filteredProperties = filteredProperties.filter(
      (property) => property.property_type === filters.propertyType,
    )
  }

  if (filters.minPrice !== undefined) {
    filteredProperties = filteredProperties.filter(
      (property) => property.price >= filters.minPrice!,
    )
  }
  if (filters.maxPrice !== undefined) {
    filteredProperties = filteredProperties.filter(
      (property) => property.price <= filters.maxPrice!,
    )
  }

  if (filters.bedrooms !== undefined) {
    filteredProperties = filteredProperties.filter(
      (property) => property.bedrooms >= filters.bedrooms!,
    )
  }

  if (filters.bathrooms !== undefined) {
    filteredProperties = filteredProperties.filter(
      (property) => property.bathrooms >= filters.bathrooms!,
    )
  }

  if (filters.amenities && filters.amenities.length > 0) {
    filteredProperties = filteredProperties.filter((property) => {
      const propertyAmenities = property.amenities || []
      return filters.amenities!.every((amenity) =>
        propertyAmenities.some((propAmenity) =>
          propAmenity.toLowerCase().includes(amenity.toLowerCase()),
        ),
      )
    })
  }

  if (filters.city) {
    filteredProperties = filteredProperties.filter((property) =>
      property.city.toLowerCase().includes(filters.city!.toLowerCase()),
    )
  }

  const perPage = filters.perPage || 10
  const page = filters.page || 1
  const total = filteredProperties.length
  const totalPages = Math.ceil(total / perPage)
  const startIndex = (page - 1) * perPage
  const endIndex = startIndex + perPage
  const paginatedProperties = filteredProperties.slice(startIndex, endIndex)

  return {
    data: paginatedProperties,
    total: total,
    page: page,
    totalPages: totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  }
}

export const getInitialProperties = async (): Promise<PropertyCard[]> => {
  const response = await propertyFetcher({
    search: '',
    perPage: 10,
    page: 1,
  })

  return response.data
}
