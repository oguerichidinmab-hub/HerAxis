import React from 'react';
import { useUser } from '../UserContext';
import { PREGNANCY_UPDATES, BABY_UPDATES, NUTRITION_TIPS, FORUM_POSTS } from '../mockData';
import { UserStage } from '../types';
import { ChevronRight, Utensils, MessageSquare, Sparkles, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export const HomeScreen: React.FC = () => {
  const { profile } = useUser();
  
  const stageUpdate = profile.stage === UserStage.PREGNANT 
    ? PREGNANCY_UPDATES.find(u => u.week === profile.stageValue)
    : BABY_UPDATES.find(u => u.month === profile.stageValue);

  const dailyNutrition = NUTRITION_TIPS[0];
  const latestPost = FORUM_POSTS[0];

  return (
    <div className="space-y-6 pb-24">
      <header className="pt-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-stone-900">Hello, {profile.name}</h1>
          <p className="text-stone-500">Welcome back to HERAXIS</p>
        </motion.div>
      </header>

      {/* Stage Summary Card */}
      <section className="px-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-pink-500 to-rose-400 rounded-[2rem] p-6 text-white shadow-xl shadow-pink-100"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-pink-100 text-sm font-medium uppercase tracking-wider">
                {profile.stage === UserStage.PREGNANT ? 'Pregnancy Week' : 'Baby Age'}
              </span>
              <h2 className="text-4xl font-bold">{profile.stageValue}</h2>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
              <Sparkles size={24} />
            </div>
          </div>
          <p className="text-lg font-medium mb-2">{stageUpdate?.title}</p>
          <p className="text-pink-50 text-sm line-clamp-2 opacity-90">
            {stageUpdate?.description}
          </p>
          <button className="mt-4 flex items-center gap-2 text-sm font-bold bg-white text-pink-600 px-4 py-2 rounded-full">
            View Details <ChevronRight size={16} />
          </button>
        </motion.div>
      </section>

      {/* Quick Tips */}
      <section className="px-4">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Sparkles className="text-amber-400" size={20} /> Quick Tips
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {stageUpdate?.tips.slice(0, 2).map((tip, i) => (
            <div key={i} className="bg-white p-4 rounded-3xl border border-stone-100 shadow-sm">
              <p className="text-sm text-stone-700 font-medium">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Nutrition Tip */}
      <section className="px-4">
        <div className="bg-orange-50 rounded-[2rem] p-6 border border-orange-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-orange-500 p-2 rounded-xl text-white">
              <Utensils size={20} />
            </div>
            <h3 className="text-lg font-bold text-orange-900">Daily Nutrition</h3>
          </div>
          <h4 className="font-bold text-orange-800 mb-1">{dailyNutrition.title}</h4>
          <p className="text-orange-700 text-sm mb-3">{dailyNutrition.content}</p>
          <div className="bg-white/50 p-3 rounded-xl border border-orange-200">
            <p className="text-xs font-bold text-orange-900 uppercase mb-1">Try this:</p>
            <p className="text-sm text-orange-800 italic">{dailyNutrition.mealSuggestion}</p>
          </div>
        </div>
      </section>

      {/* Community Preview */}
      <section className="px-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold">Community</h3>
          <button className="text-pink-600 text-sm font-bold">See All</button>
        </div>
        <div className="bg-white p-5 rounded-[2rem] border border-stone-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold">
              {latestPost.author[0]}
            </div>
            <div>
              <p className="font-bold text-sm">{latestPost.author}</p>
              <p className="text-xs text-stone-400">{latestPost.timestamp}</p>
            </div>
          </div>
          <p className="text-stone-700 text-sm line-clamp-2 mb-4">
            {latestPost.content}
          </p>
          <div className="flex items-center gap-4 text-stone-400 text-xs">
            <span className="flex items-center gap-1"><Heart size={14} /> {latestPost.likes}</span>
            <span className="flex items-center gap-1"><MessageSquare size={14} /> {latestPost.comments.length}</span>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <footer className="px-6 py-4 text-center">
        <p className="text-[10px] text-stone-400 leading-relaxed">
          HERAXIS provides health guidance and support. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician.
        </p>
      </footer>
    </div>
  );
};
