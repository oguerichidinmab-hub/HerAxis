import React, { useState } from 'react';
import { AlertTriangle, Phone, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const EmergencyButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 bg-rose-600 text-white p-3 rounded-full shadow-lg hover:bg-rose-700 transition-colors flex items-center justify-center"
        aria-label="Emergency Help"
      >
        <AlertTriangle size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-rose-600 flex items-center gap-2">
                  <AlertTriangle /> Emergency Help
                </h2>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-stone-100 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl">
                  <p className="text-rose-800 font-medium mb-2">If you are experiencing:</p>
                  <ul className="text-rose-700 text-sm space-y-1 list-disc pl-4">
                    <li>Severe abdominal pain</li>
                    <li>Heavy bleeding</li>
                    <li>Sudden swelling of face/hands</li>
                    <li>Reduced baby movement</li>
                    <li>Thoughts of self-harm</li>
                  </ul>
                </div>

                <p className="text-stone-600 text-sm italic">
                  Disclaimer: This app provides guidance, not medical diagnosis. Please seek professional care immediately.
                </p>

                <div className="grid grid-cols-1 gap-3">
                  <a
                    href="tel:911"
                    className="flex items-center justify-center gap-3 bg-rose-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-rose-700 transition-colors"
                  >
                    <Phone size={20} /> Call Emergency Services
                  </a>
                  <button
                    className="flex items-center justify-center gap-3 bg-stone-100 text-stone-700 py-4 rounded-2xl font-bold hover:bg-stone-200 transition-colors"
                  >
                    Contact My Doctor (Mock)
                  </button>
                  <button
                    className="flex items-center justify-center gap-3 bg-stone-100 text-stone-700 py-4 rounded-2xl font-bold hover:bg-stone-200 transition-colors"
                  >
                    Find Nearest Hospital
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
