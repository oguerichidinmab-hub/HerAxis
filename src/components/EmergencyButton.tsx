import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { EmergencyScreen } from './EmergencyScreen';

export const EmergencyButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="pointer-events-auto bg-rose-600 text-white p-3 rounded-full shadow-lg hover:bg-rose-700 transition-colors flex items-center justify-center border-none cursor-pointer active:scale-95 transition-all"
        aria-label="Emergency Help"
      >
        <AlertTriangle size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <EmergencyScreen onBack={() => setIsOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
};
