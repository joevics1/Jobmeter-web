"use client";

import React, { useState, useEffect } from 'react';
import { X, Bell, CheckCircle } from 'lucide-react';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const WhatsAppIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const JOBMETER_BOT_URL = 'https://t.me/JobMeter_Bot';

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);

const channels = {
  whatsapp: [
    { label: 'Global Jobs', href: 'https://whatsapp.com/channel/0029VbCmGF10Qeanq3dje41Z' },
    { label: 'Gulf Jobs', href: 'https://whatsapp.com/channel/0029VbCym2i7DAWx9oGcIV11' },
    { label: 'Nigerian Jobs', href: 'https://whatsapp.com/channel/0029VbC3NrUKLaHp8JAt7v3y' },
    { label: 'Indian Jobs', href: 'https://whatsapp.com/channel/0029Vb8ARN82f3ENIUrBEB3u' },
  ],
  telegram: [
    { label: 'Global Jobs', href: 'https://t.me/+nK6OHg9ksAthOTc0' },
    { label: 'Gulf Jobs', href: 'https://t.me/+dxmM9_THQnY3Y2M0' },
    { label: 'Nigerian Jobs', href: 'https://t.me/+1YYoQJdLzzkwNDI0' },


  ],
};

export default function ExitIntentPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [hasExited, setHasExited] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hasClickedSocial = localStorage.getItem('exit-intent-social-clicked');
    if (hasClickedSocial) return;

    const stored = localStorage.getItem('exit-intent-popup-shown');
    if (stored) {
      const storedTime = parseInt(stored);
      const now = Date.now();
      if (now - storedTime < SEVEN_DAYS_MS) return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasExited) {
        setHasExited(true);
        setShowPopup(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasExited]);

  const handleSocialClick = () => {
    localStorage.setItem('exit-intent-social-clicked', 'true');
    setShowPopup(false);
    localStorage.setItem('exit-intent-popup-shown', Date.now().toString());
  };

  const handleClose = () => {
    setShowPopup(false);
    localStorage.setItem('exit-intent-popup-shown', Date.now().toString());
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Close popup"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 pt-10 pb-16 px-6 text-center">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          </div>

          <div className="relative">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3 transform hover:rotate-6 transition-transform">
              <Bell className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Wait! Don&apos;t Leave Yet!
            </h2>
            <p className="text-blue-100 text-sm">
              Get instant job alerts before anyone else
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 -mt-8 relative">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-5">
            <p className="text-gray-600 text-center mb-4 text-sm">
              Join <span className="font-semibold text-blue-600">5,000+</span> job seekers getting daily updates!
            </p>

            {/* JobMeter Bot — smart matching, not just a broadcast channel */}
            <a
              href={JOBMETER_BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleSocialClick}
              className="relative flex items-center gap-3 w-full p-3 mb-4 rounded-2xl bg-gradient-to-r from-[#0088cc] to-blue-600 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              <span className="absolute -top-2 -right-2 bg-amber-400 text-[10px] font-bold text-gray-900 px-1.5 py-0.5 rounded-full shadow">
                NEW
              </span>
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 shrink-0">
                <span className="text-white"><TelegramIcon /></span>
              </span>
              <span className="flex-1 text-left">
                <span className="block text-sm font-bold leading-tight">Chat with JobMeter Bot</span>
                <span className="block text-xs text-white/80 leading-tight">Get matched to jobs instantly, just for you</span>
              </span>
              <ArrowRightIcon />
            </a>

            <p className="text-center text-xs text-gray-400 mb-3">— or pick a channel for daily updates —</p>

            {/* WhatsApp section */}
            <div className="mb-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-green-600"><WhatsAppIcon /></span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">WhatsApp</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {channels.whatsapp.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleSocialClick}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-medium hover:bg-green-500 hover:text-white hover:border-green-500 transition-all"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 my-3" />

            {/* Telegram section */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[#0088cc]"><TelegramIcon /></span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Telegram</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {channels.telegram.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleSocialClick}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-50 text-[#0088cc] border border-sky-200 rounded-full text-xs font-medium hover:bg-[#0088cc] hover:text-white hover:border-[#0088cc] transition-all"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
              <span>Free &amp; No spam, ever!</span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-full mt-4 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}