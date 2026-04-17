export type BrokerVerificationStatus =
  | 'NONE'
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'

export interface AdminBrokerUserResponse {
  userId: string
  firstName: string
  lastName: string
  email: string
  phoneCode: string
  phoneNumber: string
  isBroker: boolean
  brokerVerificationStatus: BrokerVerificationStatus
  brokerRegisteredAt: string
  brokerVerifiedAt?: string | null
  brokerVerifiedByAdminId?: string | null
  brokerRejectionReason?: string | null
  cccdFrontUrl?: string | null
  cccdBackUrl?: string | null
  certUrl?: string | null
}

export interface BrokerVerificationRequest {
  action: 'APPROVE' | 'REJECT'
  rejectionReason?: string
}

export interface BrokerStatusResponse {
  userId: string
  isBroker: boolean
  brokerVerificationStatus: BrokerVerificationStatus
  brokerRegisteredAt?: string | null
  brokerVerifiedAt?: string | null
  brokerRejectionReason?: string | null
  brokerVerificationSource?: string | null
}
