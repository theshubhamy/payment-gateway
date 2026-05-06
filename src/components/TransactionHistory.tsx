import React from 'react';
import Link from 'next/link';
import { usePaymentStore } from '@/hooks/usePaymentStore';
import { format } from 'date-fns';

const TransactionHistory: React.FC = () => {
  const { transactions } = usePaymentStore();

  if (transactions.length === 0) {
    return (
      <div className="mt-10 p-12 bg-white/50 backdrop-blur-md rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center text-slate-400 shadow-sm animate-in fade-in duration-700">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
        </div>
        <p className="font-bold uppercase tracking-widest text-[10px]">No transactions found</p>
        <p className="text-sm mt-1">Your payment history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="mt-12 bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.05)] border border-white/60 overflow-hidden">
      <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-white/40">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Recent Activity</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Activity Log</p>
        </div>
        <span className="px-4 py-2 bg-slate-900 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-slate-900/20">
          {transactions.length} Total
        </span>
      </div>
      <div className="max-h-[600px] overflow-y-auto px-6 pb-6">
        <ul className="space-y-3 mt-6">
          {transactions.map((tx) => (
            <li key={`${tx.id}-${tx.timestamp}`}>
              <Link 
                href={`/transactions/${tx.id}`}
                className="p-6 bg-white/40 hover:bg-white rounded-3xl cursor-pointer transition-all duration-500 border border-transparent hover:border-slate-100 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] group flex justify-between items-center"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${
                    tx.status === 'Success' ? 'bg-green-50 text-green-500 group-hover:bg-green-500 group-hover:text-white' :
                    tx.status === 'Failed' ? 'bg-red-50 text-red-500 group-hover:bg-red-500 group-hover:text-white' :
                    tx.status === 'Timeout' ? 'bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white' :
                    'bg-slate-50 text-slate-400'
                  }`}>
                    {tx.status === 'Success' ? (
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                    ) : tx.status === 'Timeout' ? (
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    ) : (
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                    )}
                  </div>
                  <div>
                    <p className="font-black text-slate-800 text-xl tracking-tight">
                      {tx.currency} {tx.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                      {format(new Date(tx.timestamp), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <span className={`text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest transition-all duration-300 ${
                    tx.status === 'Success' ? 'bg-green-100 text-green-700' :
                    tx.status === 'Failed' ? 'bg-red-100 text-red-700' :
                    tx.status === 'Timeout' ? 'bg-orange-100 text-orange-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {tx.status}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-1">
                    <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"/></svg>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TransactionHistory;
