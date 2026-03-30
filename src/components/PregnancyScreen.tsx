import React, { useState } from 'react';
import { useUser } from '../UserContext';
import { PREGNANCY_UPDATES } from '../mockData';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Info, CheckCircle2, ChevronRight, X } from 'lucide-react';

export const PregnancyScreen: React.FC = () => {
  const { profile } = useUser();
  const [showFruitDetails, setShowFruitDetails] = useState(false);
  const currentWeek = profile.stageValue;
  const update = PREGNANCY_UPDATES.find(u => u.week === currentWeek) || PREGNANCY_UPDATES[0];
  const fruitTheme = profile.preferences.fruitTheme || 'standard';
  const currentFruit = update.fruitSize[fruitTheme];

  return (
    <div className="space-y-6 pb-24">
      <header className="pt-8 px-4">
        <h1 className="text-3xl font-bold text-stone-900">Pregnancy Hub</h1>
        <p className="text-stone-500">Your journey, week by week</p>
      </header>

      {/* Trimester Progress */}
      <section className="px-4">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-stone-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-stone-800">Trimester {update.trimester}</h3>
            <span className="text-pink-600 font-bold text-sm">Week {currentWeek}</span>
          </div>
          <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentWeek / 40) * 100}%` }}
              className="h-full bg-pink-500 rounded-full"
            />
          </div>
          <p className="text-xs text-stone-400 mt-2 text-center">
            {40 - currentWeek} weeks to go until your due date
          </p>
        </div>
      </section>

      {/* Baby Size Visual */}
      <section className="px-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFruitDetails(true)}
          className="w-full bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm flex items-center justify-between group"
        >
          <div className="text-left">
            <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-1">Baby's Size</p>
            <h3 className="text-xl font-bold text-stone-800">Like a {currentFruit.name}</h3>
            <p className="text-sm text-stone-500">Tap to see details</p>
          </div>
          <div className="text-5xl group-hover:scale-110 transition-transform">
            {currentFruit.emoji}
          </div>
        </motion.button>
      </section>

      {/* Weekly Update */}
      <section className="px-4">
        <div className="bg-pink-50 rounded-[2rem] p-6 border border-pink-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-pink-500 p-2 rounded-xl text-white">
              <Heart size={20} />
            </div>
            <h2 className="text-xl font-bold text-pink-900">{update.title}</h2>
          </div>
          <p className="text-pink-800 mb-6 leading-relaxed">
            {update.description}
          </p>

          <div className="space-y-4">
            <div className="bg-white/60 p-4 rounded-2xl">
              <h4 className="flex items-center gap-2 font-bold text-pink-900 mb-2">
                <Info size={16} /> Body Changes
              </h4>
              <p className="text-sm text-pink-800">{update.bodyChanges}</p>
            </div>

            <div>
              <h4 className="font-bold text-pink-900 mb-3">Weekly Tips</h4>
              <div className="space-y-2">
                {update.tips.map((tip, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-pink-100">
                    <CheckCircle2 size={18} className="text-pink-500 flex-shrink-0" />
                    <p className="text-sm text-stone-700">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trimester Guide */}
      <section className="px-4">
        <h3 className="text-lg font-bold mb-3">Trimester Guide</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((t) => (
            <button
              key={t}
              className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${
                update.trimester === t 
                  ? 'bg-pink-600 border-pink-600 text-white shadow-lg shadow-pink-100' 
                  : 'bg-white border-stone-100 text-stone-700'
              }`}
            >
              <div className="text-left">
                <p className="font-bold">Trimester {t}</p>
                <p className={`text-xs ${update.trimester === t ? 'text-pink-100' : 'text-stone-400'}`}>
                  {t === 1 ? 'Weeks 1-12' : t === 2 ? 'Weeks 13-26' : 'Weeks 27-40'}
                </p>
              </div>
              <ChevronRight size={20} />
            </button>
          ))}
        </div>
      </section>

      {/* Fruit Details Modal */}
      <AnimatePresence>
        {showFruitDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFruitDetails(false)}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-pink-50 to-white -z-10" />
              
              <button 
                onClick={() => setShowFruitDetails(false)} 
                className="absolute top-6 right-6 p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X size={24} className="text-stone-400" />
              </button>

              <div className="text-center space-y-6">
                <div className="text-8xl mb-4 drop-shadow-xl">
                  {currentFruit.emoji}
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold text-stone-900 mb-2">
                    {currentFruit.name}
                  </h2>
                  <p className="text-pink-600 font-bold uppercase tracking-widest text-sm">
                    Week {currentWeek}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-stone-50 p-5 rounded-3xl border border-stone-100">
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Size Comparison</p>
                    <p className="text-stone-700 leading-relaxed italic">
                      "{currentFruit.description}"
                    </p>
                  </div>

                  <div className="bg-pink-50/50 p-5 rounded-3xl border border-pink-100/50 text-left">
                    <p className="text-xs font-bold text-pink-400 uppercase tracking-wider mb-2">Development Update</p>
                    <p className="text-sm text-stone-700 leading-relaxed">
                      {update.developmentDetail}
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setShowFruitDetails(false)}
                    className="w-full bg-pink-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-pink-100 hover:bg-pink-700 transition-colors"
                  >
                    Got it!
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
