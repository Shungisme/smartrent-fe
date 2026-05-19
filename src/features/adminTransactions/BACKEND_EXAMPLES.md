# Backend Implementation Examples

## 1. JPA Entity Example

```java
package com.smartrent.payment.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "payment_transactions", indexes = {
    @Index(name = "idx_customer_created", columnList = "customer_id,created_at DESC"),
    @Index(name = "idx_admin_created", columnList = "created_at DESC"),
    @Index(name = "idx_status_created", columnList = "status,created_at DESC"),
    @Index(name = "idx_gateway_created", columnList = "payment_gateway,created_at DESC"),
    @Index(name = "idx_invoice", columnList = "invoice_id"),
    @Index(name = "idx_landlord_created", columnList = "landlord_id,created_at DESC")
})
public class PaymentTransaction {
    @Id
    private String id; // UUID

    @Column(unique = true, nullable = false, length = 40)
    private String transactionCode; // TXN-YYYYMMDD-000001

    @Column(unique = true, nullable = false, length = 120)
    private String idempotencyKey;

    @Column(nullable = false, length = 36)
    private String customerId;

    @Column(length = 36)
    private String landlordId;

    @Column(length = 36)
    private String invoiceId;

    @Column
    private Long roomId;

    @Column(nullable = false, length = 40)
    private String paymentType; // MONTHLY_INVOICE, MEMBERSHIP_PURCHASE, etc.

    @Column(nullable = false, length = 20)
    private String status; // PENDING, SUCCESS, FAILED, CANCELLED, REFUNDED

    @Column(nullable = false, precision = 15)
    private BigDecimal amount;

    @Column(nullable = false, length = 3)
    private String currency;

    @Column(nullable = false, length = 30)
    private String paymentGateway; // VNPAY, ZALOPAY, MOMO

    @Column(length = 50)
    private String paymentMethod; // ATM, CREDIT_CARD, etc.

    @Column(length = 100)
    private String gatewayTransactionCode;

    @Column(length = 30)
    private String gatewayResponseCode;

    @Column(length = 500)
    private String failureReason;

    @Column(columnDefinition = "JSON")
    private Map<String, Object> providerPayload;

    // Snapshots for historical accuracy
    @Column(length = 150)
    private String customerNameSnapshot;

    @Column(length = 30)
    private String customerPhoneSnapshot;

    @Column(length = 150)
    private String landlordNameSnapshot;

    @Column(length = 30)
    private String landlordPhoneSnapshot;

    @Column(length = 150)
    private String roomNameSnapshot;

    @Column(length = 50)
    private String roomCodeSnapshot;

    @Column(length = 500)
    private String roomAddressSnapshot;

    @Column(length = 50)
    private String invoiceCodeSnapshot;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column
    private LocalDateTime completedAt;

    @Column
    private LocalDateTime expiredAt;

    @Version
    private Long version; // For optimistic locking

    // Getters and setters...
}
```

## 2. Repository Interface

```java
package com.smartrent.payment.repository;

import com.smartrent.payment.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import jakarta.persistence.LockModeType;
import java.util.Optional;

@Repository
public interface PaymentTransactionRepository
    extends JpaRepository<PaymentTransaction, String>,
            JpaSpecificationExecutor<PaymentTransaction> {

    Optional<PaymentTransaction> findByTransactionCode(String transactionCode);

    Optional<PaymentTransaction> findByIdempotencyKey(String idempotencyKey);

    Optional<PaymentTransaction> findByGatewayTransactionCode(String gatewayTransactionCode);

    // Lock for callback processing
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT t FROM PaymentTransaction t WHERE t.transactionCode = :transactionCode")
    Optional<PaymentTransaction> findByTransactionCodeForUpdate(String transactionCode);

    // Count for statistics
    Long countByStatusAndCreatedAtBetween(String status, LocalDateTime from, LocalDateTime to);
}
```

## 3. DTO Example

```java
package com.smartrent.payment.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class AdminTransactionDetailResponse {
    public String transactionId;
    public String transactionCode;
    public String idempotencyKey;
    public BigDecimal amount;
    public String currency;
    public String paymentGateway;
    public String paymentMethod;
    public String gatewayTransactionCode;
    public String gatewayResponseCode;
    public String status;
    public String paymentType;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    public LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    public LocalDateTime completedAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    public LocalDateTime expiredAt;

    public CustomerInfo customer;
    public LandlordInfo landlord;
    public InvoiceInfo invoice;
    public RoomInfo room;
    public String failureReason;
    public Map<String, Object> providerPayload;
    public List<TimelineEntry> timeline;

    public static class CustomerInfo {
        public String customerId;
        public String name;
        public String email;
        public String phone;
    }

    public static class LandlordInfo {
        public String landlordId;
        public String name;
        public String phone;
    }

    public static class InvoiceInfo {
        public String invoiceId;
        public String invoiceCode;
        public String status;
    }

    public static class RoomInfo {
        public Long roomId;
        public String roomCode;
        public String roomName;
        public String address;
    }

    public static class TimelineEntry {
        public String status;
        public LocalDateTime at;
        public String actorType;
        public String note;
    }
}
```

