'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Sparkles, SlidersHorizontal, CheckCircle2 } from 'lucide-react';

export default function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  }, [handleMove]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  return (
    <section className="w-full my-8 bg-stone-900 text-stone-100 rounded-3xl p-5 sm:p-7 shadow-xl border border-stone-800 relative overflow-hidden">
      {/* Decorative luxury gradient background accent */}
      <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#C59B78]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -top-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-3 relative z-10">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#C59B78] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Klinik Öncesi / Sonrası Karşılaştırma</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Gerçek Müşteri Sonuçları
          </h2>
          <p className="text-stone-400 text-xs mt-1 max-w-md">
            Leke Protokolü & Altın İğne Cilt Yenileme uygulamamızın 4 seans sonundaki ışıltılı değişimi.
          </p>
        </div>

        {/* Treatment stats badge */}
        <div className="flex items-center gap-2 bg-stone-800/80 px-3 py-1.5 rounded-xl border border-stone-700/60 text-xs self-start sm:self-auto">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-stone-300 font-medium">%98 Danışan Memnuniyeti</span>
        </div>
      </div>

      {/* Interactive Slider Box */}
      <div
        ref={containerRef}
        className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden select-none cursor-ew-resize border border-stone-700 shadow-inner"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* After Image (Background) */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1200"
            alt="Sonrası - Pürüzsüz & Canlı Cilt"
            fill
            unoptimized
            className="object-cover"
            priority
          />
          <div className="absolute top-4 right-4 bg-stone-900/80 backdrop-blur-md text-[#F5E6D3] text-xs font-bold px-3 py-1 rounded-full border border-[#C59B78]/40 shadow-md">
            SONRASI (4. Seans) ✨
          </div>
        </div>

        {/* Before Image (Clipped overlay) */}
        <div
          className="absolute inset-0 h-full overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <div className="relative w-full h-full" style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}>
            <Image
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1200"
              alt="Öncesi - Leke ve Yorgun Cilt"
              fill
              unoptimized
              className="object-cover grayscale brightness-90 contrast-110"
              priority
            />
            <div className="absolute top-4 left-4 bg-stone-900/80 backdrop-blur-md text-stone-300 text-xs font-semibold px-3 py-1 rounded-full border border-stone-700 shadow-md">
              ÖNCESİ
            </div>
          </div>
        </div>

        {/* Slider Drag Bar Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Slider Handle Button */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-stone-900 shadow-xl border-2 border-[#C59B78] flex items-center justify-center pointer-events-auto cursor-pointer hover:scale-110 transition-transform">
            <SlidersHorizontal className="w-4 h-4 text-[#A67B52]" />
          </div>
        </div>
      </div>

      {/* Footer Instruction Helper */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-stone-400">
        <span>👈 Öncesi (İlk Gün)</span>
        <span className="flex items-center gap-1 text-stone-300 font-medium">
          Çubuğu kaydırarak değişimi inceleyin
        </span>
        <span>Sonrası (Işıltılı Cilt) 👉</span>
      </div>
    </section>
  );
}
