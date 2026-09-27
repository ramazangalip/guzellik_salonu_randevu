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
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#1C1917]/95 backdrop-blur-lg border-t border-stone-800 text-stone-200 py-2 px-3 shadow-2xl sm:hidden">
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1 text-center">
        {/* Hizmetler */}
        <button
          onClick={scrollToServices}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl hover:bg-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#C59B78]" />
          <span className="text-[10px] font-medium mt-1">Hizmetler</span>
        </button>

        {/* Hızlı Randevu */}
        <button
          onClick={() => openBookingForService()}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-[#C59B78] text-white shadow-md transition-all active:scale-95 cursor-pointer font-bold"
        >
          <Calendar className="w-4 h-4" />
          <span className="text-[10px] font-semibold mt-1">Hızlı Randevu</span>
        </button>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Merhaba, randevu ve fiyatlar hakkında bilgi almak istiyorum.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl hover:bg-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] font-medium mt-1">WhatsApp</span>
        </a>

        {/* Yol Tarifi */}
        <button
          onClick={onOpenLocation}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl hover:bg-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer"
        >
          <MapPin className="w-4 h-4 text-[#C59B78]" />
          <span className="text-[10px] font-medium mt-1">Yol Tarifi</span>
        </button>
      </div>
    </div>
  );
}
