'use client';

import React from 'react';
import { useAura } from '@/context/AuraContext';
import { Sparkles, Calendar, MessageCircle, MapPin } from 'lucide-react';

interface StickyBottomBarProps {
  onOpenLocation: () => void;
}

export default function StickyBottomBar({ onOpenLocation }: StickyBottomBarProps) {
  const { openBookingForService, settings } = useAura();

  const scrollToServices = () => {
    const el = document.getElementById('services-section');
    if (el) {
      const yOffset = -100;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const openWhatsApp = () => {
    const phone = settings.whatsapp.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${phone}?text=${encodeURIComponent('Merhaba, randevu ve hizmetler hakkında bilgi almak istiyorum.')}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-[#1C1917]/95 backdrop-blur-xl border-t border-stone-800 text-stone-200 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] px-3 shadow-2xl sm:hidden select-none">
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1.5 text-center">
        {/* Hizmetler */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            scrollToServices();
          }}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-stone-200 active:scale-95 transition-all cursor-pointer touch-manipulation min-h-[48px]"
        >
          <Sparkles className="w-5 h-5 text-[#C59B78]" />
          <span className="text-[11px] font-semibold mt-1">Hizmetler</span>
        </button>

        {/* Hızlı Randevu */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openBookingForService();
          }}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#C59B78] text-white shadow-lg active:scale-95 transition-all cursor-pointer font-bold touch-manipulation min-h-[48px]"
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[11px] font-bold mt-1">Hızlı Randevu</span>
        </button>

        {/* WhatsApp */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openWhatsApp();
          }}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-stone-200 active:scale-95 transition-all cursor-pointer touch-manipulation min-h-[48px]"
        >
          <MessageCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-[11px] font-semibold mt-1">WhatsApp</span>
        </button>

        {/* Yol Tarifi */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenLocation();
          }}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-stone-200 active:scale-95 transition-all cursor-pointer touch-manipulation min-h-[48px]"
        >
          <MapPin className="w-5 h-5 text-[#C59B78]" />
          <span className="text-[11px] font-semibold mt-1">Yol Tarifi</span>
        </button>
      </div>
    </div>
  );
}
