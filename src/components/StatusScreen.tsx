import React from 'react';
import { usePaymentStore } from '@/hooks/usePaymentStore';
import { Loader2, CheckCircle2, XCircle, Clock, Lock } from 'lucide-react';

interface StatusScreenProps {
  onRetry: () => void;
  onReset: () => void;
  errorReason?: string;
}

const StatusScreen: React.FC<StatusScreenProps> = ({ onRetry, onReset, errorReason }) => {
  const { status, attempts } = usePaymentStore();

  const isMaxAttempts = attempts >= 3;

  if (status === 'Idle') return null;

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] border border-white/60 text-center animate-in fade-in zoom-in duration-500 min-h-[400px]">
      {status === 'Processing' && (
        <div className="flex flex-col items-center">
          <div className="relative mb-10">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="w-24 h-24 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin relative z-10 shadow-inner"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center animate-pulse-soft">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Authenticating</h2>
          <p className="text-slate-400 mt-4 font-bold uppercase tracking-widest text-[10px]">Verifying with your bank...</p>
          <div className="mt-8 flex gap-1">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
          </div>
        </div>
      )}

      {status === 'Success' && (
        <div className="flex flex-col items-center">
          <div className="relative mb-10">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center relative z-10 border-4 border-white shadow-xl animate-in zoom-in duration-700">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Payment Received</h2>
          <p className="text-slate-500 mt-4 font-medium max-w-xs leading-relaxed">
            Your transaction was successful. A confirmation receipt has been sent to your email.
          </p>
          <button 
            onClick={onReset}
            className="mt-10 px-10 py-5 bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] active:scale-95"
          >
            Done
          </button>
        </div>
      )}

      {(status === 'Failed' || status === 'Timeout') && (
        <div className="flex flex-col items-center">
          <div className="relative mb-10">
            <div className={`absolute inset-0 rounded-full blur-3xl opacity-20 animate-pulse ${status === 'Timeout' ? 'bg-orange-500' : 'bg-red-500'}`}></div>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center relative z-10 border-4 border-white shadow-xl animate-in zoom-in duration-700 ${status === 'Timeout' ? 'bg-orange-50' : 'bg-red-50'}`}>
              {status === 'Timeout' ? (
                <Clock className="w-12 h-12 text-orange-500" />
              ) : (
                <XCircle className="w-12 h-12 text-red-500" />
              )}
            </div>
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            {status === 'Timeout' ? 'Connection Lost' : 'Transaction Declined'}
          </h2>
          <div className="mt-4 p-4 bg-red-50/50 rounded-2xl border border-red-100 max-w-xs">
            <p className="text-red-600 text-xs font-bold leading-relaxed">
              {errorReason || (status === 'Timeout' ? 'The gateway took too long to respond. This might be due to a slow internet connection.' : 'The transaction was declined by the bank. Please check your card details and try again.')}
            </p>
          </div>
          
          <div className="mt-10 flex flex-col items-center gap-4 w-full">
            {!isMaxAttempts ? (
              <>
                <button 
                  onClick={onRetry}
                  className="w-full max-w-xs py-5 bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] active:scale-95 flex items-center justify-center gap-3"
                >
                  Retry Payment
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Attempt</span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${i <= attempts ? 'bg-red-500' : 'bg-slate-200'}`}></div>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{attempts} of 3</span>
                </div>
              </>
            ) : (
              <>
                <div className="w-full max-w-xs p-5 bg-red-50 rounded-2xl border-2 border-dashed border-red-200">
                  <p className="text-red-700 text-[10px] font-black uppercase tracking-widest">Security Lock</p>
                  <p className="text-red-500 text-xs font-bold mt-1">Maximum attempts reached. Please contact support or try a different card.</p>
                </div>
                <button 
                  onClick={onReset}
                  className="mt-2 text-slate-400 hover:text-slate-600 font-black text-[10px] uppercase tracking-widest transition-colors"
                >
                  Go Back to Form
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusScreen;
