'use client';

import React from 'react';
import Link from 'next/link';
import { useAura } from '@/context/AuraContext';
import { Star, Phone, MessageCircle, ShieldCheck, MapPin } from 'lucide-react';

interface HeaderProps {
  onOpenLocation?: () => void;
}

export default function Header({ onOpenLocation }: HeaderProps) {
  const { settings, openPwaModal } = useAura();

  return (
    <header className="w-full bg-[#FAF8F5] sticky top-0 z-40 border-b border-[#F0EAE1]">
      {/* Top Announcement Bar */}
      {settings.announcement && (
        <div className="bg-[#1C1917] text-[#F5E6D3] text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2 tracking-wide">
          <span className="truncate">{settings.announcement}</span>
        </div>
      )}

      {/* Main Header Container */}
      <div className="max-w-md mx-auto px-4 py-3 sm:max-w-2xl lg:max-w-4xl">
        <div className="flex items-center justify-between gap-3">
          
          {/* Logo & Brand Info */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl gold-gradient-bg flex items-center justify-center text-white font-serif font-bold text-lg sm:text-xl shadow-md ring-2 ring-[#C59B78]/20 shrink-0">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-sm sm:text-lg text-[#1C1917] tracking-tight leading-tight">
                  {settings.name}
                </h1>
              </div>
              
              <div className="flex items-center gap-2 mt-0.5 text-xs text-stone-500 flex-wrap">
                <button 
                  onClick={onOpenLocation}
                  className="flex items-center gap-1 text-stone-600 hover:text-[#C59B78] transition-colors cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#C59B78]" />
                  <span className="font-medium text-[11px] sm:text-xs">Nişantaşı, İst</span>
                </button>

                <span className="text-stone-300">•</span>

                {/* Rating Badge */}
                <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md font-semibold text-[11px]">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                  <span>{settings.googleRating}</span>
                  <span className="text-stone-400 font-normal">({settings.reviewCount}+)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Admin Link */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Phone Quick Action */}
            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stone-100 border border-stone-200 text-stone-700 flex items-center justify-center hover:bg-[#C59B78] hover:text-white transition-all shadow-xs"
              title="Salonu Ara"
            >
              <Phone className="w-4 h-4" />
            </a>

            {/* WhatsApp Quick Action */}
            <a
              href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Merhaba, Aura Estetik hakkında bilgi almak istiyorum.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-all shadow-xs"
              title="WhatsApp İletişim"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            {/* Admin Panel Link (Always visible & prominent!) */}
            <Link
              href="/admin"
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-stone-900 text-stone-100 text-xs font-bold hover:bg-stone-800 transition-colors border border-stone-700 shadow-xs active:scale-95 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C59B78]" />
              <span>Yönetim</span>
            </Link>
          </div>
        </div>

        {/* Status Bar: Open/Closed & Hours */}
        <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-800 bg-emerald-50/80 px-2 py-0.5 rounded-full text-[11px] border border-emerald-100">
              Şu an Açık - 19:30&apos;a kadar
            </span>
          </div>

          {/* Trigger PWA Modal */}
          <button
            onClick={openPwaModal}
            className="flex items-center gap-1 text-[11px] font-bold text-[#C59B78] hover:text-[#A67B52] bg-amber-50/80 hover:bg-amber-100/80 px-2.5 py-1 rounded-full border border-amber-200/60 transition-all cursor-pointer touch-manipulation active:scale-95"
          >
            <span>📱 Uygulamayı İndir</span>
          </button>
        </div>
      </div>
    </header>
  );
}
