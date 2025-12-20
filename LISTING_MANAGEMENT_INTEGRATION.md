# Listing Management Integration - Admin Portal

## Overview
This document describes the integration of backend listing APIs into the admin portal for managing property listings.

## Changes Made

### 1. API Paths (`src/api/paths.ts`)
Added new endpoints for listing management:
- `POST /v1/listings/admin/list` - Get paginated listings with filters
- `GET /v1/listings/:id/admin` - Get listing detail with admin info
- `PUT /v1/admin/listings/:listingId/status` - Verify or reject a listing

### 2. Type Definitions (`src/api/types/listing.type.ts`)
Created comprehensive TypeScript types for:
- **Listing Types**: `ListingType`, `VipType`, `ProductType`, `PostSource`, etc.
- **Admin Verification**: `AdminVerification` interface with verification status and notes
- **Listing Data**: `AdminListingItem`, `ListingResponseWithAdmin`
- **Statistics**: `ListingStatisticsSummary` for dashboard stats
- **Filters**: `ListingFilterRequest` for flexible filtering options
- **API Responses**: Properly typed API response wrappers

### 3. Listing Service (`src/api/services/listing.service.ts`)
Created service class with methods:
- `getAdminListings(filter)` - Fetch listings with optional filters
- `getListingDetail(listingId)` - Get detailed listing info
- `changeListingStatus(listingId, request)` - Update verification status
- `verifyListing(listingId, reason)` - Convenience method to approve
- `rejectListing(listingId, reason)` - Convenience method to reject

### 4. Posts Page Refactor (`src/pages/admin/posts.tsx`)
Completely refactored to integrate with real API:

**State Management:**
- Added loading, error states
- Real-time data fetching from backend
- Statistics from API response

**Data Transformation:**
- `mapApiDataToUI()` function to convert backend response to UI format
- Proper date/time formatting
- Price formatting with Vietnamese locale
- Status mapping (pending/approved/rejected/expired)

**Features:**
- Real API integration with `useEffect` for data fetching
- Verify/Reject actions with loading states
- Verification notes and rejection reasons
- Auto-refresh after actions
- Proper error handling with user feedback

**UI Improvements:**
- Loading spinner during data fetch
- Disabled buttons during actions
- Display of existing verification notes/rejection reasons
- Better property type icons and labels

## API Endpoints Used

### Get Admin Listings
```typescript
POST /v1/listings/admin/list
Body: {
  page?: number
  size?: number
  sortBy?: 'DEFAULT' | 'PRICE_ASC' | 'PRICE_DESC' | 'NEWEST' | 'OLDEST'
  verified?: boolean
  isVerify?: boolean
  expired?: boolean
  vipType?: VipType
  // ... more filters
}
```

### Get Listing Detail
```typescript
GET /v1/listings/{id}/admin
Headers: {
  X-Admin-Id: string
}
```

### Verify/Reject Listing
```typescript
PUT /v1/admin/listings/{listingId}/status
Body: {
  verified: boolean
  reason?: string
}
```

## Statistics Dashboard

The admin portal now displays real-time statistics:
- **Total Listings**: All listings in the system
- **Pending Verification**: Awaiting admin review
- **Verified**: Approved and published listings
- **Expired**: Listings that have passed their expiry date

Additional stats available:
- Drafts count
- Shadow listings count
- Breakdown by VIP tier (Normal/Silver/Gold/Diamond)

## Filters Available

The admin can filter listings by:
- **Search**: Title/content search
- **Status**: Pending/Approved/Rejected
- **Property Type**: House/Apartment/Office/Land/Room
- **Listing Type**: For Sale/For Rent
- **VIP Type**: Normal/Silver/Gold/Diamond
- **Location**: Province/District/Ward
- **Price Range**: Min/Max price
- **Area Range**: Min/Max area
- **Bedrooms**: Min/Max bedrooms

## Verification Workflow

1. Admin opens the Posts page
2. Listings are loaded with current status
3. Admin clicks "Review" on a listing
4. Modal opens showing:
   - All listing images
   - Property details
   - Owner information
   - Current status
5. Admin can:
   - **Approve**: Add optional verification notes, click "Approve Post"
   - **Reject**: Enter rejection reason (required), click "Reject Post"
6. Action is submitted to backend
7. Page refreshes with updated data
8. Success/Error alert shown to admin

## Testing

To test the integration:

1. **Start Backend**: Ensure the backend API is running
2. **Start Admin Portal**: `npm run dev`
3. **Login as Admin**: Use admin credentials
4. **Navigate to Posts**: Click "Posts" in the sidebar
5. **Verify Functionality**:
   - Check if listings load
   - Test filters
   - Try approving a listing
   - Try rejecting a listing
   - Verify statistics update

## Error Handling

All API calls are wrapped in try-catch blocks:
- Loading states prevent duplicate requests
- Errors are logged to console
- User-friendly alerts for failures
- Page doesn't crash on API errors

## Future Improvements

Potential enhancements:
1. Add pagination controls to load more listings
2. Implement proper toast notification system
3. Add bulk actions (approve/reject multiple listings)
4. Add listing detail view in a drawer/modal
5. Add export functionality for reports
6. Add advanced filtering UI
7. Add sorting by multiple columns
8. Add listing edit functionality for admins

## Dependencies

This integration uses:
- `next-intl` for translations
- `lucide-react` for icons
- Custom DataTable component for listing display
- Radix UI Dialog for modals
- Custom axios client for API requests

## Backend API Documentation

For detailed backend API documentation, refer to:
- Swagger UI: `http://backend-url/swagger-ui.html`
- Backend README: `smartrent-backend/smart-rent/README.md`
