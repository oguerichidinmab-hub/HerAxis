import React from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [0.8, 1.1, 1],
          opacity: 1 
        }}
        transition={{ 
          duration: 0.8,
          ease: "easeOut"
        }}
        className="flex flex-col items-center"
      >
        <Logo size={120} className="mb-6" />
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl font-black tracking-tighter text-stone-900">
            HERA<span className="text-rose-500">XIS</span>
          </h1>
          <p className="text-stone-400 font-medium mt-2 tracking-widest uppercase text-xs">
            Your Maternal Health
          </p>
        </motion.div>
      </motion.div>

      {/* Loading indicator */}
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: "120px" }}
        transition={{ delay: 0.8, duration: 1.5, ease: "easeInOut" }}
        className="h-1 bg-rose-100 rounded-full mt-12 overflow-hidden relative"
      >
        <motion.div 
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="absolute inset-0 bg-rose-500 w-1/2"
        />
      </motion.div>
    </div>
  );
};
