import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Brain, Sparkles, ShieldCheck, ChevronRight, X, AlertCircle, CheckCircle2, Activity, MessageSquare, Send, UserCircle, Copy, Check, Phone, MessageCircle, Mail, MapPin } from 'lucide-react';
import { POSTPARTUM_RECOVERY, POSTPARTUM_MENTAL_HEALTH, PELVIC_FLOOR_EXERCISES } from '../mockData';
import { PostpartumRecovery, Comment, UserStage } from '../types';
import { useUser } from '../UserContext';
import { HospitalListModal } from './HospitalListModal';

export const SupportScreen: React.FC = () => {
  const { profile, updateProfile } = useUser();
  const [activeView, setActiveView] = useState<'hub' | 'recovery' | 'mental-health' | 'doctor' | 'hospital' | 'doula' | 'pelvic'>('hub');
  const [selectedRecovery, setSelectedRecovery] = useState<PostpartumRecovery | null>(null);
  const [showPeerModal, setShowPeerModal] = useState(false);
  const [showDoctorActions, setShowDoctorActions] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [isEditingDoctor, setIsEditingDoctor] = useState(false);
  const [emergencyNote, setEmergencyNote] = useState('');
  const [doctorForm, setDoctorForm] = useState({
    name: profile.doctorContact?.name || '',
    hospital: profile.doctorContact?.hospital || '',
    phone: profile.doctorContact?.phone || '',
    whatsapp: profile.doctorContact?.whatsapp || '',
    email: profile.doctorContact?.email || '',
    specialty: profile.doctorContact?.specialty || '',
    notes: profile.doctorContact?.notes || ''
  });
  const [copied, setCopied] = useState(false);
  const [modalColor, setModalColor] = useState<'teal' | 'indigo' | 'amber' | 'rose'>('teal');
  const [showHospitalModal, setShowHospitalModal] = useState(false);
  const [showDoulaModal, setShowDoulaModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'hospitals' | 'doulas'>('hospitals');

  const hubCards = [
    { id: 'recovery', title: 'Postpartum Recovery', icon: Heart, color: 'teal', description: 'Physical healing guides' },
    { id: 'mental-health', title: 'Postpartum Mental Health', icon: Brain, color: 'indigo', description: 'Emotional well-being' },
    { id: 'doctor', title: 'Contact My Doctor', icon: UserCircle, color: 'rose', description: 'Quick medical access' },
    { id: 'hospital', title: 'Find Nearest Hospital', icon: MapPin, color: 'pink', description: 'Emergency & maternal care' },
    { id: 'doula', title: 'Ask a Doula', icon: MessageCircle, color: 'stone', description: 'Professional support' },
    { id: 'pelvic', title: 'Pelvic Floor Exercises', icon: Sparkles, color: 'amber', description: 'Core strengthening' },
  ];

  const handleSaveDoctor = () => {
    updateProfile({ doctorContact: doctorForm });
    setIsEditingDoctor(false);
  };

  const handleEmergencyAlert = () => {
    const doctor = profile.doctorContact;
    if (!doctor) return;

    const message = `Hello Dr. ${doctor.name}, this is ${profile.name}. I need urgent support regarding my ${profile.stage === UserStage.PREGNANT ? 'pregnancy' : 'postpartum'} condition. Please reach me as soon as possible.${emergencyNote ? ` My current concern is: ${emergencyNote}` : ''}`;
    
    if (doctor.phone) {
      window.location.href = `sms:${doctor.phone}?body=${encodeURIComponent(message)}`;
    } else if (doctor.whatsapp) {
      window.open(`https://wa.me/${doctor.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    } else if (doctor.email) {
      window.location.href = `mailto:${doctor.email}?subject=URGENT: Support Needed&body=${encodeURIComponent(message)}`;
    }
    
    setShowEmergencyModal(false);
    setShowDoctorActions(false);
  };
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
    },
    pink: {
      bg: 'bg-pink-50',
      border: 'border-pink-100',
      text: 'text-pink-900',
      accent: 'bg-pink-500',
      button: 'bg-pink-600',
      hover: 'hover:bg-pink-50',
      icon: 'text-pink-500',
      modalBg: 'bg-pink-50/50',
      modalBorder: 'border-pink-100/50'
    },
    stone: {
      bg: 'bg-stone-50',
      border: 'border-stone-200',
      text: 'text-stone-900',
      accent: 'bg-stone-500',
      button: 'bg-stone-600',
      hover: 'hover:bg-stone-50',
      icon: 'text-stone-500',
      modalBg: 'bg-stone-50/50',
      modalBorder: 'border-stone-100/50'
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-24">
      <header className="pt-8 px-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Support Hub</h1>
          <p className="text-stone-500">Care for your mind and body</p>
        </div>
        {activeView !== 'hub' && (
          <button 
            onClick={() => setActiveView('hub')}
            className="p-2 bg-stone-100 rounded-full text-stone-500 hover:bg-stone-200 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </header>

      <AnimatePresence mode="wait">
        {activeView === 'hub' ? (
          <motion.section 
            key="hub"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-4 grid grid-cols-1 gap-4"
          >
            {hubCards.map((card) => (
              <button
                key={card.id}
                onClick={() => setActiveView(card.id as any)}
                className={`bg-white p-5 rounded-[2rem] border border-stone-100 shadow-sm flex items-center gap-4 text-left hover:border-pink-200 transition-all group`}
              >
                <div className={`${colorClasses[card.color as keyof typeof colorClasses].bg} p-4 rounded-2xl ${colorClasses[card.color as keyof typeof colorClasses].icon} group-hover:scale-110 transition-transform`}>
                  <card.icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-stone-900">{card.title}</h3>
                  <p className="text-xs text-stone-400">{card.description}</p>
                </div>
                <ChevronRight size={20} className="text-stone-300 group-hover:text-pink-400 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </motion.section>
        ) : (
          <motion.div
            key={activeView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {activeView === 'recovery' && (
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
            )}

            {activeView === 'mental-health' && (
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
            )}

            {activeView === 'doctor' && (
              <section className="px-4">
                <div className="bg-rose-50 rounded-[2rem] p-6 border border-rose-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-rose-500 p-2 rounded-xl text-white">
                        <UserCircle size={20} />
                      </div>
                      <h2 className="text-xl font-bold text-rose-900">Contact My Doctor</h2>
                    </div>
                    {profile.doctorContact && (
                      <button 
                        onClick={() => setIsEditingDoctor(true)}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors"
                      >
                        Edit Info
                      </button>
                    )}
                  </div>

                  {!profile.doctorContact || isEditingDoctor ? (
                    <div className="space-y-4">
                      <p className="text-rose-800 text-sm leading-relaxed">
                        {isEditingDoctor ? 'Update your doctor\'s contact details below.' : 'Add your doctor\'s information so you can reach them quickly in case of concerns or emergencies.'}
                      </p>
                      
                      <div className="space-y-3 bg-white/50 p-4 rounded-2xl border border-rose-100">
                        <div className="grid grid-cols-1 gap-3">
                          <input 
                            type="text"
                            placeholder="Doctor's Name"
                            value={doctorForm.name}
                            onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                            className="w-full bg-white border border-rose-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-rose-200"
                          />
                          <input 
                            type="text"
                            placeholder="Hospital/Clinic Name"
                            value={doctorForm.hospital}
                            onChange={(e) => setDoctorForm({ ...doctorForm, hospital: e.target.value })}
                            className="w-full bg-white border border-rose-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-rose-200"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input 
                              type="tel"
                              placeholder="Phone Number"
                              value={doctorForm.phone}
                              onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })}
                              className="w-full bg-white border border-rose-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-rose-200"
                            />
                            <input 
                              type="tel"
                              placeholder="WhatsApp (Optional)"
                              value={doctorForm.whatsapp}
                              onChange={(e) => setDoctorForm({ ...doctorForm, whatsapp: e.target.value })}
                              className="w-full bg-white border border-rose-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-rose-200"
                            />
                          </div>
                          <input 
                            type="email"
                            placeholder="Email Address (Optional)"
                            value={doctorForm.email}
                            onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                            className="w-full bg-white border border-rose-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-rose-200"
                          />
                          <input 
                            type="text"
                            placeholder="Specialty (e.g. OB/GYN)"
                            value={doctorForm.specialty}
                            onChange={(e) => setDoctorForm({ ...doctorForm, specialty: e.target.value })}
                            className="w-full bg-white border border-rose-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-rose-200"
                          />
                        </div>
                        <button 
                          onClick={handleSaveDoctor}
                          disabled={!doctorForm.name || !doctorForm.hospital || !doctorForm.phone}
                          className="w-full bg-rose-600 text-white py-4 rounded-2xl font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isEditingDoctor ? 'Save Changes' : 'Save Doctor Info'}
                        </button>
                        {isEditingDoctor && (
                          <button 
                            onClick={() => setIsEditingDoctor(false)}
                            className="w-full text-stone-400 text-xs font-bold py-2"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600">
                          <UserCircle size={28} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-stone-900">Dr. {profile.doctorContact.name}</h3>
                          <p className="text-xs text-stone-500">{profile.doctorContact.specialty || 'Doctor'} • {profile.doctorContact.hospital}</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => setShowDoctorActions(true)}
                        className="w-full bg-rose-600 text-white py-4 rounded-2xl font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-100 flex items-center justify-center gap-2"
                      >
                        <Phone size={18} /> Contact My Doctor
                      </button>
                    </div>
                  )}
                  
                  <p className="mt-4 text-[10px] text-rose-400 text-center italic">
                    In a life-threatening emergency, please call 911 immediately.
                  </p>
                </div>
              </section>
            )}

            {activeView === 'hospital' && (
              <section className="px-4">
                <div className="bg-stone-900 rounded-[2rem] p-6 text-white shadow-xl shadow-stone-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-pink-600 p-2 rounded-xl">
                      <MapPin size={20} />
                    </div>
                    <h2 className="text-xl font-bold">Find Nearest Hospital</h2>
                  </div>
                  <p className="text-stone-400 text-sm mb-6 leading-relaxed">
                    In case of an emergency or if you need immediate maternal care, locate the nearest hospital or clinic.
                  </p>
                  <HospitalListModal 
                    isOpen={true} 
                    onClose={() => setActiveView('hub')} 
                    inline={true}
                  />
                </div>
              </section>
            )}

            {activeView === 'doula' && (
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
            )}

            {activeView === 'pelvic' && (
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
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
        {/* Doctor Actions Panel */}
        {showDoctorActions && profile.doctorContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDoctorActions(false)}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-end justify-center sm:items-center p-4"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-stone-900">Contact Dr. {profile.doctorContact.name}</h3>
                  <p className="text-xs text-stone-400">{profile.doctorContact.hospital}</p>
                </div>
                <button onClick={() => setShowDoctorActions(false)} className="p-2 hover:bg-stone-100 rounded-full">
                  <X size={20} className="text-stone-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <a 
                  href={`tel:${profile.doctorContact.phone}`}
                  className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl hover:bg-stone-100 transition-colors"
                >
                  <div className="bg-green-100 p-2 rounded-xl text-green-600">
                    <Phone size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm">Call Doctor</p>
                    <p className="text-[10px] text-stone-400">{profile.doctorContact.phone}</p>
                  </div>
                </a>

                {profile.doctorContact.whatsapp && (
                  <a 
                    href={`https://wa.me/${profile.doctorContact.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl hover:bg-stone-100 transition-colors"
                  >
                    <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
                      <MessageCircle size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm">Send WhatsApp Message</p>
                      <p className="text-[10px] text-stone-400">Direct Message</p>
                    </div>
                  </a>
                )}

                <a 
                  href={`sms:${profile.doctorContact.phone}`}
                  className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl hover:bg-stone-100 transition-colors"
                >
                  <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                    <MessageSquare size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm">Send SMS</p>
                    <p className="text-[10px] text-stone-400">Quick Text</p>
                  </div>
                </a>

                {profile.doctorContact.email && (
                  <a 
                    href={`mailto:${profile.doctorContact.email}`}
                    className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl hover:bg-stone-100 transition-colors"
                  >
                    <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                      <Mail size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm">Send Email</p>
                      <p className="text-[10px] text-stone-400">{profile.doctorContact.email}</p>
                    </div>
                  </a>
                )}

                <button 
                  onClick={() => setShowEmergencyModal(true)}
                  className="flex items-center gap-4 p-4 bg-rose-50 rounded-2xl hover:bg-rose-100 transition-colors border border-rose-100"
                >
                  <div className="bg-rose-100 p-2 rounded-xl text-rose-600">
                    <AlertCircle size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm text-rose-700">Emergency Alert</p>
                    <p className="text-[10px] text-rose-500">Send pre-filled urgent message</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Emergency Alert Confirmation Modal */}
        {showEmergencyModal && profile.doctorContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center text-rose-600 mx-auto">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-stone-900">Emergency Alert</h3>
                <p className="text-sm text-stone-500">This will send an urgent message to Dr. {profile.doctorContact.name}.</p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">Add a note (Optional)</label>
                <textarea 
                  value={emergencyNote}
                  onChange={(e) => setEmergencyNote(e.target.value)}
                  placeholder="What is happening? (e.g. heavy bleeding, severe pain)"
                  className="w-full bg-stone-50 border border-stone-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-rose-200 transition-all h-24 resize-none"
                />
              </div>

              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3">
                <AlertCircle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-amber-800 leading-tight">
                  <strong>Important:</strong> If this is a life-threatening emergency, please call 911 or your local emergency services immediately.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowEmergencyModal(false)}
                  className="flex-1 py-4 rounded-2xl font-bold text-stone-500 bg-stone-100 hover:bg-stone-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleEmergencyAlert}
                  className="flex-1 py-4 rounded-2xl font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-lg shadow-rose-100"
                >
                  Send Alert
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
