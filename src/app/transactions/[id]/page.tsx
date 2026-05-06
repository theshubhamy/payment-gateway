"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePaymentStore } from '@/hooks/usePaymentStore';
import { Transaction } from '@/types';
import { format } from 'date-fns';
import { ArrowLeft, CheckCircle2, XCircle, Clock, ShieldCheck, Download, Share2 } from 'lucide-react';

export default function TransactionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { transactions, initStore } = usePaymentStore();
  const [tx, setTx] = useState<Transaction | null>(null);

  useEffect(() => {
    initStore();
  }, [initStore]);

  useEffect(() => {
    if (transactions.length > 0) {
      const found = transactions.find(t => t.id === params.id);
      setTx(found || null);
    }
  }, [transactions, params.id]);

  if (!tx) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Transaction not found</p>
          <button 
            onClick={() => router.push('/transactions')}
            className="mt-4 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest"
          >
            Back to History
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-32 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-400/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-8 duration-700 fill-mode-both">
        <button 
          onClick={() => router.push('/transactions')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mb-8 group"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:-translate-x-1 transition-transform">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Back to activity</span>
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.08)] border border-white/60 relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-2 ${
            tx.status === 'Success' ? 'bg-green-500' :
            tx.status === 'Failed' ? 'bg-red-500' :
            'bg-orange-500'
          }`}></div>
          
          <div className="p-12">
            <div className="flex flex-col items-center text-center mb-12">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-xl animate-in zoom-in duration-700 ${
                tx.status === 'Success' ? 'bg-green-50 text-green-500' :
                tx.status === 'Failed' ? 'bg-red-50 text-red-500' :
                'bg-orange-50 text-orange-500'
              }`}>
                {tx.status === 'Success' ? <CheckCircle2 className="w-10 h-10" /> :
                 tx.status === 'Timeout' ? <Clock className="w-10 h-10" /> :
                 <XCircle className="w-10 h-10" />}
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Transaction Receipt</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">ID: {tx.id.split('-')[0]}...{tx.id.slice(-4)}</p>
            </div>

            <div className="space-y-10">
              <div className="flex flex-col items-center py-10 bg-slate-50 rounded-[2rem] border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-200/20 rounded-full -mr-16 -mt-16 transition-all duration-700 group-hover:scale-110"></div>
                <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black mb-2">Total Amount</p>
                <p className="text-5xl font-black text-slate-900 tracking-tighter">
                  <span className="text-2xl text-slate-400 mr-2 font-bold">{tx.currency}</span>
                  {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-y-10 gap-x-16 px-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black mb-2">Payment Status</p>
                  <span className={`inline-block text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest ${
                      tx.status === 'Success' ? 'bg-green-100 text-green-700' :
                      tx.status === 'Failed' ? 'bg-red-100 text-red-700' :
                      tx.status === 'Timeout' ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                    {tx.status}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black mb-2">Date & Time</p>
                  <p className="text-xs text-slate-800 font-bold leading-relaxed">{format(new Date(tx.timestamp), 'PPp')}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black mb-2">Reference Identifier</p>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="font-mono text-[11px] break-all text-slate-500 leading-relaxed tracking-wider">{tx.id}</p>
                  </div>
                </div>
                {tx.reason && (
                  <div className="col-span-2 animate-in slide-in-from-top-2 duration-500">
                    <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black mb-2">Reason for Failure</p>
                    <div className="flex items-start gap-4 p-6 bg-red-50/50 rounded-2xl border border-red-100 text-red-700">
                      <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p className="text-xs font-bold leading-relaxed">{tx.reason}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
              <button className="flex-1 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group shadow-xl shadow-slate-900/10 active:scale-95">
                <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                Download PDF
              </button>
              <button className="flex-1 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group border border-slate-200 active:scale-95">
                <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Share Receipt
              </button>
            </div>
            
            <div className="mt-10 flex flex-col items-center gap-4 py-6 bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction Verified Secure</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
            End of receipt • SecurePay Gateway v2.0
          </p>
        </div>
      </div>
    </main>
  );
}
