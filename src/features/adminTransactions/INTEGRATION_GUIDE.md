# Admin Transaction Management - Integration Guide

## Overview

This document provides a comprehensive guide for implementing the Admin Transaction Management feature backend and frontend integration.

## Frontend Setup (Already Completed)

### Routes Available

1. **Dashboard**: `/admin/transactions/dashboard`
   - Shows key statistics and revenue trends
   - Quick date range filters (7 days, this month, this quarter)

2. **List View**: `/admin/transactions`
   - Complete transaction list with filtering
   - Advanced search and export functionality
   - Pagination support

3. **Detail View**: `/admin/transactions/:transactionId`
   - Full transaction information
   - Payment timeline/audit trail
   - Provider payload for debugging
   - Customer and landlord information

## Backend Requirements

### 1. Database Schema

Create the following tables in your MySQL database:

```sql
-- Main transactions table
CREATE TABLE payment_transactions (
  id CHAR(36) PRIMARY KEY COMMENT 'UUID',
  transaction_code VARCHAR(40) NOT NULL UNIQUE COMMENT 'Unique transaction identifier TXN-YYYYMMDD-000001',
  idempotency_key VARCHAR(120) NOT NULL UNIQUE COMMENT 'Prevents duplicate processing',

  -- References
  customer_id CHAR(36) NOT NULL COMMENT 'Customer who made the payment',
  landlord_id CHAR(36) NULL COMMENT 'Landlord receiving the payment',
  invoice_id CHAR(36) NULL COMMENT 'Associated invoice',
  room_id BIGINT NULL COMMENT 'Room ID for rental payments',
  listing_id BIGINT NULL COMMENT 'Listing ID for posting fees',

  -- Payment Details
  payment_type VARCHAR(40) NOT NULL COMMENT 'MONTHLY_INVOICE, MEMBERSHIP_PURCHASE, LISTING_BOOST, LISTING_POST, DEPOSIT',
  status VARCHAR(20) NOT NULL COMMENT 'PENDING, SUCCESS, FAILED, CANCELLED, REFUNDED',
  amount DECIMAL(15, 0) NOT NULL COMMENT 'Amount in smallest currency unit (VND)',
  currency CHAR(3) NOT NULL DEFAULT 'VND',

  -- Gateway Information
  payment_gateway VARCHAR(30) NOT NULL COMMENT 'VNPAY, ZALOPAY, MOMO',
  payment_method VARCHAR(50) NULL COMMENT 'ATM, CREDIT_CARD, etc',
  gateway_transaction_code VARCHAR(100) NULL COMMENT 'Transaction code from gateway',
  gateway_response_code VARCHAR(30) NULL COMMENT 'Response code from gateway',
  gateway_bank_code VARCHAR(50) NULL COMMENT 'Bank code if applicable',

  -- Failure Information
  failure_reason VARCHAR(500) NULL COMMENT 'Reason for failure or cancellation',
  order_info VARCHAR(500) NULL COMMENT 'Additional order information',
  provider_payload JSON NULL COMMENT 'Raw response from payment gateway',

  -- Snapshots (for historical accuracy)
  customer_name_snapshot VARCHAR(150) NULL,
  customer_phone_snapshot VARCHAR(30) NULL,
  landlord_name_snapshot VARCHAR(150) NULL,
  landlord_phone_snapshot VARCHAR(30) NULL,
  room_name_snapshot VARCHAR(150) NULL,
  room_code_snapshot VARCHAR(50) NULL,
  room_address_snapshot VARCHAR(500) NULL,
  invoice_code_snapshot VARCHAR(50) NULL,

  -- Timestamps
  created_at DATETIME(6) NOT NULL,
  updated_at DATETIME(6) NOT NULL,
  completed_at DATETIME(6) NULL,
  expired_at DATETIME(6) NULL,
  version BIGINT NOT NULL DEFAULT 0 COMMENT 'For optimistic locking',

  -- Indexes for performance
  UNIQUE KEY uk_transaction_code (transaction_code),
  UNIQUE KEY uk_idempotency_key (idempotency_key),
  UNIQUE KEY uk_gateway_transaction (payment_gateway, gateway_transaction_code),
  KEY idx_customer_created (customer_id, created_at DESC),
  KEY idx_admin_created (created_at DESC),
  KEY idx_status_created (status, created_at DESC),
  KEY idx_type_created (payment_type, created_at DESC),
  KEY idx_gateway_created (payment_gateway, created_at DESC),
  KEY idx_invoice (invoice_id),
  KEY idx_landlord_created (landlord_id, created_at DESC),
  KEY idx_search_codes (transaction_code, invoice_code_snapshot, gateway_transaction_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Audit/Timeline table
CREATE TABLE payment_transaction_audits (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  transaction_id CHAR(36) NOT NULL,
  old_status VARCHAR(20) NULL,
  new_status VARCHAR(20) NOT NULL,
  actor_type VARCHAR(20) NOT NULL COMMENT 'SYSTEM, GATEWAY, ADMIN, CUSTOMER',
  actor_id VARCHAR(36) NULL COMMENT 'Who made the change',
  reason VARCHAR(500) NULL COMMENT 'Why the change was made',
  provider_event_id VARCHAR(120) NULL COMMENT 'Provider event ID if applicable',
  created_at DATETIME(6) NOT NULL,

  KEY idx_audit_transaction (transaction_id, created_at),
  FOREIGN KEY (transaction_id) REFERENCES payment_transactions(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2. API Endpoints to Implement

#### List Transactions

```
GET /v1/admin/transactions
Authorization: Bearer {admin_token}

