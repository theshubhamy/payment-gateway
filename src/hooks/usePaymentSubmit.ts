import { usePaymentStore } from './usePaymentStore';
import { PaymentPayload, ApiResponse } from '../types';

export const usePaymentSubmit = () => {
  const { setStatus, addTransaction, transactionId, setTransactionId, incrementAttempts, resetAttempts } = usePaymentStore();

  const submitPayment = async (payload: Omit<PaymentPayload, 'transactionId'>) => {
    try {
      setStatus('Processing');
      incrementAttempts();

      let currentTxId = transactionId;
      if (!currentTxId) {
        currentTxId = crypto.randomUUID();
        setTransactionId(currentTxId);
      }

      const fullPayload: PaymentPayload = {
        ...payload,
        transactionId: currentTxId,
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      try {
        const response = await fetch('/api/pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fullPayload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const data: ApiResponse = await response.json();

        if (response.ok && data.status === 'Success') {
          setStatus('Success');
          addTransaction({
            id: currentTxId,
            amount: payload.amount,
            currency: payload.currency,
            status: 'Success',
            timestamp: new Date().toISOString(),
          });
        } else {
          setStatus('Failed');
          addTransaction({
            id: currentTxId,
            amount: payload.amount,
            currency: payload.currency,
            status: 'Failed',
            reason: data.reason || 'Payment declined',
            timestamp: new Date().toISOString(),
          });
        }
      } catch (error: any) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
          setStatus('Timeout');
          addTransaction({
            id: currentTxId,
            amount: payload.amount,
            currency: payload.currency,
            status: 'Timeout',
            reason: 'Request timed out after 6 seconds',
            timestamp: new Date().toISOString(),
          });
        } else {
          setStatus('Failed');
          addTransaction({
            id: currentTxId,
            amount: payload.amount,
            currency: payload.currency,
            status: 'Failed',
            reason: 'Network error occurred',
            timestamp: new Date().toISOString(),
          });
        }
      }
    } catch (e) {
      console.error(e);
      setStatus('Failed');
    }
  };

  const startNewPayment = () => {
    setStatus('Idle');
    setTransactionId(null);
    resetAttempts();
  };

  const retryPayment = (payload: Omit<PaymentPayload, 'transactionId'>) => {
    submitPayment(payload);
  };

  return { submitPayment, startNewPayment, retryPayment };
};
