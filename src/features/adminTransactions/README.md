# Admin Transaction Management Feature

Admin Transaction Management is a comprehensive feature for managing and monitoring all payment transactions across the SmartRent platform.

## Features

- **Transaction List View**: View all transactions with filtering and pagination
- **Transaction Detail View**: Inspect full transaction details including timeline and provider information
- **Real-time Statistics**: Dashboard with key metrics (total revenue, success rate, etc.)
- **Revenue Charts**: Visualize revenue trends over time
- **Advanced Filtering**: Filter by status, gateway, date range, customer, landlord, and more
- **Search**: Search transactions by code, invoice code, or gateway transaction code
- **CSV Export**: Export filtered transactions as CSV for analysis
- **Transaction Timeline**: Audit trail showing status changes and actor information

## File Structure

```
adminTransactions/
├── api/
│   └── adminTransactionsApi.ts       # API service for backend communication
├── components/
│   ├── AdminTransactionTable.tsx     # Main transaction table component
│   ├── AdminTransactionFilters.tsx   # Filter UI component
│   ├── TransactionStatisticsCards.tsx # Statistics dashboard widgets
│   ├── RevenueChart.tsx              # Revenue visualization
│   └── TransactionTimeline.tsx       # Status change history timeline
├── hooks/
│   └── useAdminTransactions.ts       # React Query hooks for data fetching
├── pages/
│   ├── AdminTransactionsPage.tsx     # List page container
│   └── AdminTransactionDetailPage.tsx # Detail page container
├── types/
│   └── transaction.type.ts           # TypeScript types and interfaces
├── utils/
│   └── formatters.ts                 # Formatting utilities for dates, currency, etc.
├── index.ts                          # Barrel export file
└── README.md                         # This file
```

## API Endpoints

The feature communicates with these backend endpoints:

```
GET    /v1/admin/transactions              - List transactions
GET    /v1/admin/transactions/{id}         - Get transaction detail
GET    /v1/admin/transactions/statistics   - Get statistics summary
GET    /v1/admin/transactions/revenue-series - Get revenue trend data
GET    /v1/admin/transactions/export       - Export as CSV
```

## Usage

### List Transactions

```typescript
import { AdminTransactionsPage } from '@/features/adminTransactions';

export default function TransactionsPage() {
  return <AdminTransactionsPage />;
}
```

### View Transaction Detail

```typescript
import { AdminTransactionDetailPage } from '@/features/adminTransactions';

export default function TransactionDetailPage() {
  return <AdminTransactionDetailPage />;
}
```

### Use Transaction Data Hook

```typescript
import { useAdminTransactions } from '@/features/adminTransactions';

function MyComponent() {
  const { data, isLoading, error } = useAdminTransactions({
    page: 1,
    size: 20,
    status: 'SUCCESS',
    fromDate: '2026-05-01',
    toDate: '2026-05-31',
  });

  return (
    // Your component JSX
  );
}
```

### Use Statistics Hook

```typescript
import { useTransactionStatistics } from '@/features/adminTransactions';

function StatsComponent() {
  const { data: statistics } = useTransactionStatistics('2026-05-01', '2026-05-31');

  return (
    // Display statistics
  );
}
```

## Filter Options

Transactions can be filtered by:

- **Search Query**: Transaction code, invoice code, gateway transaction code
- **Status**: PENDING, SUCCESS, FAILED, CANCELLED, REFUNDED
- **Gateway**: VNPAY, ZALOPAY, MOMO (extensible)
- **Payment Type**: MONTHLY_INVOICE, MEMBERSHIP_PURCHASE, LISTING_BOOST, etc.
- **Customer ID**: Filter by specific customer
- **Landlord ID**: Filter by specific landlord
- **Date Range**: From date to date (inclusive)

## Formatting Utilities

The feature includes several formatting utilities:

