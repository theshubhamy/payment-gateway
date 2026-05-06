import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { 
  validateCardholderName, 
  validateCardNumber, 
  validateExpiryDate, 
  validateCvv, 
  validateAmount 
} from '@/utils/validation';
import { formatCardNumber, formatExpiryDate, getCardType } from '@/utils/formatting';
import { CreditCard, User, Calendar, Lock, IndianRupee, DollarSign } from 'lucide-react';

interface CardInputProps {
  onFormChange: (values: any) => void;
  onSubmit: (values: any) => void;
}

const CardInput: React.FC<CardInputProps> = ({ onFormChange, onSubmit }) => {
  const [values, setValues] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    amount: '',
    currency: 'INR'
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const cardNumberRef = useRef<HTMLInputElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (cursorPosition !== null && cardNumberRef.current) {
      cardNumberRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [cursorPosition, values.cardNumber]);

  useEffect(() => {
    onFormChange(values);
    
    // Validate on change for touched fields
    const newErrors: Record<string, string> = {};
    if (touched.cardholderName) newErrors.cardholderName = validateCardholderName(values.cardholderName) || '';
    if (touched.cardNumber) newErrors.cardNumber = validateCardNumber(values.cardNumber) || '';
    if (touched.expiryDate) newErrors.expiryDate = validateExpiryDate(values.expiryDate) || '';
    if (touched.cvv) newErrors.cvv = validateCvv(values.cvv, values.cardNumber) || '';
    if (touched.amount) newErrors.amount = validateAmount(values.amount) || '';
    
    setErrors(newErrors);
  }, [values, touched, onFormChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const input = e.target as HTMLInputElement;
    
    let formattedValue = value;
    
    if (name === 'cardNumber') {
      const selectionStart = input.selectionStart || 0;
      const oldValue = values.cardNumber;
      
      formattedValue = formatCardNumber(value);
      
      // Calculate cursor position after formatting
      // Count digits before cursor in the original value
      const digitsBeforeCursor = value.slice(0, selectionStart).replace(/\D/g, '').length;
      
      // Find position in formatted value that has the same number of digits before it
      let newPos = 0;
      let digitsFound = 0;
      for (let i = 0; i < formattedValue.length && digitsFound < digitsBeforeCursor; i++) {
        if (/\d/.test(formattedValue[i])) {
          digitsFound++;
        }
        newPos = i + 1;
      }
      
      setCursorPosition(newPos);
      setValues(prev => ({ ...prev, [name]: formattedValue }));
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
      setValues(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setValues(prev => ({ ...prev, [name]: formattedValue }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const isFormValid = () => {
    return (
      !validateCardholderName(values.cardholderName) &&
      !validateCardNumber(values.cardNumber) &&
      !validateExpiryDate(values.expiryDate) &&
      !validateCvv(values.cvv, values.cardNumber) &&
      !validateAmount(values.amount)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onSubmit(values);
    }
  };

  const cardType = getCardType(values.cardNumber);

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-8 bg-white/70 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] border border-white/60 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors duration-700"></div>
      
      {/* Amount and Currency */}
      <div className="flex gap-6">
        <div className="flex-[2] relative">
          <label htmlFor="amount" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Payment Amount</label>
          <div className="relative group/input">
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              value={values.amount}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0.00"
              aria-describedby={errors.amount ? 'amount-error' : undefined}
              className={`w-full pl-12 pr-4 py-4 bg-slate-50/50 border-2 rounded-2xl focus:ring-4 focus:outline-none transition-all duration-300 text-lg font-bold ${
                errors.amount && touched.amount 
                  ? 'border-red-200 focus:ring-red-100 bg-red-50/30' 
                  : 'border-slate-100 focus:border-blue-500/50 focus:ring-blue-50'
              }`}
            />
            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${errors.amount && touched.amount ? 'text-red-400' : 'text-slate-400'}`}>
              {values.currency === 'INR' ? <IndianRupee className="w-5 h-5" /> : <DollarSign className="w-5 h-5" />}
            </div>
          </div>
          {errors.amount && touched.amount && (
            <p id="amount-error" className="mt-2 text-xs text-red-500 font-bold flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span> {errors.amount}
            </p>
          )}
        </div>
        <div className="flex-1">
          <label htmlFor="currency" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Currency</label>
          <div className="relative">
            <select
              id="currency"
              name="currency"
              value={values.currency}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500/50 focus:outline-none transition-all duration-300 appearance-none cursor-pointer text-lg font-bold"
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Cardholder Name */}
      <div>
        <label htmlFor="cardholderName" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Cardholder Name</label>
        <div className="relative group/input">
          <input
            id="cardholderName"
            name="cardholderName"
            type="text"
            value={values.cardholderName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="John Doe"
            aria-describedby={errors.cardholderName ? 'name-error' : undefined}
            className={`w-full pl-12 pr-4 py-4 bg-slate-50/50 border-2 rounded-2xl focus:ring-4 focus:outline-none transition-all duration-300 font-medium ${
              errors.cardholderName && touched.cardholderName 
                ? 'border-red-200 focus:ring-red-100 bg-red-50/30' 
                : 'border-slate-100 focus:border-blue-500/50 focus:ring-blue-50'
            }`}
          />
          <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${errors.cardholderName && touched.cardholderName ? 'text-red-400' : 'text-slate-400'}`} />
        </div>
        {errors.cardholderName && touched.cardholderName && (
          <p id="name-error" className="mt-2 text-xs text-red-500 font-bold flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
            <span className="w-1 h-1 bg-red-500 rounded-full"></span> {errors.cardholderName}
          </p>
        )}
      </div>

      {/* Card Number */}
      <div>
        <div className="flex justify-between items-center mb-2 ml-1">
          <label htmlFor="cardNumber" className="block text-xs font-bold uppercase tracking-widest text-slate-400">Card Number</label>
          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md transition-all duration-300 ${
            cardType === 'Visa' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
            cardType === 'Mastercard' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
            cardType === 'Amex' ? 'bg-teal-100 text-teal-700 border border-teal-200' :
            'bg-slate-100 text-slate-500 border border-slate-200'
          }`}>
            {cardType}
          </span>
        </div>
        <div className="relative group/input">
            <input
              id="cardNumber"
              name="cardNumber"
              type="text"
              ref={cardNumberRef}
              value={values.cardNumber}
              onChange={handleChange}
              onBlur={handleBlur}
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            aria-describedby={errors.cardNumber ? 'card-error' : undefined}
            className={`w-full pl-12 pr-4 py-4 bg-slate-50/50 border-2 rounded-2xl font-mono text-xl focus:ring-4 focus:outline-none transition-all duration-300 ${
              errors.cardNumber && touched.cardNumber 
                ? 'border-red-200 focus:ring-red-100 bg-red-50/30' 
                : 'border-slate-100 focus:border-blue-500/50 focus:ring-blue-50'
            }`}
          />
          <CreditCard className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${errors.cardNumber && touched.cardNumber ? 'text-red-400' : 'text-slate-400'}`} />
        </div>
        {errors.cardNumber && touched.cardNumber && (
          <p id="card-error" className="mt-2 text-xs text-red-500 font-bold flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
            <span className="w-1 h-1 bg-red-500 rounded-full"></span> {errors.cardNumber}
          </p>
        )}
      </div>

      {/* Expiry and CVV */}
      <div className="flex gap-6">
        <div className="flex-1">
          <label htmlFor="expiryDate" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Expiry</label>
          <div className="relative group/input">
            <input
              id="expiryDate"
              name="expiryDate"
              type="text"
              value={values.expiryDate}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="MM/YY"
              maxLength={5}
              aria-describedby={errors.expiryDate ? 'expiry-error' : undefined}
              className={`w-full pl-12 pr-4 py-4 bg-slate-50/50 border-2 rounded-2xl font-mono focus:ring-4 focus:outline-none transition-all duration-300 font-bold ${
                errors.expiryDate && touched.expiryDate 
                  ? 'border-red-200 focus:ring-red-100 bg-red-50/30' 
                  : 'border-slate-100 focus:border-blue-500/50 focus:ring-blue-50'
              }`}
            />
            <Calendar className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${errors.expiryDate && touched.expiryDate ? 'text-red-400' : 'text-slate-400'}`} />
          </div>
          {errors.expiryDate && touched.expiryDate && (
            <p id="expiry-error" className="mt-2 text-xs text-red-500 font-bold flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span> {errors.expiryDate}
            </p>
          )}
        </div>
        
        <div className="flex-1">
          <label htmlFor="cvv" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">CVV</label>
          <div className="relative group/input">
            <input
              id="cvv"
              name="cvv"
              type="password"
              value={values.cvv}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={cardType === 'Amex' ? '••••' : '•••'}
              maxLength={cardType === 'Amex' ? 4 : 3}
              aria-describedby={errors.cvv ? 'cvv-error' : undefined}
              className={`w-full pl-12 pr-4 py-4 bg-slate-50/50 border-2 rounded-2xl font-mono focus:ring-4 focus:outline-none transition-all duration-300 font-bold ${
                errors.cvv && touched.cvv 
                  ? 'border-red-200 focus:ring-red-100 bg-red-50/30' 
                  : 'border-slate-100 focus:border-blue-500/50 focus:ring-blue-50'
              }`}
            />
            <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${errors.cvv && touched.cvv ? 'text-red-400' : 'text-slate-400'}`} />
          </div>
          {errors.cvv && touched.cvv && (
            <p id="cvv-error" className="mt-2 text-xs text-red-500 font-bold flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span> {errors.cvv}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={!isFormValid()}
        className={`w-full py-5 mt-4 rounded-2xl font-black text-lg transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] relative overflow-hidden group/btn ${
          isFormValid() 
            ? 'bg-slate-900 text-white hover:bg-black hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] active:scale-[0.97]' 
            : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
        }`}
      >
        <span className="relative z-10 truncate px-4">
          Complete Payment {values.amount ? `(${values.currency} ${parseFloat(values.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })})` : ''}
        </span>
        {isFormValid() && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 mt-6">
        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
        </svg>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bank-level 256-bit SSL encryption</span>
      </div>
    </form>
  );
};

export default CardInput;
