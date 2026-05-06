import { getCardType } from './formatting';

export const validateCardholderName = (name: string): string | null => {
  if (!name.trim()) return 'Cardholder name is required';
  if (name.trim().length < 3) return 'Name must be at least 3 characters long';
  if (/[^a-zA-Z\s\-]/.test(name)) return 'Name can only contain letters, spaces, and hyphens';
  return null;
};

export const validateCardNumber = (cardNumber: string): string | null => {
  const cleanNumber = cardNumber.replace(/\s+/g, '');
  if (!cleanNumber) return 'Card number is required';
  if (cleanNumber.length < 13 || cleanNumber.length > 19) return 'Invalid card number length';
  if (!/^\d+$/.test(cleanNumber)) return 'Card number must contain only digits';
  
  // Basic Luhn Algorithm check
  let sum = 0;
  let isEven = false;
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i), 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    isEven = !isEven;
  }
  
  if (sum % 10 !== 0) return 'Invalid card number';
  
  return null;
};

export const validateExpiryDate = (expiry: string): string | null => {
  if (!expiry) return 'Expiry date is required';
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return 'Format must be MM/YY';
  
  const [month, year] = expiry.split('/').map((str) => parseInt(str, 10));
  
  if (month < 1 || month > 12) return 'Invalid month';
  
  const now = new Date();
  const currentYear = parseInt(now.getFullYear().toString().slice(2), 10);
  const currentMonth = now.getMonth() + 1; // 1-12
  
  if (year < currentYear) return 'Card has expired';
  if (year === currentYear && month < currentMonth) return 'Card has expired';
  if (year > currentYear + 20) return 'Invalid year';
  
  return null;
};

export const validateCvv = (cvv: string, cardNumber: string): string | null => {
  if (!cvv) return 'CVV is required';
  const cardType = getCardType(cardNumber);
  const cleanCvv = cvv.replace(/\s+/g, '');
  
  if (!/^\d+$/.test(cleanCvv)) return 'CVV must contain only digits';
  
  if (cardType === 'Amex') {
    if (cleanCvv.length !== 4) return 'Amex CVV must be 4 digits';
  } else {
    if (cleanCvv.length !== 3) return 'CVV must be 3 digits';
  }
  
  return null;
};

export const validateAmount = (amount: string): string | null => {
  if (!amount) return 'Amount is required';
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) return 'Amount must be greater than 0';
  if (numAmount > 1000000000000) return 'Amount exceeds maximum limit of 1 Trillion';
  return null;
};