Query Parameters:
- page: number (1-based, default 1)
- size: number (default 20, max 100)
- q: string (search term)
- status: PENDING|SUCCESS|FAILED|CANCELLED|REFUNDED
- gateway: VNPAY|ZALOPAY|MOMO
- type: payment type
- customerId: UUID
- landlordId: UUID
- fromDate: YYYY-MM-DD
- toDate: YYYY-MM-DD
- sort: field,direction (default: createdAt,desc)

Response:
{
  "code": "200000",
  "message": "Transactions retrieved successfully",
  "data": {
    "page": 1,
    "size": 20,
    "totalElements": 1284,
    "totalPages": 65,
    "data": [
      {
        "transactionId": "6f5d6e8a-7ff7-4c40-95af-a7c65f4ff111",
        "transactionCode": "TXN-20260516-000128",
        "amount": 2500000,
        "currency": "VND",
        "paymentGateway": "VNPAY",
        "paymentMethod": "ATM",
        "gatewayTransactionCode": "15356501",
        "status": "SUCCESS",
        "paymentType": "MONTHLY_INVOICE",
        "createdAt": "2026-05-16T10:15:30",
        "completedAt": "2026-05-16T10:17:02",
        "customer": {
          "customerId": "13ad9071-279a-4758-9caf-9758d259187d",
          "name": "Tran Thi B",
          "phone": "0912345678"
        },
        "landlord": {
          "landlordId": "9a2d1bdc-1121-4431-a278-a4fb5f3ef222",
          "name": "Nguyen Van A",
          "phone": "0901234567"
        },
        "invoice": {
          "invoiceId": "8f5f1a4b-4d1f-4d2a-9e10-7f1c95b22121",
          "invoiceCode": "INV-202605-0009"
        },
        "room": {
          "roomId": 102,
          "roomCode": "A102",
          "roomName": "Room A102"
        },
        "failureReason": null
      }
    ]
  }
}
```

#### Get Transaction Detail

```
GET /v1/admin/transactions/{transactionId}
Authorization: Bearer {admin_token}

Response:
{
  "code": "200000",
  "message": "Transaction retrieved successfully",
  "data": {
    "transactionId": "6f5d6e8a-7ff7-4c40-95af-a7c65f4ff111",
    "transactionCode": "TXN-20260516-000128",
    "idempotencyKey": "invoice:8f5f1a4b:attempt:1",
    "amount": 2500000,
    "currency": "VND",
    "paymentGateway": "VNPAY",
    "paymentMethod": "ATM",
    "gatewayTransactionCode": "15356501",
    "gatewayResponseCode": "00",
    "status": "SUCCESS",
    "paymentType": "MONTHLY_INVOICE",
    "createdAt": "2026-05-16T10:15:30",
    "completedAt": "2026-05-16T10:17:02",
    "expiredAt": "2026-05-16T10:30:30",
    "customer": {
      "customerId": "13ad9071-279a-4758-9caf-9758d259187d",
      "name": "Tran Thi B",
      "email": "tenant@example.com",
      "phone": "0912345678"
    },
    "landlord": {
      "landlordId": "9a2d1bdc-1121-4431-a278-a4fb5f3ef222",
      "name": "Nguyen Van A",
      "phone": "0901234567"
    },
    "invoice": {
      "invoiceId": "8f5f1a4b-4d1f-4d2a-9e10-7f1c95b22121",
      "invoiceCode": "INV-202605-0009",
      "status": "PAID"
    },
    "room": {
      "roomId": 102,
      "roomCode": "A102",
      "roomName": "Room A102",
      "address": "12 Nguyen Trai, District 1, Ho Chi Minh City"
    },
    "failureReason": null,
    "providerPayload": {
      "vnp_TxnRef": "TXN-20260516-000128",
      "vnp_TransactionNo": "15356501",
      "vnp_ResponseCode": "00"
    },
    "timeline": [
      {
        "status": "PENDING",
        "at": "2026-05-16T10:15:30",
        "actorType": "SYSTEM",
        "note": "Payment created"
      },
      {
        "status": "SUCCESS",
        "at": "2026-05-16T10:17:02",
        "actorType": "GATEWAY",
        "note": "VNPay callback accepted"
      }
    ]
  }
}
```

#### Get Statistics

```
GET /v1/admin/transactions/statistics
Authorization: Bearer {admin_token}

