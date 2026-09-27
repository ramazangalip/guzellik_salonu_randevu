export type CategoryType = 
  | 'Tümü'
  | 'Cilt Bakımı'
  | 'Lazer Epilasyon'
  | 'Bölgesel İncelme'
  | 'Kalıcı Makyaj'
  | 'Tırnak & Masaj';

export interface Service {
  id: string;
  name: string;
  category: CategoryType;
  duration: string; // e.g., "50 Dk"
  price: number; // e.g., 1400
  originalPrice?: number;
  description: string;
  image: string;
  specialist: string;
  popular?: boolean;
  isActive: boolean;
}

export type AppointmentStatus = 'Beklemede' | 'Onaylandı' | 'Tamamlandı' | 'İptal';

export interface Appointment {
  id: string;
  customerName: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  specialist: string;
  price: number;
  date: string; // YYYY-MM-DD
  time: string; // e.g., "14:00"
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface CenterSettings {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  whatsapp: string;
  googleRating: number;
  reviewCount: number;
  workingHours: string;
  announcement: string;
  isOpen: boolean;
}
