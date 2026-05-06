export type PaymentStatus = 'Idle' | 'Processing' | 'Success' | 'Failed' | 'Timeout';

export type CardType = 'Visa' | 'Mastercard' | 'Amex' | 'Unknown';

export interface PaymentPayload {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string; // MM/YY
  cvv: string;
  amount: number;
  currency: string;
  transactionId: string;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  timestamp: string;
  reason?: string;
}

export interface ApiResponse {
  status: 'Success' | 'Failed';
  reason?: string;
  transactionId: string;
}
