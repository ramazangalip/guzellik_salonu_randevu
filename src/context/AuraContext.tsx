'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Service, Appointment, CenterSettings, CategoryType } from '@/types';

const INITIAL_SETTINGS: CenterSettings = {
  name: 'Aura Estetik & Güzellik Merkezi',
  tagline: 'Lüks Klinik Estetiği & Kişiselleştirilmiş Bakım',
  address: 'Abdi İpekçi Cad. No: 42 Kat: 3, Nişantaşı / İstanbul',
  phone: '+90 (212) 234 56 78',
  whatsapp: '905301234567',
  googleRating: 4.9,
  reviewCount: 184,
  workingHours: 'Pzt - Cmt: 09:00 - 19:30 | Pzr: Kapalı',
  announcement: '✨ İlk Randevunuza Özel %15 İndirim! Kupon Kodu: AURA15',
  isOpen: true,
};

const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-1',
    name: 'Hydrafacial Medikal Cilt Bakımı',
    category: 'Cilt Bakımı',
    duration: '50 Dk',
    price: 1400,
    originalPrice: 1750,
    description: 'Vakum teknolojisi ile cildinizi derinlemesine temizler, gözenekleri arındırır ve antioksidan serumlarla gençleştirir.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800',
    specialist: 'Uzman Estetisyen Melisa',
    popular: true,
    isActive: true,
  },
  {
    id: 'srv-2',
    name: 'Diyot Buz Başlıklı Lazer Epilasyon',
    category: 'Lazer Epilasyon',
    duration: '60 Dk',
    price: 2800,
    originalPrice: 3500,
    description: 'Son teknoloji soğutmalı başlık ile tamamen acısız, her cilt tipine uygun 4 mevsim kalıcı pürüzsüzlük protokolu.',
    image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&q=80&w=800',
    specialist: 'Uzman Zeynep Arslan',
    popular: true,
    isActive: true,
  },
  {
    id: 'srv-3',
    name: 'Microblading 6D Kaş Tasarımı',
    category: 'Kalıcı Makyaj',
    duration: '90 Dk',
    price: 2500,
    description: 'Kişiye özel kıl tekniğiyle doğal, dolgun ve yüz kavisinize en uygun ultra gerçekçi kaş simülasyonu.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800',
    specialist: 'Kalıcı Makyaj Uzmanı Ebru',
    popular: true,
    isActive: true,
  },
  {
    id: 'srv-4',
    name: 'Altın İğne (Secret RF) Cilt Gençleştirme',
    category: 'Cilt Bakımı',
    duration: '60 Dk',
    price: 3200,
    originalPrice: 4000,
    description: 'Mikro iğneli radyofrekans enerjisi ile kolajen üretimini tetikler, skar, leke ve ince kırışıklıkları giderir.',
    image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=800',
    specialist: 'Op. Dr. Selin Yılmaz',
    popular: true,
    isActive: true,
  },
  {
    id: 'srv-5',
    name: 'G5 Selülit & Bölgesel İncelme',
    category: 'Bölgesel İncelme',
    duration: '45 Dk',
    price: 950,
    description: 'Ritmik titreşimlerle kan dolaşımını hızlandırır, selülit görünümünü yok eder ve bölgesel sıkılaşma sağlar.',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800',
    specialist: 'Fizyoterapist Sevgi Can',
    popular: false,
    isActive: true,
  },
  {
    id: 'srv-6',
    name: 'Protez Tırnak & Jel Güçlendirme',
    category: 'Tırnak & Masaj',
    duration: '75 Dk',
    price: 750,
    description: 'Kırılmayan, 4 hafta kalıcı parlak tırnaklar ve özel nail-art tasarımları ile kusursuz eller.',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=800',
    specialist: 'Nail Artist Daria',
    popular: true,
    isActive: true,
  },
  {
    id: 'srv-7',
    name: 'Dipliner & Babyliner Kalıcı Makyaj',
    category: 'Kalıcı Makyaj',
    duration: '60 Dk',
    price: 1800,
    description: 'Gözlerinize derinlik ve sürekli bakımlı bir görünüm katan, akmayan yüksek pigmentli ince hat uygulaması.',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800',
    specialist: 'Kalıcı Makyaj Uzmanı Ebru',
    popular: false,
    isActive: true,
  },
  {
    id: 'srv-8',
    name: 'Aroma Terapi & Sıcak Taş Masajı',
    category: 'Tırnak & Masaj',
    duration: '60 Dk',
    price: 1200,
    description: 'Doğal bitkisel yağlar ve ısıtılmış volkanik taşlarla kas gerginliğini gideren derin rahatlama terapisi.',
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=800',
    specialist: 'Masaj Terapisti Aylin',
    popular: false,
    isActive: true,
  },
  {
    id: 'srv-9',
    name: 'Dudak Renklendirme (Lip Blush)',
    category: 'Kalıcı Makyaj',
    duration: '75 Dk',
    price: 2200,
    description: 'Solgun dudaklara doğal pembe ışıltı ve belirgin çerçeve kazandıran organik pigmentli renklendirme.',
    image: 'https://images.unsplash.com/photo-1588516903720-8ceb67f9ef84?auto=format&fit=crop&q=80&w=800',
    specialist: 'Kalıcı Makyaj Uzmanı Ebru',
    popular: false,
    isActive: true,
  },
  {
    id: 'srv-10',
    name: 'EMS BodySculpt Kas Yapılandırma',
    category: 'Bölgesel İncelme',
    duration: '30 Dk',
    price: 1600,
    description: 'Elektromanyetik dalgalarla 30 dakikada 20.000 mekik/squat etkisi yaratarak kas hacmini artırır ve yağ yakar.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800',
    specialist: 'Fizyoterapist Sevgi Can',
    popular: true,
    isActive: true,
  },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    customerName: 'Aylin Öztürk',
    phone: '05321112233',
    serviceId: 'srv-1',
    serviceName: 'Hydrafacial Medikal Cilt Bakımı',
    specialist: 'Uzman Estetisyen Melisa',
    price: 1400,
    date: '2026-09-28',
    time: '11:30',
    notes: 'Cildim hassas, sakinleştirici serum rica ediyorum.',
    status: 'Onaylandı',
    createdAt: '2026-09-27T04:00:00.000Z',
  },
  {
    id: 'apt-102',
    customerName: 'Sinem Karaca',
    phone: '05354445566',
    serviceId: 'srv-3',
    serviceName: 'Microblading 6D Kaş Tasarımı',
    specialist: 'Kalıcı Makyaj Uzmanı Ebru',
    price: 2500,
    date: '2026-09-28',
    time: '14:00',
    notes: 'Daha önce mikroblading yapılmadı, tasarım provası yapılabilir mi?',
    status: 'Beklemede',
    createdAt: '2026-09-27T03:00:00.000Z',
  },
  {
    id: 'apt-103',
    customerName: 'Burcu Yılmaz',
    phone: '05427778899',
    serviceId: 'srv-6',
    serviceName: 'Protez Tırnak & Jel Güçlendirme',
    specialist: 'Nail Artist Daria',
    price: 750,
    date: '2026-09-27',
    time: '16:30',
    notes: 'Fransız manikürü stili istiyorum.',
    status: 'Tamamlandı',
    createdAt: '2026-09-26T04:00:00.000Z',
  }
];

