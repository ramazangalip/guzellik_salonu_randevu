'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Download, X, Sparkles, CheckCircle2 } from 'lucide-react';

export default function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Unregister legacy or stale Service Workers in development or on repair
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (let registration of registrations) {
          // If in dev mode or legacy active worker, unregister to prevent cached JS mismatch
          if (process.env.NODE_ENV !== 'production') {
            registration.unregister();
          }
        }
      });
      // Clear legacy cache keys
      if ('caches' in window) {
        caches.keys().then((names) => {
          for (let name of names) {
            if (name.includes('aura-estetik-v1')) {
              caches.delete(name);
            }
          }
        });
      }
    }

    // Register active service worker only in production
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('Service Worker registered successfully:', reg.scope))
        .catch((err) => console.log('Service Worker registration failed:', err));
    }

    // Check if already in standalone PWA mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (!showInstallBanner || isInstalled) return null;

  return (
    <div className="fixed top-14 left-4 right-4 z-40 max-w-md mx-auto bg-stone-900 text-white rounded-2xl p-3.5 shadow-2xl border border-stone-800 flex items-center justify-between gap-3 animate-bounce-short">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center shrink-0 overflow-hidden relative">
          <Image
            src="/gemini-svg.svg"
            alt="Aura Estetik İkon"
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#C59B78]">
            <Sparkles className="w-3 h-3" />
            <span>PWA MOBİL UYGULAMA</span>
          </div>
          <h4 className="text-xs font-bold text-stone-100">Ana Ekranına Ekle</h4>
          <p className="text-[10px] text-stone-400">Tek tıkla randevu almak için yükleyin.</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleInstallClick}
          className="px-3 py-1.5 bg-[#C59B78] hover:bg-[#A67B52] text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-sm transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Yükle</span>
        </button>
        <button
          onClick={() => setShowInstallBanner(false)}
          className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
