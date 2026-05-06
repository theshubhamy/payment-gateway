import React from 'react';
import { getCardType } from '@/utils/formatting';

interface CardPreviewProps {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
}

const CardPreview: React.FC<CardPreviewProps> = ({ cardNumber, cardholderName, expiryDate }) => {
  const cardType = getCardType(cardNumber);

  let gradient = 'from-gray-700 to-gray-900';
  if (cardType === 'Visa') gradient = 'from-blue-600 to-blue-800';
  else if (cardType === 'Mastercard') gradient = 'from-orange-500 to-red-600';
  else if (cardType === 'Amex') gradient = 'from-teal-600 to-teal-800';

  return (
    <div className={`w-full max-w-sm mx-auto h-56 rounded-3xl p-8 text-white shadow-2xl bg-gradient-to-br ${gradient} flex flex-col justify-between relative overflow-hidden transition-all duration-500 hover:scale-[1.02] group`}>
      {/* Decorative background elements */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl transition-all duration-700 group-hover:scale-110"></div>
      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-black/10 rounded-full blur-3xl transition-all duration-700 group-hover:scale-110"></div>
      
      <div className="flex justify-between items-start z-10">
        <div className="text-xl font-black italic tracking-tighter opacity-90">
          {cardType !== 'Unknown' ? cardType.toUpperCase() : 'PLATINUM'}
        </div>
        <div className="flex flex-col items-end">
          <div className="w-14 h-10 bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 rounded-lg shadow-inner flex flex-col justify-around p-1.5 border border-yellow-300/50">
            <div className="h-px bg-black/20 w-full"></div>
            <div className="h-px bg-black/20 w-full"></div>
            <div className="h-px bg-black/20 w-full"></div>
          </div>
          <div className="mt-2">
            <svg className="w-8 h-8 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 7L12 12L22 7M2 17L12 22L22 17M12 2L2 7L12 12L22 7L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="z-10">
        <div className="text-lg font-mono tracking-[0.15em] mb-6 font-bold drop-shadow-md whitespace-nowrap overflow-hidden text-ellipsis">
          {cardNumber || '•••• •••• •••• ••••'}
        </div>
        
        <div className="flex justify-between items-end uppercase">
          <div className="flex-1 mr-4">
            <div className="text-[10px] opacity-60 mb-1 font-bold tracking-widest">Card Holder</div>
            <div className="font-bold tracking-wider truncate text-sm">
              {cardholderName || '•••••••• •••••••'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] opacity-60 mb-1 font-bold tracking-widest">Expires</div>
            <div className="font-bold tracking-wider text-sm">
              {expiryDate || 'MM/YY'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPreview;
