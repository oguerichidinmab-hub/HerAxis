import React, { useState } from 'react';
import { useUser } from '../UserContext';
import { PREGNANCY_UPDATES, BABY_UPDATES } from '../mockData';
import { UserStage } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Info, CheckCircle2, ChevronRight, X, Sparkles, Baby, Star, Lightbulb } from 'lucide-react';

export const BabyTrackerScreen: React.FC = () => {
  const { profile, updateProfile } = useUser();
  const isPregnant = profile.stage === UserStage.PREGNANT;
  
  // Pregnancy State
  const [showFruitDetails, setShowFruitDetails] = useState(false);
  const [showSizeReasoning, setShowSizeReasoning] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [selectedTrimester, setSelectedTrimester] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    { id: 1, author: 'Mama Sarah', text: 'Week 24 is so exciting! I can finally feel the kicks clearly.', time: '1h ago' },
    { id: 2, author: 'NewMom_Joy', text: 'The papaya comparison is so cute! My baby is growing so fast.', time: '30m ago' }
  ]);

  const currentVal = profile.stageValue;
  const pregnancyUpdate = PREGNANCY_UPDATES.find(u => u.week === currentVal) || PREGNANCY_UPDATES[0];
  const babyUpdate = BABY_UPDATES.find(u => u.month === currentVal) || BABY_UPDATES[0];
  
  const fruitTheme = profile.preferences.fruitTheme || 'standard';
  const currentFruit = pregnancyUpdate.fruitSize[fruitTheme];

  const trimesterInfo = [
    {
      t: 1,
      range: "Weeks 1-12",
      title: "Foundation & Formation",
      description: "This is the most critical period for your baby's development. All major organs and body systems begin to form. You might experience morning sickness and fatigue as your body adjusts to the pregnancy.",
      focus: ["Prenatal vitamins", "Hydration", "Rest", "First ultrasound"]
    },
    {
      t: 2,
      range: "Weeks 13-26",
      title: "Growth & Movement",
      description: "Often called the 'honeymoon phase', you'll likely feel more energetic. Your baby is growing rapidly, and you'll start to feel those first magical flutters and kicks. It's time for the anatomy scan!",
      focus: ["Healthy eating", "Gentle exercise", "Nursery planning", "Anatomy scan"]
    },
    {
      t: 3,
      range: "Weeks 27-40",
      title: "Preparation & Final Stretch",
      description: "Your baby is gaining weight and getting ready for the big day. You might feel more pressure as they drop into position. Focus on resting and preparing your mind and home for your new arrival.",
      focus: ["Hospital bag", "Birth plan", "Breathing exercises", "Frequent rest"]
    }
  ];

  const renderPregnancyTracker = () => (
    <div className="space-y-6">
      {/* Trimester Progress */}
      <section className="px-4">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-stone-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-stone-800">Trimester {pregnancyUpdate.trimester}</h3>
            <span className="text-pink-600 font-bold text-sm">Week {currentVal}</span>
          </div>
          <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentVal / 40) * 100}%` }}
              className="h-full bg-pink-500 rounded-full"
            />
          </div>
          <p className="text-xs text-stone-400 mt-2 text-center">
            {40 - currentVal} weeks to go until your due date
          </p>
        </div>
      </section>

      {/* Baby Size Visual */}
      <section className="px-4 relative">
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowFruitDetails(true)}
          className="w-full bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm flex items-center justify-between group text-left cursor-pointer"
          role="button"
          tabIndex={0}
        >
          <div>
            <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-1">Baby's Size</p>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-stone-800">Like a {currentFruit.name}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSizeReasoning(true);
                }}
                className="p-1 hover:bg-stone-100 rounded-full text-stone-400 transition-colors"
              >
                <Info size={16} />
              </button>
            </div>
            <p className="text-sm text-stone-500">Tap to see details</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-5xl group-hover:scale-110 transition-transform">
              {currentFruit.emoji}
            </div>
          </div>
        </motion.div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setShowThemeSelector(true);
          }}
          className="absolute top-4 right-8 p-2 bg-pink-50 text-pink-600 rounded-full shadow-sm hover:bg-pink-100 transition-colors"
        >
          <Sparkles size={16} />
        </button>
      </section>

      {/* Weekly Update */}
      <section className="px-4">
        <div className="bg-pink-50 rounded-[2rem] p-6 border border-pink-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-pink-500 p-2 rounded-xl text-white">
              <Heart size={20} />
            </div>
            <h2 className="text-xl font-bold text-pink-900">{pregnancyUpdate.title}</h2>
          </div>
          <p className="text-pink-800 mb-6 leading-relaxed">
            {pregnancyUpdate.description}
          </p>

          <div className="space-y-4">
            <div className="bg-white/60 p-4 rounded-2xl">
              <h4 className="flex items-center gap-2 font-bold text-pink-900 mb-2">
                <Info size={16} /> Body Changes
              </h4>
              <p className="text-sm text-pink-800">{pregnancyUpdate.bodyChanges}</p>
            </div>

            <div>
              <h4 className="font-bold text-pink-900 mb-3">Weekly Tips</h4>
              <div className="space-y-2">
                {pregnancyUpdate.tips.map((tip, i) => (
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
        <h3 className="text-lg font-bold mb-3 text-stone-800">Trimester Guide</h3>
        <div className="space-y-3">
          {trimesterInfo.map((info) => (
            <motion.button
              whileTap={{ scale: 0.98 }}
              key={info.t}
              onClick={() => setSelectedTrimester(info.t)}
              className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${
                pregnancyUpdate.trimester === info.t 
                  ? 'bg-pink-600 border-pink-600 text-white shadow-lg shadow-pink-100' 
                  : 'bg-white border-stone-100 text-stone-700 hover:border-stone-200'
              }`}
            >
              <div className="text-left">
                <p className="font-bold">Trimester {info.t}</p>
                <p className={`text-xs ${pregnancyUpdate.trimester === info.t ? 'text-pink-100' : 'text-stone-400'}`}>
                  {info.range}
                </p>
              </div>
              <ChevronRight size={20} />
            </motion.button>
          ))}
        </div>
      </section>

      {/* Weekly Group Comments */}
      <section className="px-4">
        <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm">
          <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
            <Heart size={20} className="text-pink-500" /> Week {currentVal} Group Chat
          </h3>
          
          <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 scrollbar-hide">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm text-stone-900">{comment.author}</span>
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider">{comment.time}</span>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">{comment.text}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-300 transition-colors"
            />
            <button
              onClick={() => {
                if (newComment.trim()) {
                  setComments([...comments, {
                    id: Date.now(),
                    author: profile.name || 'Anonymous',
                    text: newComment,
                    time: 'Just now'
                  }]);
                  setNewComment('');
                }
              }}
              className="bg-pink-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-pink-700 transition-colors"
            >
              Post
            </button>
          </div>
        </div>
      </section>
    </div>
  );

  const renderBabyTracker = () => (
    <div className="space-y-6">
      {/* Growth Tracker Summary */}
      <section className="px-4">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-400 rounded-[2rem] p-6 text-white shadow-xl shadow-blue-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-blue-100 text-sm font-medium uppercase tracking-wider">Baby's Age</span>
              <h2 className="text-4xl font-bold">{currentVal} Month{currentVal > 1 ? 's' : ''}</h2>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
              <Baby size={24} />
            </div>
          </div>
          <p className="text-lg font-medium mb-2">{babyUpdate.title}</p>
          <p className="text-blue-50 text-sm opacity-90">{babyUpdate.description}</p>
        </div>
      </section>

      {/* Milestones */}
      <section className="px-4">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-stone-800">
          <Star className="text-amber-400" size={20} /> Key Milestones
        </h3>
        <div className="space-y-3">
          {babyUpdate.milestones.map((milestone, i) => (
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
            {babyUpdate.tips.map((tip, i) => (
              <div key={i} className="bg-white/60 p-4 rounded-xl border border-amber-100">
                <p className="text-sm text-amber-900 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="px-4">
        <h3 className="text-lg font-bold mb-3 text-stone-800">Resources</h3>
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

  return (
    <div className="space-y-6 pb-24">
      <header className="pt-8 px-4">
        <h1 className="text-3xl font-bold text-stone-900">Baby Growth Tracker</h1>
        <p className="text-stone-500">
          {isPregnant ? 'Tracking your baby in the womb' : 'Tracking your baby\'s development'}
        </p>
      </header>

      {isPregnant ? renderPregnancyTracker() : renderBabyTracker()}

      {/* Modals for Pregnancy Tracker */}
      <AnimatePresence>
        {showSizeReasoning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSizeReasoning(false)}
            className="fixed inset-0 z-[130] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => setShowSizeReasoning(false)} 
                className="absolute top-6 right-6 p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X size={20} className="text-stone-400" />
              </button>
              
              <div className="space-y-6">
                <div className="bg-pink-50 w-16 h-16 rounded-2xl flex items-center justify-center text-pink-600">
                  <Info size={32} />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-stone-900">Why a {currentFruit?.name}?</h2>
                  <p className="text-pink-600 font-bold uppercase tracking-widest text-xs mt-1">
                    Size Comparison Logic
                  </p>
                </div>

                <div className="bg-stone-50 p-5 rounded-3xl border border-stone-100 italic text-sm text-stone-600 leading-relaxed">
                  "{currentFruit?.reasoning}"
                </div>

                <button
                  onClick={() => setShowSizeReasoning(false)}
                  className="w-full bg-pink-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-pink-100 hover:bg-pink-700 transition-colors"
                >
                  I see!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {selectedTrimester !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTrimester(null)}
            className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => setSelectedTrimester(null)} 
                className="absolute top-6 right-6 p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X size={24} className="text-stone-400" />
              </button>

              {trimesterInfo.find(i => i.t === selectedTrimester) && (
                <div className="space-y-6">
                  <div className="bg-pink-50 w-16 h-16 rounded-2xl flex items-center justify-center text-pink-600">
                    <Info size={32} />
                  </div>
                  
                  <div>
                    <h2 className="text-3xl font-bold text-stone-900">
                      Trimester {selectedTrimester}
                    </h2>
                    <p className="text-pink-600 font-bold uppercase tracking-widest text-sm mt-1">
                      {trimesterInfo.find(i => i.t === selectedTrimester)?.range}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-stone-50 p-5 rounded-3xl border border-stone-100">
                      <h4 className="text-sm font-bold text-stone-900 mb-2">
                        {trimesterInfo.find(i => i.t === selectedTrimester)?.title}
                      </h4>
                      <p className="text-sm text-stone-600 leading-relaxed">
                        {trimesterInfo.find(i => i.t === selectedTrimester)?.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 px-1">Key Focus Areas</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {trimesterInfo.find(i => i.t === selectedTrimester)?.focus.map((item, i) => (
                          <div key={i} className="bg-pink-50/50 p-3 rounded-xl border border-pink-100/50 flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-pink-500" />
                            <span className="text-xs font-medium text-pink-900">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => setSelectedTrimester(null)}
                      className="w-full bg-pink-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-pink-100 hover:bg-pink-700 transition-colors"
                    >
                      Got it!
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

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
                  {currentFruit?.emoji}
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold text-stone-900 mb-2">
                    {currentFruit?.name}
                  </h2>
                  <p className="text-pink-600 font-bold uppercase tracking-widest text-sm">
                    Week {currentVal}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-stone-50 p-5 rounded-3xl border border-stone-100">
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Size Comparison</p>
                    <p className="text-stone-700 leading-relaxed italic">
                      "{currentFruit?.description}"
                    </p>
                  </div>

                  <div className="bg-pink-50/50 p-5 rounded-3xl border border-pink-100/50 text-left">
                    <p className="text-xs font-bold text-pink-400 uppercase tracking-wider mb-2">Development Update</p>
                    <p className="text-sm text-stone-700 leading-relaxed">
                      {pregnancyUpdate?.developmentDetail}
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

        {showThemeSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowThemeSelector(false)}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => setShowThemeSelector(false)} 
                className="absolute top-6 right-6 p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X size={20} className="text-stone-400" />
              </button>

              <div className="text-center space-y-6">
                <div className="bg-pink-50 w-16 h-16 rounded-2xl flex items-center justify-center text-pink-600 mx-auto">
                  <Sparkles size={32} />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-stone-900">Fruit Theme</h2>
                  <p className="text-stone-500 text-sm mt-1">Choose how to visualize baby's size</p>
                </div>

                <div className="grid gap-3">
                  {[
                    { id: 'standard', label: 'Standard', icon: '🍎' },
                    { id: 'tropical', label: 'Tropical', icon: '🥭' },
                    { id: 'veggies', label: 'Veggies', icon: '🥦' }
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        updateProfile({ 
                          preferences: { ...profile.preferences, fruitTheme: theme.id as any } 
                        });
                        setShowThemeSelector(false);
                      }}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        fruitTheme === theme.id 
                          ? 'bg-pink-50 border-pink-200 text-pink-700 shadow-sm' 
                          : 'bg-white border-stone-100 text-stone-600 hover:border-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{theme.icon}</span>
                        <span className="font-bold">{theme.label}</span>
                      </div>
                      {fruitTheme === theme.id && <CheckCircle2 size={18} className="text-pink-500" />}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
