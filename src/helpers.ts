export const isValidNumber = (
  input: number | null | undefined | string
): boolean => {
  if (typeof input === 'number' && !isNaN(input) && input > 0) {
    return true;
  }
  return false;
};

export function toAmountInKobo(amountValue: number): number {
  return amountValue * 100;
}

export const getAmountValueInKobo = (amount: number): number => {
  if (isValidNumber(amount)) {
    return toAmountInKobo(amount);
  }
  console.warn('amount is not a number, less than 1 or a negetive value');
  return 0;
};

export const PAYSTACK_CLOSE_URL = 'https://standard.paystack.co/close';
