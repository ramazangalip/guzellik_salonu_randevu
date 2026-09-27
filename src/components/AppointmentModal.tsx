'use client';

import React, { useState, useEffect } from 'react';
import { useAura } from '@/context/AuraContext';
import { Service } from '@/types';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  MessageCircle,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SPECIALISTS = [
  'Fark Etmez (En Uygun Uzman)',
  'Uzman Estetisyen Melisa',
  'Op. Dr. Selin Yılmaz',
  'Uzman Zeynep Arslan',
  'Kalıcı Makyaj Uzmanı Ebru',
  'Fizyoterapist Sevgi Can',
  'Nail Artist Daria',
];

const TIME_SLOTS = [
  '09:30', '10:30', '11:30', '13:00', '14:30', '15:30', '17:00', '18:30'
];

export default function AppointmentModal() {
  const { 
    bookingModalOpen, 
    setBookingModalOpen, 
    selectedServiceForBooking, 
    services, 
    settings,
    addAppointment 
  } = useAura();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('14:30');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [createdAptInfo, setCreatedAptInfo] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Generate upcoming 7 dates
  const [upcomingDates, setUpcomingDates] = useState<{ raw: string; label: string; dayName: string }[]>([]);

  useEffect(() => {
    const dates = [];
    const now = new Date();
    for (let i = 1; i <= 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      const raw = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('tr-TR', { weekday: 'short' });
      const label = `${d.getDate()} ${d.toLocaleDateString('tr-TR', { month: 'short' })}`;
      dates.push({ raw, label, dayName });
    }
    setUpcomingDates(dates);
    if (dates.length > 0) {
      setSelectedDate(dates[0].raw);
    }
  }, []);

  useEffect(() => {
    if (selectedServiceForBooking) {
      setSelectedService(selectedServiceForBooking);
      setSelectedSpecialist(selectedServiceForBooking.specialist || SPECIALISTS[0]);
    } else if (services.length > 0) {
      const activeSrv = services.find(s => s.isActive) || services[0];
      setSelectedService(activeSrv);
      setSelectedSpecialist(activeSrv.specialist || SPECIALISTS[0]);
    }
    setStep(1);
    setErrorMsg('');
  }, [selectedServiceForBooking, bookingModalOpen, services]);

  if (!bookingModalOpen) return null;

  const handleNextStep = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!selectedService) {
        setErrorMsg('Lütfen bir hizmet seçiniz.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedDate || !selectedTime) {
        setErrorMsg('Lütfen tarih ve saat seçiniz.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!customerName.trim() || customerName.trim().length < 3) {
        setErrorMsg('Lütfen geçerli bir Ad Soyad giriniz.');
        return;
      }
      if (!customerPhone.trim() || customerPhone.trim().length < 10) {
        setErrorMsg('Lütfen geçerli bir Telefon Numarası giriniz (En az 10 hane).');
        return;
      }

      // Submit Appointment
      if (selectedService) {
        const newApt = addAppointment({
          customerName: customerName.trim(),
          phone: customerPhone.trim(),
          serviceId: selectedService.id,
          serviceName: selectedService.name,
          specialist: selectedSpecialist,
          price: selectedService.price,
          date: selectedDate,
          time: selectedTime,
          notes: notes.trim(),
        });
        setCreatedAptInfo(newApt);
        setStep(4); // Success step
      }
    }
  };

  const handleBack = () => {
    setErrorMsg('');
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  const closeModal = () => {
    setBookingModalOpen(false);
    setStep(1);
    setCustomerName('');
    setCustomerPhone('');
    setNotes('');
  };

  const getWhatsAppMessageUrl = () => {
    if (!createdAptInfo || !selectedService) return '#';
    const text = `Merhaba, ${settings.name}'den randevu talebinde bulundum:
📌 Hizmet: ${selectedService.name}
👤 Uzman: ${selectedSpecialist}
📅 Tarih: ${selectedDate}
⏰ Saat: ${selectedTime}
💰 Ücret: ${selectedService.price} ₺
🙋‍♂️ İsim: ${customerName}
📞 Tel: ${customerPhone}
${notes ? `📝 Not: ${notes}` : ''}

Randevumu onaylamanızı rica ederim.`;

    return `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
          className="fixed inset-0 bg-stone-900/70 backdrop-blur-sm"
        />

        {/* Modal Window (Bottom Sheet style on mobile, centered card on desktop) */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-lg bg-[#FAF8F5] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col border border-stone-200"
        >
          {/* Header */}
          <div className="bg-[#1C1917] text-white p-4 sm:p-5 flex items-center justify-between relative">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-[#C59B78] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ONLINE RANDEVU AL</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-stone-100 mt-0.5">
                {step === 4 ? 'Randevu Talebiniz Alındı! ✨' : `${step}. Adım: ${step === 1 ? 'Hizmet & Uzman' : step === 2 ? 'Tarih & Saat' : 'İletişim Bilgileri'}`}
              </h2>
            </div>
            <button
              onClick={closeModal}
              className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar (For steps 1-3) */}
          {step < 4 && (
            <div className="w-full bg-stone-200 h-1.5 flex">
              <div
                className="bg-[#C59B78] h-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          )}

          {/* Body Content */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                {errorMsg}
              </div>
            )}

            {/* STEP 1: SERVICE & SPECIALIST */}
            {step === 1 && (
              <div className="space-y-4">
                {/* Service Selector Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Seçilen Hizmet
                  </label>
                  <select
                    value={selectedService?.id || ''}
                    onChange={(e) => {
                      const found = services.find(s => s.id === e.target.value);
                      if (found) {
                        setSelectedService(found);
                        setSelectedSpecialist(found.specialist || SPECIALISTS[0]);
                      }
                    }}
                    className="w-full p-3 rounded-2xl bg-white border border-stone-300 text-stone-900 text-xs font-medium focus:ring-2 focus:ring-[#C59B78] outline-none"
                  >
                    {services.filter(s => s.isActive).map((srv) => (
                      <option key={srv.id} value={srv.id}>
                        {srv.name} - ({srv.duration}) - {srv.price} ₺
                      </option>
                    ))}
                  </select>
                </div>

                {/* Service Summary Card */}
                {selectedService && (
                  <div className="p-3.5 rounded-2xl bg-white border border-stone-200 flex items-center gap-3 shadow-2xs">
                    <div className="w-16 h-16 rounded-xl bg-stone-100 overflow-hidden relative shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedService.image}
                        alt={selectedService.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800';
                        }}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-stone-900 truncate">
                        {selectedService.name}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-stone-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#C59B78]" /> {selectedService.duration}
                        </span>
                        <span className="font-bold text-stone-900 text-xs">
                          {selectedService.price} ₺
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Specialist Selector */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Tercih Edilen Uzman / Estetisyen
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {SPECIALISTS.map((spec) => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => setSelectedSpecialist(spec)}
                        className={`p-2.5 rounded-xl text-xs text-left font-medium border transition-all flex items-center justify-between cursor-pointer ${
                          selectedSpecialist === spec
                            ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-sm'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <span className="truncate">{spec}</span>
                        {selectedSpecialist === spec && (
                          <CheckCircle2 className="w-4 h-4 text-[#C59B78] shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: DATE & TIME */}
            {step === 2 && (
              <div className="space-y-4">
                {/* Date Picker Horizontal Pills */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center justify-between">
                    <span>Randevu Tarihi</span>
                    <span className="text-[11px] text-stone-400 font-normal">Gelecek 7 Gün</span>
                  </label>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {upcomingDates.map((item) => {
                      const isSel = selectedDate === item.raw;
                      return (
                        <button
                          key={item.raw}
                          type="button"
                          onClick={() => setSelectedDate(item.raw)}
                          className={`flex flex-col items-center justify-center p-2.5 rounded-2xl min-w-[70px] border transition-all cursor-pointer ${
                            isSel
                              ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-md ring-2 ring-[#C59B78]/40'
                              : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <span className={`text-[10px] font-semibold uppercase ${isSel ? 'text-[#C59B78]' : 'text-stone-400'}`}>
                            {item.dayName}
                          </span>
                          <span className="text-xs font-bold mt-0.5 whitespace-nowrap">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Uygun Saat Dilimi
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {TIME_SLOTS.map((slot) => {
                      const isSel = selectedTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                            isSel
                              ? 'bg-[#C59B78] text-white border-[#C59B78] shadow-md scale-102'
                              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Summary snippet */}
                <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-[#A67B52] shrink-0" />
                  <span>
                    Seçilen Zaman: <strong className="font-semibold">{selectedDate}</strong> günü saat <strong className="font-semibold">{selectedTime}</strong>
                  </span>
                </div>
              </div>
            )}

            {/* STEP 3: CUSTOMER CONTACT FORM */}
            {step === 3 && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Adınız Soyadınız *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      placeholder="Örn: Zeynep Yılmaz"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-medium text-stone-900 focus:ring-2 focus:ring-[#C59B78] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Telefon Numarası *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                    <input
                      type="tel"
                      placeholder="05xx xxx xx xx"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-medium text-stone-900 focus:ring-2 focus:ring-[#C59B78] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Randevu Notu / Özel İstek (Opsiyonel)
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                    <textarea
                      rows={2}
                      placeholder="Cilt tipiniz veya belirtmek istediğiniz detaylar..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-medium text-stone-900 focus:ring-2 focus:ring-[#C59B78] outline-none"
                    />
                  </div>
                </div>

                {/* Final Booking Summary Box */}
                <div className="p-3 bg-stone-100 rounded-2xl border border-stone-200 text-xs space-y-1 text-stone-700">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Hizmet:</span>
                    <span className="font-semibold text-stone-900">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Tarih & Saat:</span>
                    <span className="font-semibold text-stone-900">{selectedDate} / {selectedTime}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-stone-200">
                    <span className="text-stone-500">Toplam Tutarlar:</span>
                    <span className="font-bold text-stone-900 text-sm">{selectedService?.price} ₺</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: SUCCESS CONFIRMATION SCREEN */}
            {step === 4 && (
              <div className="py-4 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="font-bold text-stone-900 text-lg">
                    Tebrikler, Randevu Talebiniz Oluşturuldu!
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 max-w-xs mx-auto">
                    Randevunuz mock veritabanına kaydedildi. Talebinizi anında onaylatmak için aşağıdaki WhatsApp butonunu kullanabilirsiniz.
                  </p>
                </div>

                {/* Appointment Card Summary */}
                <div className="p-4 rounded-2xl bg-white border border-stone-200 text-left text-xs space-y-2 shadow-xs max-w-sm mx-auto">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <span className="text-stone-400 font-medium">Randevu Kodu</span>
                    <span className="font-mono font-bold text-stone-900">{createdAptInfo?.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Müşteri:</span>
                    <span className="font-semibold text-stone-900">{customerName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Hizmet:</span>
                    <span className="font-semibold text-stone-900">{selectedService?.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Tarih / Saat:</span>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {selectedDate} - {selectedTime}
                    </span>
                  </div>
                </div>

                {/* WhatsApp Action Button */}
                <div className="space-y-2 max-w-sm mx-auto">
                  <a
                    href={getWhatsAppMessageUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>WhatsApp ile Anında Teyit Et</span>
                  </a>

                  <button
                    onClick={closeModal}
                    className="w-full py-2.5 text-xs text-stone-500 hover:text-stone-900 font-medium"
                  >
                    Kapat ve Kataloğa Dön
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions (Steps 1-3) */}
          {step < 4 && (
            <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between gap-3">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Geri
                </button>
              ) : (
                <span />
              )}

              <button
                type="button"
                onClick={handleNextStep}
                className="px-5 py-2.5 rounded-xl bg-[#1C1917] hover:bg-stone-800 text-stone-100 text-xs font-bold flex items-center gap-1.5 shadow-md ml-auto cursor-pointer border border-stone-700"
              >
                <span>{step === 3 ? 'Randevuyu Onayla' : 'Devam Et'}</span>
                <ChevronRight className="w-4 h-4 text-[#C59B78]" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
