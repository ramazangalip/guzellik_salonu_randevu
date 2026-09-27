'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Service } from '@/types';
import { useAura } from '@/context/AuraContext';
import { Clock, Calendar, Sparkles, User, Tag } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800';

export default function ServiceCard({ service }: ServiceCardProps) {
  const { openBookingForService } = useAura();
  const [imgSrc, setImgSrc] = useState(service.image || DEFAULT_FALLBACK_IMAGE);

  useEffect(() => {
    setImgSrc(service.image || DEFAULT_FALLBACK_IMAGE);
  }, [service.image]);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#F0EAE1] shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Image Container with Badges */}
        <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
          <Image
            src={imgSrc}
            alt={service.name}
            fill
            unoptimized
            onError={() => setImgSrc(DEFAULT_FALLBACK_IMAGE)}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-transparent" />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
            {service.popular ? (
              <span className="bg-[#1C1917]/90 backdrop-blur-md text-[#F5E6D3] text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 border border-[#C59B78]/40 shadow-sm">
                <Sparkles className="w-3 h-3 text-[#C59B78]" /> Popüler Hizmet
              </span>
            ) : (
              <span className="bg-white/90 backdrop-blur-md text-stone-700 text-[11px] font-medium px-2.5 py-1 rounded-full shadow-sm">
                {service.category}
              </span>
            )}

            {/* Duration Badge */}
            <span className="bg-stone-900/80 backdrop-blur-md text-stone-200 text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Clock className="w-3 h-3 text-[#C59B78]" /> {service.duration}
            </span>
          </div>

          {/* Specialist Tag on bottom left of image */}
          <div className="absolute bottom-2.5 left-3 text-white text-xs font-medium flex items-center gap-1.5 drop-shadow-sm z-10">
            <User className="w-3.5 h-3.5 text-[#C59B78]" />
            <span className="text-[11px] text-stone-200 font-medium">{service.specialist}</span>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-4 flex flex-col gap-2">
          {/* Service Title */}
          <h3 className="font-bold text-stone-900 text-base leading-snug group-hover:text-[#A67B52] transition-colors">
            {service.name}
          </h3>

          {/* Short Description */}
          <p className="text-stone-600 text-xs line-clamp-2 leading-relaxed font-normal">
            {service.description}
          </p>
        </div>
      </div>

      {/* Footer Area: Price & Booking Action */}
      <div className="p-4 pt-0 mt-2 flex items-center justify-between border-t border-stone-100/80 pt-3">
        {/* Price Section */}
        <div>
          <div className="text-[10px] text-stone-400 font-medium uppercase tracking-wider flex items-center gap-1">
            <Tag className="w-3 h-3 text-stone-400" /> Başlangıç Fiyatı
          </div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-bold text-lg text-stone-900 tracking-tight">
              {service.price.toLocaleString('tr-TR')} ₺
            </span>
            {service.originalPrice && (
              <span className="text-xs text-stone-400 line-through">
                {service.originalPrice.toLocaleString('tr-TR')} ₺
              </span>
            )}
          </div>
        </div>

        {/* Randevu Al Action Button */}
        <button
          onClick={() => openBookingForService(service)}
          className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:shadow transition-all active:scale-97 cursor-pointer border border-stone-700"
        >
          <Calendar className="w-3.5 h-3.5 text-[#C59B78]" />
          <span>Randevu Al</span>
        </button>
      </div>
    </div>
  );
}
