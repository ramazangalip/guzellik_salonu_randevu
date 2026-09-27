'use client';

import React from 'react';
import { useAura } from '@/context/AuraContext';
import { X, MapPin, Phone, Clock, MessageCircle, ExternalLink, Navigation } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LocationModal({ isOpen, onClose }: LocationModalProps) {
  const { settings } = useAura();

  if (!isOpen) return null;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.name + ' ' + settings.address)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-stone-900/70 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#FAF8F5] rounded-3xl shadow-2xl overflow-hidden z-10 border border-stone-200">
        <div className="bg-[#1C1917] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#C59B78]" />
            <h3 className="font-bold text-sm">Ulaşım & Adres Bilgileri</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* Salon Name & Address */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <h4 className="font-bold text-stone-900 text-sm">{settings.name}</h4>
            <p className="text-stone-600 leading-relaxed">{settings.address}</p>
          </div>

          {/* Working Hours & Contact */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-200 text-stone-700">
              <Clock className="w-4 h-4 text-[#C59B78] shrink-0" />
              <div>
                <div className="font-semibold text-stone-900">Çalışma Saatleri</div>
                <div className="text-[11px] text-stone-500 mt-0.5">{settings.workingHours}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-200 text-stone-700">
              <Phone className="w-4 h-4 text-[#C59B78] shrink-0" />
              <div>
                <div className="font-semibold text-stone-900">Telefon / Randevu Hattı</div>
                <div className="text-[11px] text-stone-500 mt-0.5">{settings.phone}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-[#1C1917] text-white font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-stone-800 transition-colors shadow-sm"
            >
              <Navigation className="w-3.5 h-3.5 text-[#C59B78]" />
              <span>Google Haritalar</span>
            </a>

            <a
              href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Merhaba, salonun yol tarifi ve park yeri hakkında bilgi almak istiyorum.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-600 transition-colors shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Konum</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
