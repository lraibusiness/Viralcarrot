'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    } else {
      setConsentGiven(consent === 'true');
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setShowBanner(false);
    setConsentGiven(true);
    
    // Enable Google AdSense and Analytics
    if (typeof window !== 'undefined') {
      // Enable Google AdSense
      (window as any).gtag = (window as any).gtag || function() {
        ((window as any).gtag.q = (window as any).gtag.q || []).push(arguments);
      };
      
      // Enable Google Analytics
      if ((window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          'ad_storage': 'granted',
          'analytics_storage': 'granted',
          'personalization_storage': 'granted',
          'functionality_storage': 'granted',
          'security_storage': 'granted'
        });
      }
    }
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'false');
    setShowBanner(false);
    setConsentGiven(false);
    
    // Disable Google AdSense and Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'ad_storage': 'denied',
        'analytics_storage': 'denied',
        'personalization_storage': 'denied',
        'functionality_storage': 'denied',
        'security_storage': 'denied'
      });
    }
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Cookie Consent
            </h3>
            <p className="text-sm text-slate-600 mb-2">
              We use cookies to enhance your experience, serve personalized ads, and analyze our traffic. 
              By clicking "Accept All", you consent to our use of cookies. 
              <Link href="/cookies" className="text-amber-600 hover:text-amber-700 underline">
                Learn more about our cookie policy
              </Link>.
            </p>
            <p className="text-xs text-slate-500">
              This includes cookies from Google AdSense for personalized advertising and Google Analytics for website analytics.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Decline All
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
