import React, { useState } from 'react';
import { useUser } from '../UserContext';
import { PREGNANCY_UPDATES, BABY_UPDATES, NUTRITION_TIPS, FORUM_POSTS } from '../mockData';
import { UserStage, PregnancyUpdate, BabyUpdate } from '../types';
import { ChevronRight, Utensils, MessageSquare, Sparkles, Heart, X, CheckCircle2, AlertCircle, Info, Baby, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const HomeScreen: React.FC = () => {
  const { profile } = useUser();
  const [showDetails, setShowDetails] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<typeof FORUM_POSTS[0] | null>(null);
  
  // Find the most relevant update (exact match or closest previous)
  const stageUpdate = (() => {
    if (profile.stage === UserStage.PREGNANT) {
      // Find exact match or the latest one that is less than or equal to current week
      const exact = PREGNANCY_UPDATES.find(u => u.week === profile.stageValue);
      if (exact) return exact;
      
      // Fallback: find the latest update that has passed
      const passed = [...PREGNANCY_UPDATES]
        .filter(u => u.week <= profile.stageValue)
        .sort((a, b) => b.week - a.week)[0];
      
      // If none passed, return the first one available
      return passed || PREGNANCY_UPDATES[0];
    } else {
      // Same for baby updates
      const exact = BABY_UPDATES.find(u => u.month === profile.stageValue);
      if (exact) return exact;
      
      const passed = [...BABY_UPDATES]
        .filter(u => u.month <= profile.stageValue)
        .sort((a, b) => b.month - a.month)[0];
      
      return passed || BABY_UPDATES[0];
    }
  })() as PregnancyUpdate | BabyUpdate;

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
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-br from-pink-500 to-rose-400 rounded-[2rem] p-6 text-white shadow-xl shadow-pink-100 relative overflow-hidden"
        >
          {/* Decorative background circle */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          
          <div className="flex justify-between items-start mb-4 relative z-10">
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
          
          <div className="relative z-10">
            <p className="text-lg font-bold mb-2">{stageUpdate?.title}</p>
            <p className="text-pink-50 text-sm line-clamp-2 opacity-90 mb-4">
              {stageUpdate?.description}
            </p>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowDetails(true)}
                className="flex items-center gap-2 text-sm font-bold bg-white text-pink-600 px-5 py-2.5 rounded-full hover:bg-pink-50 transition-all shadow-md active:scale-95"
              >
                View Details <ChevronRight size={16} />
              </button>
              
              {profile.stage === UserStage.PREGNANT && stageUpdate && (stageUpdate as PregnancyUpdate).fruitSize && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-2 rounded-full border border-white/30">
                  <span className="text-lg">{(stageUpdate as PregnancyUpdate).fruitSize[profile.preferences.fruitTheme].emoji}</span>
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Size of a {(stageUpdate as PregnancyUpdate).fruitSize[profile.preferences.fruitTheme].name}</span>
                </div>
              )}

              {profile.stage === UserStage.NEW_MOM && stageUpdate && (stageUpdate as BabyUpdate).milestones && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-2 rounded-full border border-white/30">
                  <Sparkles size={14} className="text-pink-100" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">{(stageUpdate as BabyUpdate).milestones.length} Key Milestones</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetails && stageUpdate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetails(false)}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setShowDetails(false)} 
                className="absolute top-6 right-6 p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X size={24} className="text-stone-400" />
              </button>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="bg-pink-100 w-16 h-16 rounded-2xl flex items-center justify-center text-pink-600">
                    <Sparkles size={32} />
                  </div>
                  {profile.stage === UserStage.PREGNANT && stageUpdate && (stageUpdate as PregnancyUpdate).trimester && (
                    <div className="bg-stone-100 px-4 py-2 rounded-xl text-stone-600 font-bold text-xs uppercase tracking-wider">
                      Trimester {(stageUpdate as PregnancyUpdate).trimester}
                    </div>
                  )}
                </div>
                
                <div>
                  <span className="text-pink-500 font-bold uppercase tracking-widest text-xs">
                    {profile.stage === UserStage.PREGNANT ? `Week ${profile.stageValue}` : `${profile.stageValue} Month`}
                  </span>
                  <h2 className="text-3xl font-bold text-stone-900 mt-1">
                    {stageUpdate.title}
                  </h2>
                </div>

                <div className="space-y-6">
                  <p className="text-stone-600 leading-relaxed">
                    {stageUpdate.description}
                  </p>

                  {/* Pregnancy Specific: Fruit Size */}
                  {profile.stage === UserStage.PREGNANT && stageUpdate && (stageUpdate as PregnancyUpdate).fruitSize && (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-[2rem] border border-amber-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-3xl">
                          {(stageUpdate as PregnancyUpdate).fruitSize[profile.preferences.fruitTheme].emoji}
                        </div>
                        <div>
                          <h4 className="font-bold text-amber-900">Baby's Size</h4>
                          <p className="text-xs text-amber-700 font-medium">
                            Like a {(stageUpdate as PregnancyUpdate).fruitSize[profile.preferences.fruitTheme].name}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-amber-800 leading-relaxed italic">
                        "{(stageUpdate as PregnancyUpdate).fruitSize[profile.preferences.fruitTheme].reasoning}"
                      </p>
                    </div>
                  )}

                  {/* Development Detail */}
                  {profile.stage === UserStage.PREGNANT && stageUpdate && (stageUpdate as PregnancyUpdate).developmentDetail && (
                    <div className="space-y-3">
                      <h3 className="font-bold text-stone-900 flex items-center gap-2">
                        <Baby size={18} className="text-pink-500" />
                        Baby's Development
                      </h3>
                      <div className="bg-stone-50 p-5 rounded-3xl border border-stone-100">
                        <p className="text-sm text-stone-700 leading-relaxed">
                          {(stageUpdate as PregnancyUpdate).developmentDetail}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Body Changes */}
                  {profile.stage === UserStage.PREGNANT && stageUpdate && (stageUpdate as PregnancyUpdate).bodyChanges && (
                    <div className="space-y-3">
                      <h3 className="font-bold text-stone-900 flex items-center gap-2">
                        <Activity size={18} className="text-pink-500" />
                        Your Body
                      </h3>
                      <div className="bg-stone-50 p-5 rounded-3xl border border-stone-100">
                        <p className="text-sm text-stone-700 leading-relaxed">
                          {(stageUpdate as PregnancyUpdate).bodyChanges}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Baby Milestones */}
                  {profile.stage === UserStage.NEW_MOM && stageUpdate && (stageUpdate as BabyUpdate).milestones && (
                    <div className="space-y-3">
                      <h3 className="font-bold text-stone-900 flex items-center gap-2">
                        <Sparkles size={18} className="text-pink-500" />
                        Key Milestones
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        {(stageUpdate as BabyUpdate).milestones.map((milestone, i) => (
                          <div key={i} className="flex items-center gap-3 bg-stone-50 p-4 rounded-2xl">
                            <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 text-xs font-bold shrink-0">
                              {i + 1}
                            </div>
                            <p className="text-sm text-stone-700 font-medium">{milestone}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h3 className="font-bold text-stone-900 flex items-center gap-2">
                      <Info size={18} className="text-pink-500" />
                      What's Happening
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {stageUpdate.tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-3 bg-stone-50 p-4 rounded-2xl">
                          <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2 shrink-0" />
                          <p className="text-sm text-stone-700 leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3">
                    <AlertCircle size={18} className="text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-800 leading-relaxed">
                      <strong>Pro Tip:</strong> Remember to stay hydrated and listen to your body's signals today.
                    </p>
                  </div>

                  {/* Next Actions */}
                  {stageUpdate.nextActions && stageUpdate.nextActions.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-bold text-stone-900 flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-pink-500" />
                        Recommended Next Actions
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        {stageUpdate.nextActions.map((action, i) => (
                          <div key={i} className="flex items-center gap-3 bg-pink-50 p-4 rounded-2xl border border-pink-100">
                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-pink-600 shadow-sm shrink-0">
                              <ChevronRight size={14} />
                            </div>
                            <p className="text-sm text-pink-900 font-medium">{action}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => setShowDetails(false)}
                  className="w-full bg-pink-600 text-white py-4 rounded-2xl font-bold hover:bg-pink-700 transition-colors shadow-lg shadow-pink-100"
                >
                  Got it, thanks!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
        <motion.div 
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowNutritionModal(true)}
          className="bg-orange-50 rounded-[2rem] p-6 border border-orange-100 cursor-pointer hover:border-orange-200 transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-orange-500 p-2 rounded-xl text-white">
              <Utensils size={20} />
            </div>
            <h3 className="text-lg font-bold text-orange-900">Daily Nutrition</h3>
          </div>
          <h4 className="font-bold text-orange-800 mb-1">{dailyNutrition.title}</h4>
          <p className="text-orange-700 text-sm mb-3">{dailyNutrition.content}</p>
          <div className="bg-white/50 p-3 rounded-xl border border-orange-200 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-orange-900 uppercase mb-1">Try this:</p>
              <p className="text-sm text-orange-800 italic">{dailyNutrition.mealSuggestion}</p>
            </div>
            <ChevronRight size={20} className="text-orange-400" />
          </div>
        </motion.div>
      </section>

      {/* Recovery & Wellbeing (New Mom Only) */}
      {profile.stage === UserStage.NEW_MOM && (
        <section className="px-4">
          <motion.div 
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowRecoveryModal(true)}
            className="bg-indigo-50 rounded-[2rem] p-6 border border-indigo-100 cursor-pointer hover:border-indigo-200 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-indigo-500 p-2 rounded-xl text-white">
                <Heart size={20} />
              </div>
              <h3 className="text-lg font-bold text-indigo-900">Recovery & Wellbeing</h3>
            </div>
            <p className="text-indigo-700 text-sm mb-4">
              Focus on your healing journey. Check your recovery progress and mental wellbeing tips.
            </p>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              Check Progress <ChevronRight size={16} />
            </div>
          </motion.div>
        </section>
      )}

      {/* Community Preview */}
      <section className="px-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold">Community</h3>
          <button 
            onClick={() => setShowCommunityModal(true)}
            className="text-pink-600 text-sm font-bold hover:text-pink-700 transition-colors"
          >
            See All
          </button>
        </div>
        <motion.div 
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedPost(latestPost)}
          className="bg-white p-5 rounded-[2rem] border border-stone-100 shadow-sm cursor-pointer hover:border-pink-200 transition-colors"
        >
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
        </motion.div>
      </section>

      {/* Community Modal */}
      <AnimatePresence>
        {showCommunityModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCommunityModal(false)}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-2xl rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              <button 
                onClick={() => setShowCommunityModal(false)} 
                className="absolute top-6 right-6 p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X size={24} className="text-stone-400" />
              </button>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-stone-900">Community Discussions</h2>
                <p className="text-stone-500 text-sm">Join the conversation with other mothers</p>
              </div>

              <div className="overflow-y-auto pr-2 space-y-4 pb-4">
                {FORUM_POSTS.map((post) => (
                  <div 
                    key={post.id}
                    onClick={() => {
                      setSelectedPost(post);
                      setShowCommunityModal(false);
                    }}
                    className="bg-stone-50 p-5 rounded-3xl border border-stone-100 cursor-pointer hover:border-pink-200 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-xs">
                        {post.author[0]}
                      </div>
                      <div>
                        <p className="font-bold text-xs">{post.author}</p>
                        <p className="text-[10px] text-stone-400">{post.timestamp}</p>
                      </div>
                    </div>
                    <p className="text-stone-700 text-sm line-clamp-2 mb-3">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 text-stone-400 text-[10px]">
                      <span className="flex items-center gap-1"><Heart size={12} /> {post.likes}</span>
                      <span className="flex items-center gap-1"><MessageSquare size={12} /> {post.comments.length}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPost(null)}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-2xl rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedPost(null)} 
                className="absolute top-6 right-6 p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X size={24} className="text-stone-400" />
              </button>

              <div className="overflow-y-auto pr-2 scrollbar-hide">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-lg">
                    {selectedPost.author[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-stone-900">{selectedPost.author}</p>
                    <p className="text-xs text-stone-400">{selectedPost.timestamp}</p>
                  </div>
                </div>

                <p className="text-stone-700 leading-relaxed mb-8 text-lg">
                  {selectedPost.content}
                </p>

                <div className="border-t border-stone-100 pt-6 space-y-6">
                  <h4 className="font-bold text-stone-800 flex items-center gap-2">
                    <MessageSquare size={18} className="text-pink-500" />
                    Comments ({selectedPost.comments.length})
                  </h4>

                  <div className="space-y-4">
                    {selectedPost.comments.map((comment) => (
                      <div key={comment.id} className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-sm text-stone-900">{comment.author}</span>
                          <span className="text-[10px] text-stone-400 uppercase tracking-wider">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-stone-600 leading-relaxed">{comment.content}</p>
                      </div>
                    ))}
                    {selectedPost.comments.length === 0 && (
                      <p className="text-center text-stone-400 text-sm py-4">No comments yet.</p>
                    )}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setSelectedPost(null)}
                className="mt-6 w-full bg-pink-600 text-white py-4 rounded-2xl font-bold hover:bg-pink-700 transition-colors shadow-lg shadow-pink-100"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nutrition Modal */}
      <AnimatePresence>
        {showNutritionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNutritionModal(false)}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setShowNutritionModal(false)} 
                className="absolute top-6 right-6 p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X size={24} className="text-stone-400" />
              </button>

              <div className="space-y-6">
                <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center text-orange-600">
                  <Utensils size={32} />
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold text-stone-900">Nutrition Deep Dive</h2>
                  <p className="text-stone-500 mt-1">{dailyNutrition.title}</p>
                </div>

                <div className="space-y-6">
                  <p className="text-stone-600 leading-relaxed">
                    {dailyNutrition.content}
                  </p>

                  <div className="space-y-3">
                    <h3 className="font-bold text-stone-900">Key Benefits</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {dailyNutrition.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-3 bg-orange-50 p-4 rounded-2xl">
                          <CheckCircle2 size={18} className="text-orange-500" />
                          <p className="text-sm text-orange-900 font-medium">{benefit}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-stone-900">Essential Nutrients</h3>
                    <div className="flex flex-wrap gap-2">
                      {dailyNutrition.nutrients.map((nutrient, i) => (
                        <span key={i} className="bg-stone-100 px-4 py-2 rounded-full text-stone-600 text-xs font-bold">
                          {nutrient}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100">
                    <h4 className="font-bold text-orange-900 mb-2 uppercase text-xs tracking-widest">Recommended Meal</h4>
                    <p className="text-orange-800 italic leading-relaxed">
                      "{dailyNutrition.mealSuggestion}"
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setShowNutritionModal(false)}
                  className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-100"
                >
                  Got it, thanks!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recovery Modal */}
      <AnimatePresence>
        {showRecoveryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRecoveryModal(false)}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setShowRecoveryModal(false)} 
                className="absolute top-6 right-6 p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X size={24} className="text-stone-400" />
              </button>

              <div className="space-y-6">
                <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center text-indigo-600">
                  <Heart size={32} />
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold text-stone-900">Recovery & Wellbeing</h2>
                  <p className="text-stone-500 mt-1">Your healing journey matters</p>
                </div>

                <div className="space-y-6">
                  <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100">
                    <h4 className="font-bold text-indigo-900 mb-2">Physical Healing</h4>
                    <p className="text-sm text-indigo-800 leading-relaxed">
                      Your body is doing amazing work. Focus on gentle movement, hydration, and rest.
                    </p>
                  </div>

                  <div className="bg-rose-50 p-6 rounded-[2rem] border border-rose-100">
                    <h4 className="font-bold text-rose-900 mb-2">Mental Wellbeing</h4>
                    <p className="text-sm text-rose-800 leading-relaxed">
                      It's normal to feel a range of emotions. Be kind to yourself and reach out if you need support.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-stone-900">Next Actions</h3>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center gap-3 bg-stone-50 p-4 rounded-2xl">
                        <CheckCircle2 size={18} className="text-indigo-500" />
                        <p className="text-sm text-stone-700 font-medium">Schedule 6-week postpartum checkup</p>
                      </div>
                      <div className="flex items-center gap-3 bg-stone-50 p-4 rounded-2xl">
                        <CheckCircle2 size={18} className="text-indigo-500" />
                        <p className="text-sm text-stone-700 font-medium">Practice 5 mins of deep breathing</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setShowRecoveryModal(false)}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disclaimer */}
      <footer className="px-6 py-4 text-center">
        <p className="text-[10px] text-stone-400 leading-relaxed">
          HERAXIS provides health guidance and support. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician.
        </p>
      </footer>
    </div>
  );
};
