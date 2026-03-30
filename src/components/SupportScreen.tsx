import React from 'react';
import { motion } from 'motion/react';
import { Heart, Brain, Sparkles, ShieldCheck, ChevronRight } from 'lucide-react';

export const SupportScreen: React.FC = () => {
  return (
    <div className="space-y-6 pb-24">
      <header className="pt-8 px-4">
        <h1 className="text-3xl font-bold text-stone-900">Support Hub</h1>
        <p className="text-stone-500">Care for your mind and body</p>
      </header>

      {/* Postpartum Recovery Section */}
      <section className="px-4">
        <div className="bg-teal-50 rounded-[2rem] p-6 border border-teal-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-teal-500 p-2 rounded-xl text-white">
              <Heart size={20} />
            </div>
            <h2 className="text-xl font-bold text-teal-900">Postpartum Recovery</h2>
          </div>
          <p className="text-teal-800 text-sm mb-6 leading-relaxed">
            Healing takes time. Be gentle with yourself as your body recovers from the incredible journey of childbirth.
          </p>
          
          <div className="grid grid-cols-1 gap-3">
            {[
              { title: 'Physical Recovery Tips', icon: ShieldCheck },
              { title: 'Pelvic Floor Health', icon: Sparkles },
              { title: 'Nutrition for Healing', icon: Heart },
            ].map((item, i) => (
              <button key={i} className="bg-white p-4 rounded-2xl border border-teal-100 flex items-center justify-between text-teal-900 font-bold text-sm">
                <div className="flex items-center gap-3">
                  <item.icon size={18} className="text-teal-500" />
                  {item.title}
                </div>
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Mental Health Support */}
      <section className="px-4">
        <div className="bg-indigo-50 rounded-[2rem] p-6 border border-indigo-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-500 p-2 rounded-xl text-white">
              <Brain size={20} />
            </div>
            <h2 className="text-xl font-bold text-indigo-900">Emotional Well-being</h2>
          </div>
          <p className="text-indigo-800 text-sm mb-6 leading-relaxed">
            Your mental health is just as important as your physical health. We are here to support you through the ups and downs.
          </p>

          <div className="space-y-3">
            <div className="bg-white p-5 rounded-2xl border border-indigo-100">
              <h4 className="font-bold text-indigo-900 mb-2">The "Baby Blues"</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                It's common to feel tearful or anxious in the first week after birth. If these feelings persist beyond two weeks, please reach out to a professional.
              </p>
            </div>
            
            <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-colors">
              Talk to a Peer Counselor
            </button>
            <button className="w-full bg-white text-indigo-600 border border-indigo-200 py-4 rounded-2xl font-bold hover:bg-indigo-50 transition-colors">
              Self-Care Exercises
            </button>
          </div>
        </div>
      </section>

      {/* Emergency Reminder */}
      <section className="px-4">
        <div className="bg-rose-50 p-5 rounded-2xl border border-rose-100">
          <p className="text-rose-800 text-xs font-medium text-center">
            If you are feeling overwhelmed or having thoughts of hurting yourself or your baby, please use the emergency button at the top right immediately.
          </p>
        </div>
      </section>
    </div>
  );
};
