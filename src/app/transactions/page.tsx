"use client";

import React, { useEffect } from 'react';
import { usePaymentStore } from '@/hooks/usePaymentStore';
import TransactionHistory from '@/components/TransactionHistory';

export default function TransactionsPage() {
  const { initStore } = usePaymentStore();

  useEffect(() => {
    initStore();
  }, [initStore]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-32 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-400/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]"></div>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center relative">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-4">
            Payment <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">History</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-xl mx-auto leading-relaxed">
            Review and manage your past transactions and security logs.
          </p>
        </header>

        <div className="animate-in slide-in-from-bottom-8 duration-700 fill-mode-both">
          <TransactionHistory />
        </div>
      </div>
    </main>
  );
}