interface ContextType {
  settings: CenterSettings;
  services: Service[];
  appointments: Appointment[];
  selectedCategory: CategoryType;
  setSelectedCategory: (cat: CategoryType) => void;
  bookingModalOpen: boolean;
  setBookingModalOpen: (open: boolean) => void;
  selectedServiceForBooking: Service | null;
  openBookingForService: (service?: Service) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => Appointment;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  updateServicePrice: (id: string, price: number) => void;
  updateService: (id: string, updatedFields: Partial<Service>) => void;
  toggleServiceActive: (id: string) => void;
  addService: (newService: Omit<Service, 'id'>) => void;
  updateSettings: (newSettings: Partial<CenterSettings>) => void;
  resetToDefaults: () => void;
}

const AuraContext = createContext<ContextType | undefined>(undefined);

export function AuraProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<CenterSettings>(INITIAL_SETTINGS);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Tümü');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<Service | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Client hydration check & localStorage sync
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('aura_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed && parsed.name) setSettings(parsed);
      }

      const savedServices = localStorage.getItem('aura_services');
      if (savedServices) {
        const parsed: Service[] = JSON.parse(savedServices);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure all initial services exist and are active
          const activeServices = parsed.map(srv => ({
            ...srv,
            isActive: srv.isActive !== undefined ? srv.isActive : true
          }));
          setServices(activeServices);
        } else {
          setServices(INITIAL_SERVICES);
        }
      }

      const savedAppointments = localStorage.getItem('aura_appointments');
      if (savedAppointments) {
        const parsed = JSON.parse(savedAppointments);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAppointments(parsed);
        } else {
          setAppointments(INITIAL_APPOINTMENTS);
        }
      }
    } catch (e) {
      console.error('Failed to load local storage state:', e);
      setServices(INITIAL_SERVICES);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage only after initial load
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('aura_settings', JSON.stringify(settings));
    } catch (e) {}
  }, [settings, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('aura_services', JSON.stringify(services));
    } catch (e) {}
  }, [services, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('aura_appointments', JSON.stringify(appointments));
    } catch (e) {}
  }, [appointments, isLoaded]);

  const openBookingForService = (service?: Service) => {
    if (service) {
      setSelectedServiceForBooking(service);
    } else {
      const activeSrv = services.find(s => s.isActive) || services[0] || INITIAL_SERVICES[0];
      setSelectedServiceForBooking(activeSrv);
    }
    setBookingModalOpen(true);
  };

  const addAppointment = (data: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => {
    const newApt: Appointment = {
      ...data,
      id: `apt-${Date.now().toString().slice(-4)}`,
      status: 'Beklemede',
      createdAt: new Date().toISOString(),
    };
    setAppointments(prev => [newApt, ...prev]);
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, status } : apt))
    );
  };

  const updateServicePrice = (id: string, price: number) => {
    setServices(prev =>
      prev.map(srv => (srv.id === id ? { ...srv, price } : srv))
    );
  };

  const updateService = (id: string, updatedFields: Partial<Service>) => {
    setServices(prev =>
      prev.map(srv => (srv.id === id ? { ...srv, ...updatedFields } : srv))
    );
  };

  const toggleServiceActive = (id: string) => {
    setServices(prev =>
      prev.map(srv => (srv.id === id ? { ...srv, isActive: !srv.isActive } : srv))
    );
  };

  const addService = (newService: Omit<Service, 'id'>) => {
    const srv: Service = {
      ...newService,
      id: `srv-${Date.now().toString().slice(-4)}`,
    };
    setServices(prev => [srv, ...prev]);
  };

  const updateSettings = (newSettings: Partial<CenterSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetToDefaults = () => {
    setSettings(INITIAL_SETTINGS);
    setServices(INITIAL_SERVICES);
    setAppointments(INITIAL_APPOINTMENTS);
    try {
      localStorage.clear();
      localStorage.setItem('aura_settings', JSON.stringify(INITIAL_SETTINGS));
      localStorage.setItem('aura_services', JSON.stringify(INITIAL_SERVICES));
      localStorage.setItem('aura_appointments', JSON.stringify(INITIAL_APPOINTMENTS));
    } catch (e) {}
  };

  return (
    <AuraContext.Provider
      value={{
        settings,
        services,
        appointments,
        selectedCategory,
        setSelectedCategory,
        bookingModalOpen,
        setBookingModalOpen,
        selectedServiceForBooking,
        openBookingForService,
        addAppointment,
        updateAppointmentStatus,
        updateServicePrice,
        updateService,
        toggleServiceActive,
        addService,
        updateSettings,
        resetToDefaults,
      }}
    >
      {children}
    </AuraContext.Provider>
  );
}

export function useAura() {
  const context = useContext(AuraContext);
  if (!context) {
    throw new Error('useAura must be used within an AuraProvider');
  }
  return context;
}
