'use client';

import React, { useState } from 'react';
import { useAura } from '@/context/AuraContext';
import { Sparkles, Calendar, MessageCircle, MapPin } from 'lucide-react';

interface StickyBottomBarProps {
  isLocationOpen?: boolean;
  onOpenLocation: () => void;
}

export default function StickyBottomBar({ isLocationOpen, onOpenLocation }: StickyBottomBarProps) {
  const { openBookingForService, bookingModalOpen, settings } = useAura();
  const [lastClickedTab, setLastClickedTab] = useState<'services' | 'booking' | 'whatsapp' | 'location'>('services');

  // Determine active tab dynamically
  let activeTab = lastClickedTab;
  if (bookingModalOpen) {
    activeTab = 'booking';
  } else if (isLocationOpen) {
    activeTab = 'location';
  }

  const scrollToServices = () => {
    setLastClickedTab('services');
    const el = document.getElementById('services-section');
    if (el) {
      const yOffset = -100;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const openWhatsApp = () => {
    setLastClickedTab('whatsapp');
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
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all cursor-pointer touch-manipulation min-h-[50px] ${
            activeTab === 'services'
              ? 'bg-[#C59B78] text-white shadow-lg shadow-[#C59B78]/25 font-bold scale-102 ring-2 ring-[#C59B78]/50'
              : 'bg-stone-800/60 hover:bg-stone-800 text-stone-400 hover:text-stone-200'
          }`}
        >
          <Sparkles className={`w-5 h-5 ${activeTab === 'services' ? 'text-white' : 'text-[#C59B78]'}`} />
          <span className="text-[11px] mt-1 leading-tight">Hizmetler</span>
        </button>

        {/* Hızlı Randevu */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setLastClickedTab('booking');
            openBookingForService();
          }}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all cursor-pointer touch-manipulation min-h-[50px] ${
            activeTab === 'booking'
              ? 'bg-[#C59B78] text-white shadow-lg shadow-[#C59B78]/25 font-bold scale-102 ring-2 ring-[#C59B78]/50'
              : 'bg-stone-800/60 hover:bg-stone-800 text-stone-400 hover:text-stone-200'
          }`}
        >
          <Calendar className={`w-5 h-5 ${activeTab === 'booking' ? 'text-white' : 'text-[#C59B78]'}`} />
          <span className="text-[11px] mt-1 leading-tight">Hızlı Randevu</span>
        </button>

        {/* WhatsApp */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openWhatsApp();
          }}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all cursor-pointer touch-manipulation min-h-[50px] ${
            activeTab === 'whatsapp'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 font-bold scale-102 ring-2 ring-emerald-500/50'
              : 'bg-stone-800/60 hover:bg-stone-800 text-stone-400 hover:text-stone-200'
          }`}
        >
          <MessageCircle className={`w-5 h-5 ${activeTab === 'whatsapp' ? 'text-white fill-white/20' : 'text-emerald-400'}`} />
          <span className="text-[11px] mt-1 leading-tight">WhatsApp</span>
        </button>

        {/* Yol Tarifi */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setLastClickedTab('location');
            onOpenLocation();
          }}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all cursor-pointer touch-manipulation min-h-[50px] ${
            activeTab === 'location'
              ? 'bg-[#C59B78] text-white shadow-lg shadow-[#C59B78]/25 font-bold scale-102 ring-2 ring-[#C59B78]/50'
              : 'bg-stone-800/60 hover:bg-stone-800 text-stone-400 hover:text-stone-200'
          }`}
        >
          <MapPin className={`w-5 h-5 ${activeTab === 'location' ? 'text-white' : 'text-[#C59B78]'}`} />
          <span className="text-[11px] mt-1 leading-tight">Yol Tarifi</span>
        </button>
      </div>
    </div>
  );
}
