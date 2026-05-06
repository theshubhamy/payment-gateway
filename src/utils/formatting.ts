import { CardType } from '../types';

export const formatCardNumber = (value: string): string => {
  const v = value.replace(/\D/gi, '');
  const parts = v.match(/.{1,4}/g);
  return parts ? parts.join(' ') : v;
};

export const getCardType = (cardNumber: string): CardType => {
  const cleanNumber = cardNumber.replace(/\s+/g, '');
  
  if (/^4/.test(cleanNumber)) return 'Visa';
  if (/^5[1-5]/.test(cleanNumber) || /^2(2[2-9][1-9]|2[3-9][0-9]|[3-6][0-9]{2}|7[0-1][0-9]|720)/.test(cleanNumber)) return 'Mastercard';
  if (/^3[47]/.test(cleanNumber)) return 'Amex';
  
  return 'Unknown';
};

export const formatExpiryDate = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  if (cleanValue.length >= 3) {
    return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`;
  }
  return cleanValue;
};
