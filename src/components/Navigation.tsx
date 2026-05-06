"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CreditCard, History, ShieldCheck } from 'lucide-react';

const Navigation: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white/70 backdrop-blur-2xl border border-white/60 px-2 py-2 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] flex items-center gap-1">
        <Link 
          href="/" 
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
            pathname === '/' 
              ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Checkout
        </Link>
        <Link 
          href="/transactions" 
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
            pathname.startsWith('/transactions') 
              ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
        >
          <History className="w-4 h-4" />
          History
        </Link>
        <div className="w-px h-6 bg-slate-100 mx-2"></div>
        <div className="flex items-center gap-2 px-4 text-green-500">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Secure</span>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
