'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Download, X, Sparkles, Share, PlusSquare, Smartphone, CheckCircle2, ChevronRight } from 'lucide-react';

export default function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Check if already running in PWA mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
      setShowBanner(false);
      return;
    }

    // Check if user dismissed banner recently in this session
    const isDismissed = sessionStorage.getItem('aura_pwa_dismissed');
    if (!isDismissed) {
      // Show banner after 1.2s delay for a clean entrance
      const timer = setTimeout(() => setShowBanner(true), 1200);
      return () => clearTimeout(timer);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for custom trigger event from Header or other buttons
    const handleTriggerInstall = () => {
      setShowGuideModal(true);
    };
    window.addEventListener('open-pwa-install', handleTriggerInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('open-pwa-install', handleTriggerInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Open interactive instruction modal for iOS or manual browsers
      setShowGuideModal(true);
    }
  };

  const handleDismissBanner = () => {
    setShowBanner(false);
    sessionStorage.setItem('aura_pwa_dismissed', 'true');
  };

  if (isInstalled) return null;

  return (
    <>
      {/* Floating Top Banner (Appears on Homepage and All Pages) */}
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
              onClick={handleInstallClick}
              className="px-3 py-1.5 bg-[#C59B78] hover:bg-[#A67B52] text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-sm transition-all active:scale-95 cursor-pointer touch-manipulation"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Yükle</span>
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

      {/* Interactive PWA Installation Guide Modal (For iOS Safari & Chrome) */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowGuideModal(false)}
            className="fixed inset-0 bg-stone-900/80 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-sm bg-[#FAF8F5] rounded-3xl shadow-2xl overflow-hidden z-10 border border-stone-200">
            <div className="bg-[#1C1917] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#C59B78]" />
                <h3 className="font-bold text-sm">Mobil Uygulamayı Yükle</h3>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="w-7 h-7 rounded-full bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* App Icon Header */}
              <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="w-12 h-12 rounded-2xl bg-stone-900 border border-stone-700 flex items-center justify-center shrink-0 overflow-hidden relative">
                  <Image
                    src="/gemini-svg.svg"
                    alt="Aura Estetik"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Aura Estetik & Güzellik</h4>
                  <p className="text-[11px] text-stone-500">Mobil Uygulama Kurulumu</p>
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              {isIos ? (
                <div className="space-y-3 bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-amber-900">
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    <span>📱 iPhone / Safari için Kurulum Steps:</span>
                  </div>
                  <ol className="space-y-2 text-xs">
                    <li className="flex items-start gap-2">
                      <span className="font-bold bg-amber-200 px-1.5 py-0.5 rounded text-[10px]">1</span>
                      <span>Tarayıcı altındaki <strong className="font-semibold">Paylaş (Share) <Share className="w-3.5 h-3.5 inline text-blue-600" /></strong> butonuna dokunun.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold bg-amber-200 px-1.5 py-0.5 rounded text-[10px]">2</span>
                      <span>Açılan menüde aşağı kaydırıp <strong className="font-semibold">&quot;Ana Ekrana Ekle&quot; <PlusSquare className="w-3.5 h-3.5 inline text-stone-800" /></strong> seçeneğini seçin.</span>
                    </li>
                  </ol>
                </div>
              ) : (
                <div className="space-y-3 bg-stone-100 p-4 rounded-2xl border border-stone-200 text-stone-800">
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    <span>📱 Android / Chrome için Kurulum Steps:</span>
                  </div>
                  <ol className="space-y-2 text-xs">
                    <li className="flex items-start gap-2">
                      <span className="font-bold bg-stone-300 px-1.5 py-0.5 rounded text-[10px]">1</span>
                      <span>Tarayıcı sağ üstteki <strong className="font-semibold">Menü (⋮)</strong> simgesine dokunun.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold bg-stone-300 px-1.5 py-0.5 rounded text-[10px]">2</span>
                      <span><strong className="font-semibold">&quot;Uygulamayı Yükle&quot;</strong> veya <strong className="font-semibold">&quot;Ana Ekrana Ekle&quot;</strong> butonuna tıklayın.</span>
                    </li>
                  </ol>
                </div>
              )}

              <button
                onClick={() => setShowGuideModal(false)}
                className="w-full py-3 bg-[#1C1917] hover:bg-stone-800 text-white font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer border border-stone-700"
              >
                Anladım, Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

