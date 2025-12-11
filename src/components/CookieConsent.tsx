import React, { useState, useEffect } from 'react';
import { Cookie, X, Shield, Settings } from 'lucide-react';
import Cookies from 'js-cookie';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    const consent = Cookies.get('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    
    Cookies.set('cookie-consent', JSON.stringify(allPreferences), { expires: 365 });
    setShowBanner(false);
    
    // Initialize analytics and other services
    initializeServices(allPreferences);
  };

  const handleAcceptSelected = () => {
    Cookies.set('cookie-consent', JSON.stringify(preferences), { expires: 365 });
    setShowBanner(false);
    setShowSettings(false);
    
    // Initialize only selected services
    initializeServices(preferences);
  };

  const handleRejectAll = () => {
    const minimalPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    
    Cookies.set('cookie-consent', JSON.stringify(minimalPreferences), { expires: 365 });
    setShowBanner(false);
    
    // Initialize only necessary services
    initializeServices(minimalPreferences);
  };

  const initializeServices = (prefs: typeof preferences) => {
    // Initialize analytics if accepted
    if (prefs.analytics) {
      // Initialize Google Analytics, etc.
      console.log('Analytics initialized');
    }
    
    // Initialize marketing tools if accepted
    if (prefs.marketing) {
      // Initialize Facebook Pixel, etc.
      console.log('Marketing tools initialized');
    }
    
    // Initialize functional cookies if accepted
    if (prefs.functional) {
      // Initialize chat widgets, etc.
      console.log('Functional services initialized');
    }
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50 animate-slide-up">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-start space-x-4">
            <div className="bg-orange-100 p-3 rounded-full flex-shrink-0">
              <Cookie className="text-orange-600" size={24} />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                We Value Your Privacy
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We use cookies to enhance your browsing experience, serve personalized content, 
                and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. 
                You can customize your preferences or learn more in our{' '}
                <a href="/privacy-policy" className="text-orange-600 hover:text-orange-700 underline">
                  Privacy Policy
                </a>.
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleAcceptAll}
                  className="btn-primary"
                >
                  Accept All Cookies
                </button>
                
                <button
                  onClick={() => setShowSettings(true)}
                  className="btn-outline flex items-center space-x-2"
                >
                  <Settings size={16} />
                  <span>Customize</span>
                </button>
                
                <button
                  onClick={handleRejectAll}
                  className="btn-ghost"
                >
                  Reject All
                </button>
              </div>
            </div>
            
            <button
              onClick={() => setShowBanner(false)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Cookie Preferences</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-3 mb-2">
                  <Shield className="text-blue-600" size={20} />
                  <h3 className="font-semibold text-blue-900">Your Privacy Matters</h3>
                </div>
                <p className="text-blue-800 text-sm">
                  Choose which cookies you're comfortable with. You can change these settings at any time.
                </p>
              </div>

              {/* Necessary Cookies */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">Necessary Cookies</h4>
                    <p className="text-sm text-gray-600">Required for basic site functionality</p>
                  </div>
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                    Always Active
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  These cookies are essential for the website to function properly. They enable core functionality 
                  such as security, network management, and accessibility.
                </p>
              </div>

              {/* Analytics Cookies */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">Analytics Cookies</h4>
                    <p className="text-sm text-gray-600">Help us understand how you use our site</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-500">
                  These cookies help us understand how visitors interact with our website by collecting 
                  and reporting information anonymously.
                </p>
              </div>

              {/* Marketing Cookies */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">Marketing Cookies</h4>
                    <p className="text-sm text-gray-600">Used to deliver relevant advertisements</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-500">
                  These cookies are used to make advertising messages more relevant to you and your interests.
                </p>
              </div>

              {/* Functional Cookies */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">Functional Cookies</h4>
                    <p className="text-sm text-gray-600">Enable enhanced functionality and personalization</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={(e) => setPreferences(prev => ({ ...prev, functional: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-500">
                  These cookies enable the website to provide enhanced functionality and personalization, 
                  such as remembering your preferences.
                </p>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100">
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowSettings(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAcceptSelected}
                  className="btn-primary"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}