import React from 'react';
import { useUser } from '../UserContext';
import { BABY_UPDATES } from '../mockData';
import { motion } from 'motion/react';
import { Baby, Star, Lightbulb, ChevronRight } from 'lucide-react';

export const BabyScreen: React.FC = () => {
  const { profile } = useUser();
  const currentMonth = profile.stageValue;
  const update = BABY_UPDATES.find(u => u.month === currentMonth) || BABY_UPDATES[0];

  return (
    <div className="space-y-6 pb-24">
      <header className="pt-8 px-4">
        <h1 className="text-3xl font-bold text-stone-900">Baby Hub</h1>
        <p className="text-stone-500">Growth and development</p>
      </header>

      {/* Growth Tracker Summary */}
      <section className="px-4">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-400 rounded-[2rem] p-6 text-white shadow-xl shadow-blue-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-blue-100 text-sm font-medium uppercase tracking-wider">Baby's Age</span>
              <h2 className="text-4xl font-bold">{currentMonth} Month{currentMonth > 1 ? 's' : ''}</h2>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
              <Baby size={24} />
            </div>
          </div>
          <p className="text-lg font-medium mb-2">{update.title}</p>
          <p className="text-blue-50 text-sm opacity-90">{update.description}</p>
        </div>
      </section>

      {/* Milestones */}
      <section className="px-4">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Star className="text-amber-400" size={20} /> Key Milestones
        </h3>
        <div className="space-y-3">
          {update.milestones.map((milestone, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 font-bold text-xs">
                {i + 1}
              </div>
              <p className="text-sm text-stone-700 font-medium">{milestone}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Care Tips */}
      <section className="px-4">
        <div className="bg-amber-50 rounded-[2rem] p-6 border border-amber-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-amber-500 p-2 rounded-xl text-white">
              <Lightbulb size={20} />
            </div>
            <h3 className="text-lg font-bold text-amber-900">Care Guidance</h3>
          </div>
          <div className="space-y-3">
            {update.tips.map((tip, i) => (
              <div key={i} className="bg-white/60 p-4 rounded-xl border border-amber-100">
                <p className="text-sm text-amber-900 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4">
        <h3 className="text-lg font-bold mb-3">Resources</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Breastfeeding', color: 'bg-pink-100 text-pink-700' },
            { label: 'Sleep Support', color: 'bg-indigo-100 text-indigo-700' },
            { label: 'Parenting 101', color: 'bg-teal-100 text-teal-700' },
            { label: 'Baby Safety', color: 'bg-orange-100 text-orange-700' },
          ].map((cat, i) => (
            <button key={i} className={`${cat.color} p-4 rounded-2xl font-bold text-sm text-left flex justify-between items-center`}>
              {cat.label}
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
