'use client';

import React from 'react';
import { useAura } from '@/context/AuraContext';
import { CategoryType } from '@/types';
import { Sparkles, HeartPulse, Zap, Activity, Feather, Smile } from 'lucide-react';

const CATEGORIES: { name: CategoryType; icon: React.ReactNode }[] = [
  { name: 'Tümü', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { name: 'Cilt Bakımı', icon: <Smile className="w-3.5 h-3.5" /> },
  { name: 'Lazer Epilasyon', icon: <Zap className="w-3.5 h-3.5" /> },
  { name: 'Bölgesel İncelme', icon: <Activity className="w-3.5 h-3.5" /> },
  { name: 'Kalıcı Makyaj', icon: <Feather className="w-3.5 h-3.5" /> },
  { name: 'Tırnak & Masaj', icon: <HeartPulse className="w-3.5 h-3.5" /> },
];

export default function CategoryTabs() {
  const { selectedCategory, setSelectedCategory, services } = useAura();

  const getCount = (catName: CategoryType) => {
    if (catName === 'Tümü') return services.filter(s => s.isActive).length;
    return services.filter(s => s.isActive && s.category === catName).length;
  };

  return (
    <div className="w-full bg-[#FAF8F5]/90 backdrop-blur-md sticky top-[108px] z-30 py-3 border-b border-[#F0EAE1]">
      <div className="max-w-md mx-auto px-4 sm:max-w-2xl lg:max-w-4xl">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 pt-0.5">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.name;
            const count = getCount(cat.name);

            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer shadow-2xs ${
                  isSelected
                    ? 'bg-[#1C1917] text-white shadow-md ring-2 ring-[#C59B78]/40 scale-102'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80 hover:text-stone-900'
                }`}
              >
                <span className={isSelected ? 'text-[#C59B78]' : 'text-stone-400'}>
                  {cat.icon}
                </span>
                <span>{cat.name}</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] rounded-full font-medium ${
                    isSelected
                      ? 'bg-[#C59B78] text-white'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
