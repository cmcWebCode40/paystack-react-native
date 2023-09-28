export type Customer = {
  email: string;
  label?: string;
  firstName?: string;
  lastName?: string;
};

export type PaymentCurrency = 'NGN' | 'GHS' | 'USD' | 'ZAR';

export type CancelResponse = {
  status: string;
};

export type Subscriptions = {
  plan: string;
  quantity?: number;
};

export type TransactionSuccessResponse = {
  transactionRef?: string;
  data?: PaystackSuccessResponse;
  status: string;
};

export type AcceptPaymentChannels =
  | 'bank'
  | 'card'
  | 'qr'
  | 'ussd'
  | 'mobile_money'
  | 'bank_transfer';

export type PaystackSuccessResponse = {
  message: string;
  redirecturl: string;
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  trxref: string;
};
