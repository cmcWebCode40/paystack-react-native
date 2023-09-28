import { getAmountValueInKobo, isValidNumber } from '../helpers';

describe('helpers to convert currency', () => {
  it('convert amount in kobo', () => {
    const amountInKobo = getAmountValueInKobo(50);
    expect(amountInKobo).toBe(5000);
  });

  it('Is amount a valid number', () => {
    expect(isValidNumber(50)).toBeTruthy();
  });

  it('Is amount  not a valid number', () => {
    expect(isValidNumber('50')).toBeFalsy();
  });
});
