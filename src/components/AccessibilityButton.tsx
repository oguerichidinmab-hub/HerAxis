import React, { useState, useEffect } from 'react';
import { Settings2, Type, Volume2, Globe, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../UserContext';

export const AccessibilityButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { profile, togglePreference } = useUser();
  const [language, setLanguage] = useState('English');

  useEffect(() => {
    if (!profile?.preferences?.voiceGuidance) {
      window.speechSynthesis.cancel();
      return;
    }

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Don't read if clicking the accessibility button or its contents to avoid annoyance
      if (target.closest('[aria-label="Accessibility Options"]') || target.closest('.accessibility-modal')) {
        return;
      }

      // Try to get the most relevant text
      let textToRead = target.innerText || target.getAttribute('aria-label') || target.textContent;
      
      if (textToRead && textToRead.trim().length > 0) {
        window.speechSynthesis.cancel(); // Stop current speech
        const utterance = new SpeechSynthesisUtterance(textToRead.trim());
        
        // Optional: Set language based on selection
        if (language === 'Spanish') utterance.lang = 'es-ES';
        else if (language === 'French') utterance.lang = 'fr-FR';
        else utterance.lang = 'en-US';

        window.speechSynthesis.speak(utterance);
      }
    };

    document.addEventListener('click', handleGlobalClick, { capture: true });

    return () => {
      document.removeEventListener('click', handleGlobalClick, { capture: true });
      window.speechSynthesis.cancel();
    };
  }, [profile?.preferences?.voiceGuidance, language]);



  const languages = ['English', 'Spanish', 'French', 'Swahili'];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="pointer-events-auto bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 p-3 rounded-full shadow-lg hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors flex items-center justify-center border border-stone-100 dark:border-stone-700"
        aria-label="Accessibility Options"
      >
        <Settings2 size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 accessibility-modal pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-stone-900 w-full max-w-md rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] border border-stone-100 dark:border-stone-800"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Settings2 className="text-pink-500" /> Accessibility Options
                </h2>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors">
                  <X size={24} className="text-stone-400 dark:text-stone-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Voice Mode */}
                <div className="bg-stone-50 dark:bg-stone-800/50 p-5 rounded-2xl border border-stone-100 dark:border-stone-700 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-xl text-indigo-600 dark:text-indigo-400">
                      <Volume2 size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 dark:text-white">Voice Mode</h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Read text aloud</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => togglePreference('voiceGuidance')}
                    className={`w-14 h-8 rounded-full transition-colors relative ${profile?.preferences?.voiceGuidance ? 'bg-indigo-500' : 'bg-stone-200 dark:bg-stone-700'}`}
                  >
                    <motion.div 
                      className="w-6 h-6 bg-white rounded-full absolute top-1 shadow-sm"
                      animate={{ left: profile?.preferences?.voiceGuidance ? '34px' : '4px' }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                {/* Large Text */}
                <div className="bg-stone-50 dark:bg-stone-800/50 p-5 rounded-2xl border border-stone-100 dark:border-stone-700 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-xl text-amber-600 dark:text-amber-400">
                      <Type size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 dark:text-white">Large Text</h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Increase font size</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => togglePreference('largeText')}
                    className={`w-14 h-8 rounded-full transition-colors relative ${profile?.preferences?.largeText ? 'bg-amber-500' : 'bg-stone-200 dark:bg-stone-700'}`}
                  >
                    <motion.div 
                      className="w-6 h-6 bg-white rounded-full absolute top-1 shadow-sm"
                      animate={{ left: profile?.preferences?.largeText ? '34px' : '4px' }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                {/* Language */}
                <div className="bg-stone-50 dark:bg-stone-800/50 p-5 rounded-2xl border border-stone-100 dark:border-stone-700">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-teal-100 dark:bg-teal-900/30 p-3 rounded-xl text-teal-600 dark:text-teal-400">
                      <Globe size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 dark:text-white">Language</h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Choose your preferred language</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {languages.map(lang => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-between transition-all ${
                          language === lang 
                            ? 'bg-teal-500 text-white shadow-md' 
                            : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
                        }`}
                      >
                        {lang}
                        {language === lang && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full mt-8 bg-stone-900 dark:bg-white text-white dark:text-stone-900 py-4 rounded-2xl font-bold hover:bg-stone-800 dark:hover:bg-stone-100 transition-colors active:scale-95"
              >
                Save Preferences
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
