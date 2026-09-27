'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAura } from '@/context/AuraContext';
import { AppointmentStatus, CategoryType, Service } from '@/types';
import { 
  ShieldCheck, 
  Calendar, 
  Tag, 
  Settings, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  MessageCircle, 
  Plus, 
  Eye, 
  EyeOff, 
  Edit3, 
  Save, 
  RotateCcw,
  Sparkles,
  Lock,
  Search,
  User,
  Image as ImageIcon,
  FileText
} from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'Cilt Bakımı', url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800' },
  { label: 'Lazer Epilasyon', url: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&q=80&w=800' },
  { label: 'Kaş & Makyaj', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800' },
  { label: 'Cilt Yenileme', url: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=800' },
  { label: 'G5 & Masaj', url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800' },
  { label: 'Protez Tırnak', url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=800' },
  { label: 'Eyeliner', url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800' },
  { label: 'Aroma Masaj', url: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=800' },
];

export default function AdminPage() {
  const { 
    settings, 
    services, 
    appointments, 
    updateAppointmentStatus, 
    updateService, 
    toggleServiceActive, 
    addService, 
    updateSettings, 
    resetToDefaults 
  } = useAura();

  // Auth PIN Simulation State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Admin Navigation Tabs
  const [activeTab, setActiveTab] = useState<'appointments' | 'services' | 'settings'>('appointments');

  // Appointment Status Filter
  const [statusFilter, setStatusFilter] = useState<string>('Tümü');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Full Edit Service Modal State
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    category: CategoryType;
    duration: string;
    price: string;
    originalPrice: string;
    description: string;
    image: string;
    specialist: string;
    popular: boolean;
  }>({
    name: '',
    category: 'Cilt Bakımı',
    duration: '50 Dk',
    price: '1400',
    originalPrice: '',
    description: '',
    image: '',
    specialist: '',
    popular: false,
  });

  // New Service Modal State
  const [newServiceModalOpen, setNewServiceModalOpen] = useState(false);
  const [newSrvName, setNewSrvName] = useState('');
  const [newSrvCategory, setNewSrvCategory] = useState<CategoryType>('Cilt Bakımı');
  const [newSrvDuration, setNewSrvDuration] = useState('50 Dk');
  const [newSrvPrice, setNewSrvPrice] = useState('1500');
  const [newSrvOriginalPrice, setNewSrvOriginalPrice] = useState('');
  const [newSrvDesc, setNewSrvDesc] = useState('');
  const [newSrvSpecialist, setNewSrvSpecialist] = useState('Uzman Estetisyen Melisa');
  const [newSrvImage, setNewSrvImage] = useState('https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800');
  const [newSrvPopular, setNewSrvPopular] = useState(false);

  // Settings Edit Form State
  const [settingsForm, setSettingsForm] = useState({
    name: settings.name,
    phone: settings.phone,
    whatsapp: settings.whatsapp,
    workingHours: settings.workingHours,
    announcement: settings.announcement,
  });
  const [settingsSaveSuccess, setSettingsSaveSuccess] = useState(false);

  // PIN Login Handler
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput === 'admin') {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Hatalı Şifre! (Demo Şifresi: 1234)');
    }
  };

  const handleQuickLogin = () => {
    setIsAuthenticated(true);
  };

  // WhatsApp Quick Confirm Dispatch
  const sendWhatsAppConfirmation = (apt: any) => {
    const text = `Sayın ${apt.customerName}, ${settings.name}'nde ${apt.date} günü saat ${apt.time} için ${apt.serviceName} randevunuz onaylanmıştır. Sizi ağırlamaktan mutluluk duyacağız!`;
    const url = `https://wa.me/${apt.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Open Full Edit Modal for a Service
  const openEditModal = (service: Service) => {
    setEditingService(service);
    setEditForm({
      name: service.name,
      category: service.category,
      duration: service.duration,
      price: service.price.toString(),
      originalPrice: service.originalPrice ? service.originalPrice.toString() : '',
      description: service.description,
      image: service.image,
      specialist: service.specialist,
      popular: !!service.popular,
    });
  };

  // Save Edit Service Changes
  const handleSaveEditService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editForm.name.trim()) return;

    updateService(editingService.id, {
      name: editForm.name.trim(),
      category: editForm.category,
      duration: editForm.duration.trim(),
      price: parseFloat(editForm.price) || 0,
      originalPrice: editForm.originalPrice ? parseFloat(editForm.originalPrice) : undefined,
      description: editForm.description.trim(),
      image: editForm.image.trim() || PRESET_IMAGES[0].url,
      specialist: editForm.specialist.trim() || 'Uzman Estetisyen',
      popular: editForm.popular,
    });

    setEditingService(null);
  };

  // New Service Submission
  const handleAddServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSrvName.trim()) return;

    addService({
      name: newSrvName.trim(),
      category: newSrvCategory,
      duration: newSrvDuration,
      price: parseFloat(newSrvPrice) || 1000,
      originalPrice: newSrvOriginalPrice ? parseFloat(newSrvOriginalPrice) : undefined,
      description: newSrvDesc.trim() || 'Özel estetik ve bakım uygulaması.',
      image: newSrvImage,
      specialist: newSrvSpecialist,
      popular: newSrvPopular,
      isActive: true,
    });

    setNewServiceModalOpen(false);
    setNewSrvName('');
    setNewSrvDesc('');
  };

  // Save Settings Handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    setSettingsSaveSuccess(true);
    setTimeout(() => setSettingsSaveSuccess(false), 3000);
  };

  // Filtered Appointments
  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = statusFilter === 'Tümü' || apt.status === statusFilter;
    const matchesQuery = 
      apt.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.phone.includes(searchQuery);
    return matchesStatus && matchesQuery;
  });

  // PIN AUTH LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl gold-gradient-bg text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-stone-900">Yönetim Paneli Girişi</h1>
            <p className="text-xs text-stone-500 mt-1">
              Esnaf & Yönetici Kontrol Paneline Erişmek İçin Şifre Giriniz
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-3">
            <div>
              <input
                type="password"
                placeholder="Giriş Şifresi (Örn: 1234)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-center font-mono text-base font-bold text-stone-900 focus:ring-2 focus:ring-[#C59B78] outline-none"
              />
              {pinError && (
                <p className="text-xs text-rose-600 font-medium mt-1.5">{pinError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1C1917] hover:bg-stone-800 text-white font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer border border-stone-700"
            >
              Giriş Yap
            </button>
          </form>

          <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
            <button
              onClick={handleQuickLogin}
              className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-2xl border border-emerald-200 transition-colors cursor-pointer"
            >
              ⚡ Tek Tıkla Giriş Yap (Demo Moda Özel)
            </button>

            <Link
              href="/"
              className="text-xs text-stone-500 hover:text-stone-900 font-medium flex items-center justify-center gap-1 mt-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Müşteri Ön Yüzüne Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // MAIN ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 pb-16">
      {/* Admin Top Header */}
      <header className="bg-[#1C1917] text-white sticky top-0 z-40 border-b border-stone-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gold-gradient-bg flex items-center justify-center text-white font-bold text-sm shadow-xs">
              A
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C59B78]" />
                <h1 className="font-bold text-sm sm:text-base text-stone-100">
                  {settings.name} Admin
                </h1>
              </div>
              <p className="text-[10px] text-stone-400 font-medium">
                Mobil Yönetici & Esnaf Kontrol Paneli
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetToDefaults}
              title="Demo verilerini sıfırla"
              className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium border border-stone-700 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sıfırla</span>
            </button>

            <Link
              href="/"
              className="px-3 py-1.5 rounded-xl bg-[#C59B78] hover:bg-[#A67B52] text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kataloğa Git</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-5xl mx-auto px-4 flex gap-2 border-t border-stone-800/80 pt-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'appointments'
                ? 'bg-[#FAF8F5] text-stone-900 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#C59B78]" />
            <span>Randevu Yönetimi</span>
            <span className="px-1.5 py-0.2 text-[10px] bg-amber-100 text-amber-900 rounded-full font-bold">
              {appointments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'services'
                ? 'bg-[#FAF8F5] text-stone-900 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Tag className="w-4 h-4 text-[#C59B78]" />
            <span>Hizmet & Fiyat Güncelleme</span>
            <span className="px-1.5 py-0.2 text-[10px] bg-stone-800 text-stone-300 rounded-full font-medium">
              {services.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#FAF8F5] text-stone-900 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Settings className="w-4 h-4 text-[#C59B78]" />
            <span>Merkez Ayarları</span>
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        
        {/* TAB 1: RANDEVU YÖNETİM EKRANI */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
              {/* Status Filter Tabs */}
              <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                {['Tümü', 'Beklemede', 'Onaylandı', 'Tamamlandı', 'İptal'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      statusFilter === st
                        ? 'bg-[#1C1917] text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Müşteri veya hizmet ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-[#C59B78]"
                />
              </div>
            </div>

            {/* Appointments Cards / Table */}
            {filteredAppointments.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center text-stone-500 text-xs">
                Kriterlere uygun randevu kaydı bulunamadı.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredAppointments.map((apt) => {
                  return (
                    <div
                      key={apt.id}
                      className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-3 relative overflow-hidden"
                    >
                      {/* Top Header Row */}
                      <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-stone-900 text-sm">
                              {apt.customerName}
                            </h3>
                            <span className="font-mono text-[10px] text-stone-400 font-semibold bg-stone-100 px-1.5 py-0.5 rounded">
                              #{apt.id}
                            </span>
                          </div>
                          <div className="text-xs text-stone-500 mt-0.5 flex items-center gap-2">
                            <span>📞 {apt.phone}</span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex flex-col items-end">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1 ${
                              apt.status === 'Onaylandı'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : apt.status === 'Beklemede'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : apt.status === 'Tamamlandı'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : 'bg-stone-100 text-stone-600 border-stone-300'
                            }`}
                          >
                            {apt.status === 'Onaylandı' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                            {apt.status === 'Beklemede' && <Clock className="w-3 h-3 text-amber-600" />}
                            {apt.status === 'Tamamlandı' && <Sparkles className="w-3 h-3 text-blue-600" />}
                            {apt.status === 'İptal' && <XCircle className="w-3 h-3 text-stone-500" />}
                            <span>{apt.status}</span>
                          </span>
                        </div>
                      </div>

                      {/* Appointment Details */}
                      <div className="space-y-1.5 text-xs text-stone-700">
                        <div className="flex justify-between">
                          <span className="text-stone-500">Seçilen Hizmet:</span>
                          <span className="font-semibold text-stone-900">{apt.serviceName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Uzman:</span>
                          <span className="font-medium text-stone-800">{apt.specialist}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Tarih / Saat:</span>
                          <span className="font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                            {apt.date} - {apt.time}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Tutar:</span>
                          <span className="font-bold text-stone-900">{apt.price} ₺</span>
                        </div>
                        {apt.notes && (
                          <div className="pt-1 text-[11px] text-stone-500 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                            &quot;{apt.notes}&quot;
                          </div>
                        )}
                      </div>

                      {/* Status Action Buttons & WhatsApp Confirm */}
                      <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                        {/* Status Toggle buttons */}
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-[10px] text-stone-400 font-medium mr-1">Durum:</span>
                          {(['Beklemede', 'Onaylandı', 'Tamamlandı', 'İptal'] as AppointmentStatus[]).map((st) => (
                            <button
                              key={st}
                              onClick={() => updateAppointmentStatus(apt.id, st)}
                              className={`px-2 py-1 text-[10px] font-semibold rounded-lg border transition-all cursor-pointer ${
                                apt.status === st
                                  ? 'bg-stone-900 text-white border-stone-900'
                                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>

                        {/* Hızlı WhatsApp Onay Butonu */}
                        <button
                          onClick={() => sendWhatsAppConfirmation(apt)}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] rounded-xl flex items-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer ml-auto"
                          title="Müşteriye hazır WhatsApp onay SMS'i gönder"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-white" />
                          <span>WhatsApp Onayı Gönder</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: HİZMET & FİYAT GÜNCELLEME EKRANI */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            {/* Header Action Bar */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
              <div>
                <h2 className="font-bold text-stone-900 text-base">Hizmet Kataloğu & Yönetimi</h2>
                <p className="text-xs text-stone-500">
                  Başlık, Fiyat, Görsel ve Yapan Kişiyi tek tıkla düzenleyebilirsiniz.
                </p>
              </div>

              <button
                onClick={() => setNewServiceModalOpen(true)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer border border-stone-700"
              >
                <Plus className="w-4 h-4 text-[#C59B78]" />
                <span>Yeni Hizmet Ekle</span>
              </button>
            </div>

            {/* Service List Cards */}
            <div className="space-y-3">
              {services.map((srv) => {
                return (
                  <div
                    key={srv.id}
                    className={`bg-white rounded-2xl border p-4 shadow-sm transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      srv.isActive ? 'border-stone-200' : 'border-rose-200 bg-rose-50/20 opacity-75'
                    }`}
                  >
                    {/* Image & Basic Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-16 h-16 rounded-xl bg-stone-100 overflow-hidden relative shrink-0 border border-stone-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={srv.image}
                          alt={srv.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800';
                          }}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-stone-900 text-sm truncate">
                            {srv.name}
                          </h3>
                          {srv.popular && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-900 rounded-md flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-600" /> Popüler
                            </span>
                          )}
                          {!srv.isActive && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-700 rounded-md">
                              Pasif (Yayında Değil)
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-stone-500 flex-wrap">
                          <span className="font-medium text-stone-700">{srv.category}</span>
                          <span>•</span>
                          <span>⏱️ {srv.duration}</span>
                          <span>•</span>
                          <span className="font-semibold text-stone-900">👤 {srv.specialist}</span>
                        </div>
                        <p className="text-[11px] text-stone-500 line-clamp-1 italic">
                          &quot;{srv.description}&quot;
                        </p>
                      </div>
                    </div>

                    {/* Price & Full Edit Actions */}
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2.5 sm:pt-0 border-stone-100">
                      {/* Price Display */}
                      <div className="text-left sm:text-right">
                        <div className="font-bold text-base text-stone-900">
                          {srv.price.toLocaleString('tr-TR')} ₺
                        </div>
                        {srv.originalPrice && (
                          <div className="text-[10px] text-stone-400 line-through">
                            {srv.originalPrice.toLocaleString('tr-TR')} ₺
                          </div>
                        )}
                      </div>

                      {/* Action Buttons: Full Edit & Toggle Active */}
                      <div className="flex items-center gap-2">
                        {/* Full Edit Button */}
                        <button
                          onClick={() => openEditModal(srv)}
                          className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-[#F5E6D3] text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer border border-stone-700"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#C59B78]" />
                          <span>Düzenle</span>
                        </button>

                        {/* Active / Inactive Toggle Button */}
                        <button
                          onClick={() => toggleServiceActive(srv.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                            srv.isActive
                              ? 'bg-stone-100 text-stone-700 hover:bg-rose-50 hover:text-rose-700'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {srv.isActive ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-rose-500" />
                              <span className="hidden sm:inline">Pasife Al</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="hidden sm:inline">Yayına Al</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: MERKEZ GENEL AYARLARI */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-5">
            <div>
              <h2 className="font-bold text-stone-900 text-base">Merkez Genel Bilgileri</h2>
              <p className="text-xs text-stone-500">
                Salon adı, çalışma saatleri ve duyuru metnini özelleştirin.
              </p>
            </div>

            {settingsSaveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Ayarlar başarıyla güncellendi ve ana kataloğa yansıtıldı!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Merkez Adı</label>
                <input
                  type="text"
                  value={settingsForm.name}
                  onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium outline-none focus:ring-2 focus:ring-[#C59B78]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Telefon Numarası</label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium outline-none focus:ring-2 focus:ring-[#C59B78]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">WhatsApp Hattı</label>
                  <input
                    type="text"
                    value={settingsForm.whatsapp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium outline-none focus:ring-2 focus:ring-[#C59B78]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Çalışma Saatleri Metni</label>
                <input
                  type="text"
                  value={settingsForm.workingHours}
                  onChange={(e) => setSettingsForm({ ...settingsForm, workingHours: e.target.value })}
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium outline-none focus:ring-2 focus:ring-[#C59B78]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Üst İndirim / Duyuru Metni</label>
                <input
                  type="text"
                  value={settingsForm.announcement}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium outline-none focus:ring-2 focus:ring-[#C59B78]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1C1917] hover:bg-stone-800 text-white font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer border border-stone-700"
              >
                Ayarları Kaydet
              </button>
            </form>
          </div>
        )}
      </main>

      {/* FULL EDIT SERVICE MODAL */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setEditingService(null)}
            className="fixed inset-0 bg-stone-900/70 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl shadow-2xl overflow-hidden z-10 border border-stone-200 max-h-[90vh] flex flex-col">
            <div className="bg-[#1C1917] text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#C59B78]" />
                <h3 className="font-bold text-sm">Hizmet Detaylarını Düzenle</h3>
              </div>
              <button
                onClick={() => setEditingService(null)}
                className="w-7 h-7 rounded-full bg-stone-800 text-stone-300 flex items-center justify-center cursor-pointer hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditService} className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Service Title */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Hizmet Adı (Başlık) *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 font-bold outline-none focus:ring-2 focus:ring-[#C59B78]"
                />
              </div>

              {/* Category & Specialist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Kategori</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value as CategoryType })}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 outline-none"
                  >
                    <option value="Cilt Bakımı">Cilt Bakımı</option>
                    <option value="Lazer Epilasyon">Lazer Epilasyon</option>
                    <option value="Bölgesel İncelme">Bölgesel İncelme</option>
                    <option value="Kalıcı Makyaj">Kalıcı Makyaj</option>
                    <option value="Tırnak & Masaj">Tırnak & Masaj</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#C59B78]" /> Uygulayan Uzman / Yapan Kişi *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Uzman Estetisyen Melisa"
                    value={editForm.specialist}
                    onChange={(e) => setEditForm({ ...editForm, specialist: e.target.value })}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-medium text-stone-900 outline-none focus:ring-2 focus:ring-[#C59B78]"
                  />
                </div>
              </div>

              {/* Price, Original Price & Duration */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Fiyat (₺) *</label>
                  <input
                    type="number"
                    required
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-bold text-stone-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Eski Fiyat (₺)</label>
                  <input
                    type="number"
                    placeholder="Opsiyonel"
                    value={editForm.originalPrice}
                    onChange={(e) => setEditForm({ ...editForm, originalPrice: e.target.value })}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-stone-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Süre (Dk)</label>
                  <input
                    type="text"
                    value={editForm.duration}
                    onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-medium outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Hizmet Açıklaması</label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-[#C59B78]"
                />
              </div>

              {/* Image URL & Preset Picker */}
              <div className="space-y-2">
                <label className="block font-semibold text-stone-700 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-[#C59B78]" /> Görsel URL&apos;si
                  </span>
                  <span className="text-[10px] text-stone-400 font-normal">veya Şablon Seçin</span>
                </label>
                <input
                  type="text"
                  value={editForm.image}
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 font-mono text-[11px] outline-none"
                  placeholder="https://..."
                />

                {/* Preset Image Options */}
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-1">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, image: preset.url })}
                      className="px-2.5 py-1 bg-stone-100 hover:bg-[#1C1917] hover:text-white text-stone-700 rounded-lg text-[10px] font-semibold whitespace-nowrap transition-colors border border-stone-200"
                    >
                      📷 {preset.label}
                    </button>
                  ))}
                </div>

                {/* Live Image Preview */}
                {editForm.image && (
                  <div className="mt-2 relative h-28 w-full rounded-xl bg-stone-100 overflow-hidden border border-stone-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={editForm.image}
                      alt="Önizleme"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800';
                      }}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 left-2 bg-stone-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Canlı Görsel Önizleme
                    </div>
                  </div>
                )}
              </div>

              {/* Popular Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="popularCheck"
                  checked={editForm.popular}
                  onChange={(e) => setEditForm({ ...editForm, popular: e.target.checked })}
                  className="w-4 h-4 accent-[#C59B78] rounded cursor-pointer"
                />
                <label htmlFor="popularCheck" className="font-semibold text-stone-800 cursor-pointer flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Bu hizmeti &quot;Popüler Hizmetler&quot; rozetiyle öne çıkar
                </label>
              </div>

              {/* Form Buttons */}
              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2.5 bg-stone-100 text-stone-700 rounded-xl font-semibold hover:bg-stone-200 cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1C1917] hover:bg-stone-800 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4 text-[#C59B78]" />
                  <span>Değişiklikleri Kaydet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW SERVICE MODAL */}
      {newServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setNewServiceModalOpen(false)}
            className="fixed inset-0 bg-stone-900/70 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-md bg-[#FAF8F5] rounded-3xl shadow-2xl overflow-hidden z-10 border border-stone-200 max-h-[90vh] flex flex-col">
            <div className="bg-[#1C1917] text-white p-4 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-sm">Yeni Hizmet Ekle</h3>
              <button
                onClick={() => setNewServiceModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-800 text-stone-300 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddServiceSubmit} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Hizmet Adı (Başlık) *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Somon DNA Gençlik Aşısı"
                  value={newSrvName}
                  onChange={(e) => setNewSrvName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-[#C59B78]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Kategori</label>
                  <select
                    value={newSrvCategory}
                    onChange={(e) => setNewSrvCategory(e.target.value as CategoryType)}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl outline-none"
                  >
                    <option value="Cilt Bakımı">Cilt Bakımı</option>
                    <option value="Lazer Epilasyon">Lazer Epilasyon</option>
                    <option value="Bölgesel İncelme">Bölgesel İncelme</option>
                    <option value="Kalıcı Makyaj">Kalıcı Makyaj</option>
                    <option value="Tırnak & Masaj">Tırnak & Masaj</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Fiyat (₺)</label>
                  <input
                    type="number"
                    required
                    value={newSrvPrice}
                    onChange={(e) => setNewSrvPrice(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Süre (Dk)</label>
                  <input
                    type="text"
                    value={newSrvDuration}
                    onChange={(e) => setNewSrvDuration(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Uygulayan Uzman</label>
                  <input
                    type="text"
                    value={newSrvSpecialist}
                    onChange={(e) => setNewSrvSpecialist(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Görsel URL</label>
                <input
                  type="text"
                  value={newSrvImage}
                  onChange={(e) => setNewSrvImage(e.target.value)}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl outline-none font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Açıklama</label>
                <textarea
                  rows={2}
                  value={newSrvDesc}
                  onChange={(e) => setNewSrvDesc(e.target.value)}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl outline-none"
                  placeholder="Hizmet detayları ve etkileri..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1C1917] hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer border border-stone-700 mt-2"
              >
                Hizmeti Kataloğa Ekle
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
