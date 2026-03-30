import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Brain, Sparkles, ShieldCheck, ChevronRight, X, AlertCircle, CheckCircle2, Activity, MessageSquare, Send, UserCircle, Copy, Check } from 'lucide-react';
import { POSTPARTUM_RECOVERY, POSTPARTUM_MENTAL_HEALTH, PELVIC_FLOOR_EXERCISES } from '../mockData';
import { PostpartumRecovery, Comment } from '../types';
import { useUser } from '../UserContext';

export const SupportScreen: React.FC = () => {
  const { profile } = useUser();
  const [selectedRecovery, setSelectedRecovery] = useState<PostpartumRecovery | null>(null);
  const [showDoulaModal, setShowDoulaModal] = useState(false);
  const [showPeerModal, setShowPeerModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [modalColor, setModalColor] = useState<'teal' | 'indigo' | 'amber' | 'rose'>('teal');
  const [mentalHealthComments, setMentalHealthComments] = useState<Record<string, Comment[]>>(() => {
    const initialComments: Record<string, Comment[]> = {};
    POSTPARTUM_MENTAL_HEALTH.forEach(item => {
      if (item.comments) {
        initialComments[item.id] = item.comments;
      }
    });
    return initialComments;
  });
  const [newComment, setNewComment] = useState('');

  const getIcon = (id: string) => {
    switch (id) {
      case 'physical': return ShieldCheck;
      case 'nutrition': return Heart;
      case 'csection': return ShieldCheck;
      case 'baby-blues': return Brain;
      case 'ppd': return Heart;
      case 'anxiety': return Activity;
      case 'kegels': return Sparkles;
      case 'breathing': return Activity;
      case 'core': return ShieldCheck;
      default: return ShieldCheck;
    }
  };

  const openModal = (item: PostpartumRecovery, color: 'teal' | 'indigo' | 'amber') => {
    setSelectedRecovery(item);
    setModalColor(color);
  };

  const handleAddComment = (id: string) => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: profile.name || 'Mama',
      content: newComment,
      timestamp: 'Just now'
    };

    setMentalHealthComments(prev => ({
      ...prev,
      [id]: [...(prev[id] || []), comment]
    }));
    setNewComment('');
  };

  const colorClasses = {
    teal: {
      bg: 'bg-teal-50',
      border: 'border-teal-100',
      text: 'text-teal-900',
      accent: 'bg-teal-500',
      button: 'bg-teal-600',
      hover: 'hover:bg-teal-50',
      icon: 'text-teal-500',
      modalBg: 'bg-teal-50/50',
      modalBorder: 'border-teal-100/50'
    },
    indigo: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
      text: 'text-indigo-900',
      accent: 'bg-indigo-500',
      button: 'bg-indigo-600',
      hover: 'hover:bg-indigo-50',
      icon: 'text-indigo-500',
      modalBg: 'bg-indigo-50/50',
      modalBorder: 'border-indigo-100/50'
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      text: 'text-amber-900',
      accent: 'bg-amber-500',
      button: 'bg-amber-600',
      hover: 'hover:bg-amber-50',
      icon: 'text-amber-500',
      modalBg: 'bg-amber-50/50',
      modalBorder: 'border-amber-100/50'
    },
    rose: {
      bg: 'bg-rose-50',
      border: 'border-rose-100',
      text: 'text-rose-900',
      accent: 'bg-rose-500',
      button: 'bg-rose-600',
      hover: 'hover:bg-rose-50',
      icon: 'text-rose-500',
      modalBg: 'bg-rose-50/50',
      modalBorder: 'border-rose-100/50'
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-24">
      <header className="pt-8 px-4">
        <h1 className="text-3xl font-bold text-stone-900">Support Hub</h1>
        <p className="text-stone-500">Care for your mind and body</p>
      </header>

      {/* Postpartum Recovery Section */}
      <section className="px-4">
        <div className={`${colorClasses.teal.bg} rounded-[2rem] p-6 border ${colorClasses.teal.border}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`${colorClasses.teal.accent} p-2 rounded-xl text-white`}>
              <Heart size={20} />
            </div>
            <h2 className={`text-xl font-bold ${colorClasses.teal.text}`}>Postpartum Recovery</h2>
          </div>
          <p className="text-teal-800 text-sm mb-6 leading-relaxed">
            Healing takes time. Be gentle with yourself as your body recovers from the incredible journey of childbirth.
          </p>
          
          <div className="grid grid-cols-1 gap-3">
            {POSTPARTUM_RECOVERY.map((item) => {
              const Icon = getIcon(item.id);
              return (
                <button 
                  key={item.id} 
                  onClick={() => openModal(item, 'teal')}
                  className={`bg-white p-4 rounded-2xl border ${colorClasses.teal.border} flex items-center justify-between ${colorClasses.teal.text} font-bold text-sm ${colorClasses.teal.hover} transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={colorClasses.teal.icon} />
                    {item.title}
                  </div>
                  <ChevronRight size={16} />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Postpartum Mental Health Section */}
      <section className="px-4">
        <div className={`${colorClasses.indigo.bg} rounded-[2rem] p-6 border ${colorClasses.indigo.border}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`${colorClasses.indigo.accent} p-2 rounded-xl text-white`}>
              <Brain size={20} />
            </div>
            <h2 className={`text-xl font-bold ${colorClasses.indigo.text}`}>Postpartum Mental Health</h2>
          </div>
          <p className="text-indigo-800 text-sm mb-6 leading-relaxed">
            Your emotional well-being is just as important as your physical health. You are not alone in this journey.
          </p>
          
          <div className="grid grid-cols-1 gap-3 mb-6">
            {POSTPARTUM_MENTAL_HEALTH.map((item) => {
              const Icon = getIcon(item.id);
              return (
                <button 
                  key={item.id} 
                  onClick={() => openModal(item, 'indigo')}
                  className={`bg-white p-4 rounded-2xl border ${colorClasses.indigo.border} flex items-center justify-between ${colorClasses.indigo.text} font-bold text-sm ${colorClasses.indigo.hover} transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={colorClasses.indigo.icon} />
                    {item.title}
                  </div>
                  <div className="flex items-center gap-2">
                    {mentalHealthComments[item.id] && (
                      <span className="flex items-center gap-1 text-[10px] text-indigo-400">
                        <MessageSquare size={12} /> {mentalHealthComments[item.id].length}
                      </span>
                    )}
                    <ChevronRight size={16} />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="space-y-3 pt-4 border-t border-indigo-100">
            <button 
              onClick={() => setShowPeerModal(true)}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
            >
              Talk to a Peer Counselor
            </button>
          </div>
        </div>
      </section>

      {/* Ask a Doula Section */}
      <section className="px-4">
        <div className="bg-stone-50 rounded-[2rem] p-6 border border-stone-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-stone-500 p-2 rounded-xl text-white">
              <UserCircle size={20} />
            </div>
            <h2 className="text-xl font-bold text-stone-900">Ask a Doula</h2>
          </div>
          <p className="text-stone-600 text-sm mb-6 leading-relaxed">
            Personalized guidance and emotional support from trained birth and postpartum professionals.
          </p>
          
          <button 
            onClick={() => setShowDoulaModal(true)}
            className="w-full bg-stone-800 text-white py-4 rounded-2xl font-bold hover:bg-stone-900 transition-colors shadow-lg shadow-stone-100"
          >
            Connect with a Doula
          </button>
        </div>
      </section>

      {/* Pelvic Floor Exercises Section */}
      <section className="px-4">
        <div className={`${colorClasses.amber.bg} rounded-[2rem] p-6 border ${colorClasses.amber.border}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`${colorClasses.amber.accent} p-2 rounded-xl text-white`}>
              <Sparkles size={20} />
            </div>
            <h2 className={`text-xl font-bold ${colorClasses.amber.text}`}>Pelvic Floor Exercises</h2>
          </div>
          <p className="text-amber-800 text-sm mb-6 leading-relaxed">
            Strengthening your core and pelvic floor helps with recovery and long-term wellness.
          </p>
          
          <div className="grid grid-cols-1 gap-3">
            {PELVIC_FLOOR_EXERCISES.map((item) => {
              const Icon = getIcon(item.id);
              return (
                <button 
                  key={item.id} 
                  onClick={() => openModal(item, 'amber')}
                  className={`bg-white p-4 rounded-2xl border ${colorClasses.amber.border} flex items-center justify-between ${colorClasses.amber.text} font-bold text-sm ${colorClasses.amber.hover} transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={colorClasses.amber.icon} />
                    {item.title}
                  </div>
                  <ChevronRight size={16} />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recovery Details Modal */}
      <AnimatePresence>
        {selectedRecovery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRecovery(null)}
            className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedRecovery(null)} 
                className="absolute top-6 right-6 p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X size={24} className="text-stone-400" />
              </button>

              <div className="space-y-6">
                <div className={`${colorClasses[modalColor].bg} w-16 h-16 rounded-2xl flex items-center justify-center ${colorClasses[modalColor].icon}`}>
                  {React.createElement(getIcon(selectedRecovery.id), { size: 32 })}
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold text-stone-900">
                    {selectedRecovery.title}
                  </h2>
                  <p className={`${colorClasses[modalColor].icon} font-bold uppercase tracking-widest text-xs mt-1`}>
                    Support Guide
                  </p>
                </div>

                <p className="text-sm text-stone-600 leading-relaxed">
                  {selectedRecovery.description}
                </p>

                <div className="space-y-4">
                  {selectedRecovery.selfCareExercises && (
                    <div>
                      <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 px-1">Self-Care Exercises</h4>
                      <div className="space-y-2">
                        {selectedRecovery.selfCareExercises.map((exercise, i) => (
                          <div key={i} className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 flex items-start gap-3">
                            <Sparkles size={16} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-indigo-900">{exercise}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 px-1">Key Tips</h4>
                    <div className="space-y-2">
                      {selectedRecovery.tips.map((tip, i) => (
                        <div key={i} className={`${colorClasses[modalColor].modalBg} p-3 rounded-xl border ${colorClasses[modalColor].modalBorder} flex items-start gap-3`}>
                          <CheckCircle2 size={16} className={`${colorClasses[modalColor].icon} mt-0.5 flex-shrink-0`} />
                          <span className={`text-sm ${colorClasses[modalColor].text}`}>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-rose-50 p-5 rounded-3xl border border-rose-100">
                    <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <AlertCircle size={14} /> When to Call a Doctor
                    </h4>
                    <ul className="space-y-2">
                      {selectedRecovery.warningSigns.map((sign, i) => (
                        <li key={i} className="text-xs text-rose-800 flex items-start gap-2">
                          <span className="w-1 h-1 bg-rose-400 rounded-full mt-1.5 flex-shrink-0" />
                          {sign}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Comment Section for Mental Health */}
                  {modalColor === 'indigo' && (
                    <div className="pt-4 border-t border-stone-100">
                      <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4 px-1 flex items-center gap-2">
                        <MessageSquare size={14} /> Community Support
                      </h4>
                      
                      <div className="space-y-3 mb-4">
                        {(mentalHealthComments[selectedRecovery.id] || []).map((comment) => (
                          <div key={comment.id} className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-xs text-stone-900">{comment.author}</span>
                              <span className="text-[10px] text-stone-400">{comment.timestamp}</span>
                            </div>
                            <p className="text-xs text-stone-600 leading-relaxed">{comment.content}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Share your support..."
                          className="flex-1 bg-stone-50 border border-stone-100 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-indigo-300 transition-colors"
                        />
                        <button
                          onClick={() => handleAddComment(selectedRecovery.id)}
                          className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors"
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setSelectedRecovery(null)}
                    className={`w-full ${colorClasses[modalColor].button} text-white py-4 rounded-2xl font-bold shadow-lg transition-colors`}
                  >
                    Got it!
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Doula Modal */}
        {showDoulaModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDoulaModal(false)}
            className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setShowDoulaModal(false)} 
                className="absolute top-6 right-6 p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X size={24} className="text-stone-400" />
              </button>

              <div className="space-y-6">
                <div className="bg-stone-100 w-16 h-16 rounded-2xl flex items-center justify-center text-stone-600">
                  <UserCircle size={32} />
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold text-stone-900">Ask a Doula</h2>
                  <p className="text-stone-500 font-bold uppercase tracking-widest text-xs mt-1">Professional Guidance</p>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-stone-600 leading-relaxed">
                    A doula is a trained professional who provides continuous physical, emotional, and informational support to mothers before, during, and shortly after childbirth.
                  </p>
                  
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 space-y-3">
                    <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">How they support you:</h4>
                    <ul className="space-y-2">
                      {['Emotional encouragement and reassurance', 'Guidance for teenage and new mothers', 'Postpartum recovery and newborn care advice', 'Physical comfort measures during labor'].map((item, i) => (
                        <li key={i} className="text-xs text-stone-600 flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-stone-400 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider px-1">Message Template</h4>
                    <div className="relative group">
                      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs text-stone-700 italic leading-relaxed pr-12">
                        "Hello, my name is {profile.name || '[Name]'}. I am looking for support and guidance during my pregnancy/postpartum journey. I would like to speak with a doula for advice and support. Please let me know how I can connect with you. Thank you."
                      </div>
                      <button 
                        onClick={() => handleCopy(`Hello, my name is ${profile.name || '[Name]'}. I am looking for support and guidance during my pregnancy/postpartum journey. I would like to speak with a doula for advice and support. Please let me know how I can connect with you. Thank you.`)}
                        className="absolute top-3 right-3 p-2 bg-white rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors shadow-sm"
                      >
                        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-stone-400" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Contact Information</h4>
                    <p className="text-xs text-blue-800">Email: support@heraxis-doulas.org</p>
                    <p className="text-xs text-blue-800">Phone: +1 (555) 012-3456</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowDoulaModal(false)}
                  className="w-full bg-stone-800 text-white py-4 rounded-2xl font-bold shadow-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Peer Counselor Modal */}
        {showPeerModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPeerModal(false)}
            className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setShowPeerModal(false)} 
                className="absolute top-6 right-6 p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X size={24} className="text-stone-400" />
              </button>

              <div className="space-y-6">
                <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center text-indigo-600">
                  <MessageSquare size={32} />
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold text-stone-900">Peer Counselor</h2>
                  <p className="text-indigo-500 font-bold uppercase tracking-widest text-xs mt-1">Shared Understanding</p>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Peer counselors are mothers who have been through similar journeys and are trained to provide empathetic, non-judgmental emotional support.
                  </p>
                  
                  <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 space-y-3">
                    <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Why speak to them?</h4>
                    <ul className="space-y-2">
                      {['Safe space to share feelings', 'Shared lived experiences', 'Practical tips from fellow mothers', 'Reduced feelings of isolation'].map((item, i) => (
                        <li key={i} className="text-xs text-indigo-600 flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                    <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Availability</h4>
                    <p className="text-xs text-amber-800">Available Mon-Fri, 9 AM - 8 PM</p>
                    <p className="text-[10px] text-amber-600 mt-1 italic">Current status: Online</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider px-1">Request Message</h4>
                    <div className="relative group">
                      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs text-stone-700 italic leading-relaxed pr-12">
                        "Hello, I would like to speak with a peer counselor for support. I have been feeling overwhelmed and would appreciate someone to talk to. Please let me know how I can connect. Thank you."
                      </div>
                      <button 
                        onClick={() => handleCopy(`Hello, I would like to speak with a peer counselor for support. I have been feeling overwhelmed and would appreciate someone to talk to. Please let me know how I can connect. Thank you.`)}
                        className="absolute top-3 right-3 p-2 bg-white rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors shadow-sm"
                      >
                        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-stone-400" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
                    <p className="text-[10px] text-rose-800 leading-tight">
                      <strong>Disclaimer:</strong> Peer counselors provide emotional support and shared understanding, but are not a replacement for emergency or medical care.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowPeerModal(false)}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg transition-colors"
                >
                  Request Support Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
