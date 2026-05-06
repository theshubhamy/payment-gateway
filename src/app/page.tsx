"use client";

import React, { useState, useEffect } from 'react';
import { usePaymentStore } from '@/hooks/usePaymentStore';
import { usePaymentSubmit } from '@/hooks/usePaymentSubmit';
import CardInput from '@/components/CardInput';
import CardPreview from '@/components/CardPreview';
import StatusScreen from '@/components/StatusScreen';
import TransactionHistory from '@/components/TransactionHistory';

export default function Home() {
  const { status, initStore } = usePaymentStore();
  const { submitPayment, startNewPayment, retryPayment } = usePaymentSubmit();
  
  const [formData, setFormData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    amount: '',
    currency: 'INR'
  });

  useEffect(() => {
    initStore();
  }, [initStore]);

  const handleFormChange = React.useCallback((values: any) => {
    setFormData(values);
  }, []);

  const handleSubmit = React.useCallback((values: any) => {
    submitPayment({
      cardholderName: values.cardholderName,
      cardNumber: values.cardNumber.replace(/\s+/g, ''),
      expiryDate: values.expiryDate,
      cvv: values.cvv,
      amount: parseFloat(values.amount),
      currency: values.currency,
    });
  }, [submitPayment]);

  const handleRetry = React.useCallback(() => {
    retryPayment({
      cardholderName: formData.cardholderName,
      cardNumber: formData.cardNumber.replace(/\s+/g, ''),
      expiryDate: formData.expiryDate,
      cvv: formData.cvv,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
    });
  }, [retryPayment, formData]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-20 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-400/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]"></div>
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-pink-400/5 rounded-full blur-[100px]"></div>
      </div>
      
      <div className="max-w-6xl mx-auto">
        <header className="mb-20 text-center relative">
          <div className="inline-block px-4 py-1.5 mb-6 bg-blue-50 border border-blue-100 rounded-full">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
              Secure Gateway v2.0
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none mb-6">
            Secure <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Checkout</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed">
            Experience the future of payments. Fast, secure, and encrypted processing for your peace of mind.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          <div className="lg:col-span-7 w-full order-2 lg:order-1 animate-in slide-in-from-left-8 duration-700 delay-200 fill-mode-both">
            {status === 'Idle' ? (
              <CardInput 
                onFormChange={handleFormChange}
                onSubmit={handleSubmit}
              />
            ) : (
              <StatusScreen 
                onRetry={handleRetry}
                onReset={startNewPayment}
              />
            )}
            
            <div className="mt-4">
              {/* Transaction history moved to /transactions */}
            </div>
          </div>
          
          <div className="lg:col-span-5 w-full order-1 lg:order-2 lg:sticky lg:top-12 animate-in slide-in-from-right-8 duration-700 delay-300 fill-mode-both">
            <div className="bg-white/40 backdrop-blur-3xl p-10 rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.08)] border border-white/60 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32 group-hover:bg-blue-400/10 transition-colors duration-700"></div>
              
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Card Visualization</h3>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                </div>
              </div>

              <CardPreview 
                cardNumber={formData.cardNumber}
                cardholderName={formData.cardholderName}
                expiryDate={formData.expiryDate}
              />
              
              <div className="mt-12 space-y-6">
                <div className="p-8 bg-slate-900 rounded-3xl shadow-2xl relative overflow-hidden group/summary">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"></div>
                  <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50"></div>
                  
                  <div className="relative z-10">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-4">Final Summary</p>
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-slate-400 font-bold shrink-0">Total Amount</span>
                      <div className="flex flex-col items-end min-w-0">
                        <div className="flex items-baseline gap-2 min-w-0 max-w-full">
                          <span className="text-sm text-slate-500 font-black">{formData.currency}</span>
                          <span className={`font-black text-white tracking-tighter truncate ${
                            (formData.amount?.length || 0) > 12 ? 'text-xl' : 
                            (formData.amount?.length || 0) > 8 ? 'text-2xl' : 'text-4xl'
                          }`}>
                            {formData.amount ? parseFloat(formData.amount).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
                          </span>
                        </div>
                        <span className="text-[10px] text-green-500 font-black uppercase tracking-widest mt-1">Includes all taxes</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                  <div className="bg-white/50 p-4 rounded-2xl flex items-center justify-center border border-white/40">
                    <svg className="h-6" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M28.3 10.1l-2.8 7.3h-3l1.1-2.9-2.2-4.4h3.1l1.3 3.5 1.4-3.5h3z" fill="#1434CB"/><path d="M19 15.5c0-1.2 1.3-1.6 2.3-2 .9-.4 1.2-.7 1.2-1.1 0-.6-.7-1.1-1.8-1.1-1.3 0-2.1.3-2.9.7l-.4.2-.4-2.7c.8-.4 2-.7 3.3-.7 2.9 0 4.8 1.4 4.8 3.7 0 2.6-3.6 2.8-3.6 4 0 .4.4.8 1.4.9 1 .1 2.2-.2 3.1-.6l.3-.2.5 2.8c-.8.4-2.1.8-3.6.8-3 0-4.7-1.5-4.7-3.8z" fill="#1434CB"/><path d="M13 17.5H9.8L8.2 10l-.2-.9c-1-.3-2.1-.6-3.3-.8l-.1-.4h4.7c.6 0 1.1.4 1.3 1l1.5 6.4 2.4-6.5h3.1l-4.5 8.7z" fill="#1434CB"/></svg>
                  </div>
                  <div className="bg-white/50 p-4 rounded-2xl flex items-center justify-center border border-white/40">
                    <svg className="h-6" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="15" cy="12" r="7" fill="#EB001B"/><circle cx="23" cy="12" r="7" fill="#F79E1B"/><path d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z" fill="#FF5F00"/></svg>
                  </div>
                  <div className="bg-white/50 p-4 rounded-2xl flex items-center justify-center border border-white/40">
                    <svg className="h-6" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.1 16.5l2-5.4H16l1.9 5.4h2.1L15.6 7H13L8.6 16.5h3.5z" fill="#006FCF"/><path d="M23.4 16.5l2.7-4.4v4.4h2V7h-1.9l-2.6 4.3V7h-2v9.5h1.8z" fill="#006FCF"/><path d="M29.9 10.4v-1.1h4.8V7h-6.7v9.5h6.9v-2.3h-5v-1.4h4.4v-2.2h-4.4z" fill="#006FCF"/></svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 flex flex-col items-center gap-6 animate-pulse-soft">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Secure by TrustGate</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