Query Parameters:
- fromDate: YYYY-MM-DD
- toDate: YYYY-MM-DD

Response:
{
  "code": "200000",
  "message": "Transaction statistics retrieved successfully",
  "data": {
    "totalRevenue": 245000000,
    "totalTransactions": 1294,
    "successfulPayments": 1180,
    "failedPayments": 72,
    "pendingPayments": 35,
    "cancelledPayments": 5,
    "refundedPayments": 2,
    "successRate": 91.19,
    "averageSuccessfulAmount": 207627
  }
}
```

#### Get Revenue Series

```
GET /v1/admin/transactions/revenue-series
Authorization: Bearer {admin_token}

Query Parameters:
- groupBy: DAY|MONTH
- fromDate: YYYY-MM-DD
- toDate: YYYY-MM-DD

Response:
{
  "code": "200000",
  "message": "Revenue series retrieved successfully",
  "data": [
    {
      "period": "2026-05-01",
      "revenue": 8500000,
      "successfulCount": 42
    },
    {
      "period": "2026-05-02",
      "revenue": 9200000,
      "successfulCount": 49
    }
  ]
}
```

#### Export Transactions (CSV)

```
GET /v1/admin/transactions/export
Authorization: Bearer {admin_token}

Query Parameters: (Same as list endpoint)

Response: CSV file with columns
Transaction Code, Invoice Code, Customer Name, Customer Phone, Landlord Name,
Room, Type, Gateway, Gateway Transaction Code, Status, Amount,
Created At, Completed At, Failure Reason
```

### 3. Implementation Checklist

- [ ] Create PaymentTransaction entity with all fields
- [ ] Create PaymentTransactionAudit entity
- [ ] Create repositories (PaymentTransactionRepository, PaymentTransactionAuditRepository)
- [ ] Create DTOs for request/response
- [ ] Create enums (PaymentStatus, PaymentType, PaymentGateway)
- [ ] Implement TransactionQueryService
- [ ] Implement TransactionExportService
- [ ] Implement TransactionStatisticsService
- [ ] Create AdminTransactionController
- [ ] Add proper authorization checks (@PreAuthorize("hasRole('ADMIN')"))
- [ ] Add input validation
- [ ] Add error handling
- [ ] Create database migrations (Flyway/Liquibase)
- [ ] Add pagination (max 100 items)
- [ ] Add request logging
- [ ] Add audit logging

### 4. Authorization

All endpoints require:

```
- Authenticated user
- ADMIN role
- Authorization: Bearer {admin_token}
```

### 5. Error Handling

Expected error responses:

```json
{
  "code": "401000",
  "message": "Unauthorized"
}
```

```json
{
  "code": "403000",
  "message": "Forbidden - Admin role required"
}
```

```json
{
  "code": "404000",
  "message": "Transaction not found"
}
```

```json
{
  "code": "500000",
  "message": "Internal server error"
}
```

## Testing

### Frontend Testing

1. **Test List View**
   - Verify pagination works
   - Test all filters
   - Test search functionality
   - Test CSV export

2. **Test Detail View**
   - Verify all fields display
   - Verify timeline shows correctly
   - Verify provider payload displays

3. **Test Dashboard**
   - Verify statistics load
   - Verify chart renders
   - Test date range selection

### Backend Testing

1. **Unit Tests**
   - Repository queries
   - Service business logic
   - DTO conversions

2. **Integration Tests**
   - API endpoints return correct data
   - Pagination works correctly
   - Filters apply correctly
   - Authorization works

3. **Load Tests**
   - Test with large number of transactions
   - Test complex filters
   - Test CSV export with large datasets

## Notes

- Use transactions for data consistency
- Implement optimistic locking with @Version
- Cache statistics for 1-5 minutes
- Use prepared statements to prevent SQL injection
- Validate all input on backend
- Log important operations
- Use snapshot fields for historical accuracy
- Never delete transaction records (soft delete at most)
- Keep provider payload for debugging
- Monitor API response times

## Future Enhancements

- Advanced search with full-text indexing
- Excel export with formatting
- Transaction dispute/refund management
- Payment gateway webhook verification
- Real-time transaction monitoring
- Custom report generation
- Transaction analytics and trends
- Scheduled transaction reconciliation
