'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Download, X, Sparkles } from 'lucide-react';

export default function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already running in standalone PWA mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
      setShowBanner(false);
      return;
    }

    // Check if user dismissed banner recently in this session
    const isDismissed = sessionStorage.getItem('aura_pwa_dismissed');
    if (!isDismissed) {
      setShowBanner(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isDismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for direct install triggers from Header or other buttons
    const handleDirectInstallEvent = () => {
      executeDirectInstall();
    };
    window.addEventListener('trigger-direct-pwa-install', handleDirectInstallEvent);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('trigger-direct-pwa-install', handleDirectInstallEvent);
    };
  }, []);

  const executeDirectInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Direct file / manifest download fallback (No popup modal shown!)
      const link = document.createElement('a');
      link.href = '/manifest.json';
      link.download = 'Aura-Estetik-Mobil-Uygulama.webmanifest';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDismissBanner = () => {
    setShowBanner(false);
    sessionStorage.setItem('aura_pwa_dismissed', 'true');
  };

  if (isInstalled) return null;

  return (
    <>
      {/* Floating Top Banner (Direct Install Action) */}
      {showBanner && (
        <div className="fixed top-14 left-3 right-3 z-40 max-w-md mx-auto bg-[#1C1917] text-white rounded-2xl p-3.5 shadow-2xl border border-stone-800 flex items-center justify-between gap-3 animate-bounce-short">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center shrink-0 overflow-hidden relative shadow-xs">
              <Image
                src="/gemini-svg.svg"
                alt="Aura Estetik İkon"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 text-[10px] font-bold text-[#C59B78]">
                <Sparkles className="w-3 h-3" />
                <span>PWA MOBİL UYGULAMA</span>
              </div>
              <h4 className="text-xs font-bold text-stone-100 truncate">Ana Ekranına Ekle</h4>
              <p className="text-[10px] text-stone-400 truncate">Tek tıkla hızlı randevu almak için yükleyin.</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={executeDirectInstall}
              className="px-3 py-1.5 bg-[#C59B78] hover:bg-[#A67B52] text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-sm transition-all active:scale-95 cursor-pointer touch-manipulation"
            >
              <Download className="w-3.5 h-3.5" />
              <span>İndir</span>
            </button>
            <button
              onClick={handleDismissBanner}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