## 4. Service Example

```java
package com.smartrent.payment.service;

import com.smartrent.payment.entity.PaymentTransaction;
import com.smartrent.payment.repository.PaymentTransactionRepository;
import com.smartrent.payment.dto.response.AdminTransactionDetailResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import jakarta.persistence.criteria.*;

@Service
@Transactional(readOnly = true)
public class TransactionQueryService {

    private final PaymentTransactionRepository repository;

    public TransactionQueryService(PaymentTransactionRepository repository) {
        this.repository = repository;
    }

    public Page<PaymentTransaction> listTransactions(
        int page,
        int size,
        String q,
        String status,
        String gateway,
        String type,
        String customerId,
        String landlordId,
        String fromDate,
        String toDate,
        String sort
    ) {
        Specification<PaymentTransaction> spec = buildSpecification(
            q, status, gateway, type, customerId, landlordId, fromDate, toDate
        );

        Pageable pageable = PageRequest.of(
            page - 1,
            Math.min(size, 100), // Max 100 items
            Sort.by("createdAt").descending()
        );

        return repository.findAll(spec, pageable);
    }

    private Specification<PaymentTransaction> buildSpecification(
        String q, String status, String gateway, String type,
        String customerId, String landlordId, String fromDate, String toDate
    ) {
        return (root, query, cb) -> {
            var predicates = new java.util.ArrayList<Predicate>();

            if (q != null && !q.isEmpty()) {
                String searchTerm = q.toUpperCase();
                predicates.add(cb.or(
                    cb.like(cb.upper(root.get("transactionCode")), searchTerm + "%"),
                    cb.like(cb.upper(root.get("invoiceCodeSnapshot")), searchTerm + "%"),
                    cb.like(cb.upper(root.get("gatewayTransactionCode")), searchTerm + "%")
                ));
            }

            if (status != null && !status.isEmpty()) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (gateway != null && !gateway.isEmpty()) {
                predicates.add(cb.equal(root.get("paymentGateway"), gateway));
            }

            if (type != null && !type.isEmpty()) {
                predicates.add(cb.equal(root.get("paymentType"), type));
            }

            if (customerId != null && !customerId.isEmpty()) {
                predicates.add(cb.equal(root.get("customerId"), customerId));
            }

            if (landlordId != null && !landlordId.isEmpty()) {
                predicates.add(cb.equal(root.get("landlordId"), landlordId));
            }

            if (fromDate != null) {
                LocalDateTime fromDateTime = LocalDate.parse(fromDate).atStartOfDay();
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), fromDateTime));
            }

            if (toDate != null) {
                LocalDateTime toDateTime = LocalDate.parse(toDate).atTime(LocalTime.MAX);
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), toDateTime));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    public PaymentTransaction getTransactionDetail(String transactionId) {
        return repository.findById(transactionId)
            .orElseThrow(() -> new RuntimeException("Transaction not found"));
    }
}
```

## 5. Controller Example

```java
package com.smartrent.payment.controller;

import com.smartrent.payment.service.TransactionQueryService;
import com.smartrent.payment.dto.response.AdminTransactionDetailResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/admin/transactions")
@PreAuthorize("hasRole('ADMIN')")
public class AdminTransactionController {

    private final TransactionQueryService queryService;

    public AdminTransactionController(TransactionQueryService queryService) {
        this.queryService = queryService;
    }

    @GetMapping
    public ResponseEntity<?> listTransactions(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(required = false) String q,
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String gateway,
        @RequestParam(required = false) String type,
        @RequestParam(required = false) String customerId,
        @RequestParam(required = false) String landlordId,
        @RequestParam(required = false) String fromDate,
        @RequestParam(required = false) String toDate
    ) {
        var transactions = queryService.listTransactions(
            page, size, q, status, gateway, type, customerId, landlordId, fromDate, toDate, null
        );

        return ResponseEntity.ok(new ApiResponse(
            "200000",
            "Transactions retrieved successfully",
            transactions
        ));
    }

    @GetMapping("/{transactionId}")
    public ResponseEntity<?> getTransaction(@PathVariable String transactionId) {
        var transaction = queryService.getTransactionDetail(transactionId);
        return ResponseEntity.ok(new ApiResponse(
            "200000",
            "Transaction retrieved successfully",
            transaction
        ));
    }
}
```

These examples provide the basic structure. Expand them based on your specific needs and existing codebase patterns.
