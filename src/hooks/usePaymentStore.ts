import { create } from 'zustand';
import { PaymentStatus, Transaction } from '../types';

interface PaymentState {
  status: PaymentStatus;
  transactions: Transaction[];
  transactionId: string | null;
  attempts: number;
  setStatus: (status: PaymentStatus) => void;
  addTransaction: (transaction: Transaction) => void;
  setTransactionId: (id: string | null) => void;
  incrementAttempts: () => void;
  resetAttempts: () => void;
  initStore: () => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  status: 'Idle',
  transactions: [],
  transactionId: null,
  attempts: 0,
  setStatus: (status) => set({ status }),
  addTransaction: (transaction) => set((state) => {
    const existingIndex = state.transactions.findIndex((t) => t.id === transaction.id);
    let updatedTransactions;
    
    if (existingIndex !== -1) {
      updatedTransactions = [...state.transactions];
      updatedTransactions[existingIndex] = transaction;
    } else {
      updatedTransactions = [transaction, ...state.transactions];
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('paymentTransactions', JSON.stringify(updatedTransactions));
    }
    return { transactions: updatedTransactions };
  }),
  setTransactionId: (id) => set({ transactionId: id }),
  incrementAttempts: () => set((state) => ({ attempts: state.attempts + 1 })),
  resetAttempts: () => set({ attempts: 0 }),
  initStore: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('paymentTransactions');
      if (stored) {
        try {
          set({ transactions: JSON.parse(stored) });
        } catch (e) {
          console.error('Failed to parse transactions from local storage', e);
        }
      }
    }
  }
}));