```typescript
import {
  formatVND, // Format to Vietnamese currency
  formatDateTime, // Format datetime string
  formatDate, // Format date string only
  getPaymentStatusLabel, // Get label for payment status
  getPaymentGatewayLabel, // Get label for gateway
  getPaymentTypeLabel, // Get label for payment type
  formatPhoneNumber, // Format phone numbers
  getDateRange, // Get date range for quick filters
} from '@/features/adminTransactions'
```

## Types

### AdminTransaction

Basic transaction information for list view.

### AdminTransactionDetail

Full transaction details including provider payload and timeline.

### AdminTransactionFilters

Filter parameters for querying transactions.

### TransactionStatistics

Aggregated statistics including revenue, success rate, etc.

### TransactionTimeline

Audit trail entry with status, timestamp, actor, and note.

## Internationalization (i18n)

Translations are available in:

- `src/messages/en.json` - English translations
- `src/messages/vi.json` - Vietnamese translations

All UI text is pulled from the `admin.transactions` and `transactions` namespaces in the i18n files.

## Backend Schema

The feature expects the following database schema:

```sql
CREATE TABLE payment_transactions (
  id CHAR(36) PRIMARY KEY,
  transaction_code VARCHAR(40) NOT NULL UNIQUE,
  idempotency_key VARCHAR(120) NOT NULL UNIQUE,
  customer_id CHAR(36) NOT NULL,
  landlord_id CHAR(36),
  invoice_id CHAR(36),
  room_id BIGINT,

  payment_type VARCHAR(40) NOT NULL,
  status VARCHAR(20) NOT NULL,
  amount DECIMAL(15, 0) NOT NULL,
  currency CHAR(3) DEFAULT 'VND',

  payment_gateway VARCHAR(30) NOT NULL,
  payment_method VARCHAR(50),
  gateway_transaction_code VARCHAR(100),
  gateway_response_code VARCHAR(30),

  failure_reason VARCHAR(500),
  provider_payload JSON,

  customer_name_snapshot VARCHAR(150),
  customer_phone_snapshot VARCHAR(30),
  landlord_name_snapshot VARCHAR(150),
  landlord_phone_snapshot VARCHAR(30),
  room_name_snapshot VARCHAR(150),
  room_code_snapshot VARCHAR(50),

  created_at DATETIME(6) NOT NULL,
  updated_at DATETIME(6) NOT NULL,
  completed_at DATETIME(6),
  expired_at DATETIME(6),

  KEY idx_customer_created (customer_id, created_at DESC),
  KEY idx_status_created (status, created_at DESC),
  KEY idx_gateway_created (payment_gateway, created_at DESC),
);
```

## Key Implementation Details

1. **React Query**: Uses TanStack Query (React Query) for server state management
2. **Axios**: HTTP requests via configured Axios instance
3. **Type Safety**: Full TypeScript support with comprehensive types
4. **Performance**: Uses React Query caching to minimize API calls
5. **i18n**: Internationalization ready with English and Vietnamese translations
6. **Responsive**: Mobile-friendly UI with responsive grid layouts
7. **Error Handling**: Graceful error handling with user feedback
8. **Loading States**: Loading indicators for async operations

## Customization

### Adding Custom Formatting

Add new formatters to `utils/formatters.ts`:

```typescript
export const formatCustomField = (value: any): string => {
  // Your custom formatting logic
}
```

### Adding New Filters

Update `AdminTransactionFilters` interface and `AdminTransactionFiltersComponent`:

```typescript
interface AdminTransactionFilters {
  // ... existing fields
  customFilter?: string
}
```

### Adding New Statistics

Create new cards in `TransactionStatisticsCards` component or create a new statistics component.

## Dependencies

- React 18+
- Next.js 15+
- TypeScript
- TanStack Query (React Query)
- React i18next
- Lucide React (icons)

## Routes

- `/admin/transactions` - Transaction list
- `/admin/transactions/:transactionId` - Transaction detail

## Notes

- All timestamps are in ISO 8601 format and converted to local timezone for display
- Phone numbers are formatted automatically for better readability
- Currency is displayed in Vietnamese Dong (VND)
- CSV export includes all transaction fields for external analysis
- Provider payload is only visible in detail view for debugging purposes
