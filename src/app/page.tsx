'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import CategoryTabs from '@/components/CategoryTabs';
import ServiceCard from '@/components/ServiceCard';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import AppointmentModal from '@/components/AppointmentModal';
import StickyBottomBar from '@/components/StickyBottomBar';
import LocationModal from '@/components/LocationModal';
import { useAura } from '@/context/AuraContext';
import { Sparkles, Shield, Award, ArrowRight, Calendar, Star } from 'lucide-react';

export default function HomePage() {
  const { services, selectedCategory, openBookingForService, settings, resetToDefaults } = useAura();
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  // Filter services by category and active status (default to active if undefined)
  const filteredServices = services.filter(srv => {
    if (srv.isActive === false) return false;
    if (selectedCategory === 'Tümü') return true;
    return srv.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 pb-20 sm:pb-12 selection:bg-[#C59B78] selection:text-white">
      
      {/* Main Header */}
      <Header onOpenLocation={() => setLocationModalOpen(true)} />

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-amber-50/40 to-[#FAF8F5] py-6 sm:py-10 border-b border-[#F0EAE1]">
        <div className="max-w-md mx-auto px-4 sm:max-w-2xl lg:max-w-4xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center sm:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C1917] text-[#F5E6D3] text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#C59B78]" />
                <span>Nişantaşı&apos;nın Lüks Estetik Salonu</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-tight">
                Cildinize Dokunan <span className="gold-gradient-text">Gençleştirici Işıltı</span>
              </h1>

              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-lg">
                Dünya standartlarında medikal cihazlar ve uzman doktor / estetisyen kadromuzla kişiye özel güzellik protokolleri sunuyoruz.
              </p>

              {/* Action Buttons */}
              <div className="pt-1 flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                <button
                  onClick={() => openBookingForService()}
                  className="px-5 py-3 rounded-2xl bg-[#1C1917] hover:bg-stone-800 text-stone-100 text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-97 cursor-pointer border border-stone-700"
                >
                  <Calendar className="w-4 h-4 text-[#C59B78]" />
                  <span>Anında Online Randevu Al</span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                </button>
              </div>
            </div>

            {/* Feature Highlights Pills */}
            <div className="grid grid-cols-2 gap-2.5 w-full sm:w-auto shrink-0 text-xs">
              <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#C59B78]" />
                <div>
                  <div className="font-bold text-stone-900">FDA Onaylı</div>
                  <div className="text-[10px] text-stone-500">Orijinal Cihazlar</div>
                </div>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs flex items-center gap-2">
                <Award className="w-4 h-4 text-[#C59B78]" />
                <div>
                  <div className="font-bold text-stone-900">Uzman Kadro</div>
                  <div className="text-[10px] text-stone-500">Sertifikalı Hekimler</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation Tabs (Horizontally Scrollable) */}
      <CategoryTabs />

      {/* Catalog Services Section */}
      <main id="services-section" className="max-w-md mx-auto px-4 py-6 sm:max-w-2xl lg:max-w-4xl space-y-8">
        
        {/* Category Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
              {selectedCategory === 'Tümü' ? 'Tüm Hizmetlerimiz & Fiyatlar' : `${selectedCategory} Paketleri`}
            </h2>
            <p className="text-stone-500 text-xs mt-0.5">
              İstediğiniz hizmeti seçerek 3 adımda kolayca randevunuzu oluşturun.
            </p>
          </div>

          <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
            {filteredServices.length} Hizmet
          </span>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl text-center border border-stone-200 text-stone-600 text-xs space-y-3">
            <p className="font-medium">Bu kategoride gösterilecek aktif hizmet bulunamadı.</p>
            <button
              onClick={() => resetToDefaults()}
              className="px-4 py-2 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
            >
              🔄 Varsayılan Mockup Verilerini Sıfırla & Yükle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}

        {/* Interactive Before / After Comparison Component */}
        <BeforeAfterSlider />

        {/* Customer Reviews & Trust Section */}
        <section className="bg-white rounded-3xl p-5 sm:p-7 border border-[#F0EAE1] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1 text-xs font-bold text-stone-900">{settings.googleRating} / 5.0</span>
              </div>
              <h3 className="font-bold text-stone-900 text-base mt-1">
                Danışanlarımızın Google Yorumları
              </h3>
            </div>
            <span className="text-xs font-medium text-stone-400">{settings.reviewCount}+ Değerlendirme</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900">Selin D.</span>
                <span className="text-[10px] text-stone-400">1 hafta önce</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                &quot;Hydrafacial bakımı için geldim. Dr. Selin Hanım ve ekibi harikaydı, cildim ilk seansta bile ışıl ışıl parladı. Hijyen ve ilgi üst seviye.&quot;
              </p>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900">Merve K.</span>
                <span className="text-[10px] text-stone-400">3 gün önce</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                &quot;Buz lazer epilasyonda hiç acı hissetmedim. WhatsApp üzerinden randevumu anında onayladılar. Kesinlikle Nişantaşı&apos;nın en şık kliniği.&quot;
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-md mx-auto px-4 mt-8 text-center text-xs text-stone-400 space-y-2 sm:max-w-2xl lg:max-w-4xl pb-10">
        <div className="flex items-center justify-center gap-2 text-stone-600 font-medium">
          <span>{settings.name}</span>
          <span>•</span>
          <span>{settings.workingHours}</span>
        </div>
        <p>© 2026 {settings.name}. Tüm Hakları Saklıdır.</p>
      </footer>

      {/* Modals & Sticky Bar */}
      <AppointmentModal />
      <LocationModal isOpen={locationModalOpen} onClose={() => setLocationModalOpen(false)} />
      <StickyBottomBar onOpenLocation={() => setLocationModalOpen(true)} />
    </div>
  );
}
