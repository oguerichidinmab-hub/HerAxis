import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Brain, Sparkles, ShieldCheck, ChevronRight, X, AlertCircle, CheckCircle2, Activity, MessageSquare, Send, UserCircle, Copy, Check, Phone, MessageCircle, Mail, MapPin, ArrowLeft } from 'lucide-react';
import { POSTPARTUM_RECOVERY, POSTPARTUM_MENTAL_HEALTH, PELVIC_FLOOR_EXERCISES } from '../mockData';
import { PostpartumRecovery, Comment, UserStage } from '../types';
import { useUser } from '../UserContext';
import { HospitalListModal } from './HospitalListModal';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrorHandler';

interface SupportScreenProps {
  onBack?: () => void;
}

export const SupportScreen: React.FC<SupportScreenProps> = ({ onBack }) => {
  const { profile, updateProfile, user } = useUser();
  const [activeView, setActiveView] = useState<'hub' | 'recovery' | 'mental-health' | 'doctor' | 'hospital' | 'doula' | 'pelvic'>('hub');
  const [selectedRecovery, setSelectedRecovery] = useState<PostpartumRecovery | null>(null);
  const [showPeerModal, setShowPeerModal] = useState(false);
  const [showDoctorActions, setShowDoctorActions] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showExpertModal, setShowExpertModal] = useState(false);
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
    { id: 'expert', title: 'Ask a Health Expert', icon: MessageCircle, color: 'teal', description: 'Talk to a Nurse or Doctor' },
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
  const [mentalHealthComments, setMentalHealthComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState('');

  // Fetch comments for all mental health items
  React.useEffect(() => {
    if (!user) return;
    
    const unsubscribes: (() => void)[] = [];

    POSTPARTUM_MENTAL_HEALTH.forEach(item => {
      const path = `recovery_comments/${item.id}/comments`;
      const q = query(collection(db, 'recovery_comments', item.id, 'comments'), orderBy('timestamp', 'asc'));
      const unsub = onSnapshot(q, (snap) => {
        const fetchedComments = snap.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            ...data,
            timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toLocaleString() : 'Just now'
          } as Comment;
        });
        setMentalHealthComments(prev => ({ ...prev, [item.id]: fetchedComments }));
      }, (err) => handleFirestoreError(err, OperationType.LIST, path));
      unsubscribes.push(unsub);
    });

    return () => unsubscribes.forEach(unsub => unsub());
  }, [user]);

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

  const handleAddComment = async (id: string) => {
    if (!newComment.trim() || !user) return;

    try {
      const path = `recovery_comments/${id}/comments`;
      await addDoc(collection(db, 'recovery_comments', id, 'comments'), {
        author: profile.name || 'Mama',
        authorId: user.uid,
        content: newComment,
        timestamp: serverTimestamp()
      });
      setNewComment('');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `recovery_comments/${id}/comments`);
    }
  };

  const colorClasses = {
    teal: {
      bg: 'bg-teal-50 dark:bg-teal-950/30',
      border: 'border-teal-100 dark:border-teal-900/50',
      text: 'text-teal-900 dark:text-teal-100',
      accent: 'bg-teal-500',
      button: 'bg-teal-600',
      hover: 'hover:bg-teal-50 dark:hover:bg-teal-900/40',
      icon: 'text-teal-500 dark:text-teal-400',
      modalBg: 'bg-teal-50/50 dark:bg-teal-900/20',
      modalBorder: 'border-teal-100/50 dark:border-teal-900/30'
    },
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/30',
      border: 'border-indigo-100 dark:border-indigo-900/50',
      text: 'text-indigo-900 dark:text-indigo-100',
      accent: 'bg-indigo-500',
      button: 'bg-indigo-600',
      hover: 'hover:bg-indigo-50 dark:hover:bg-indigo-900/40',
      icon: 'text-indigo-500 dark:text-indigo-400',
      modalBg: 'bg-indigo-50/50 dark:bg-indigo-900/20',
      modalBorder: 'border-indigo-100/50 dark:border-indigo-900/30'
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-100 dark:border-amber-900/50',
      text: 'text-amber-900 dark:text-amber-100',
      accent: 'bg-amber-500',
      button: 'bg-amber-600',
      hover: 'hover:bg-amber-50 dark:hover:bg-amber-900/40',
      icon: 'text-amber-500 dark:text-amber-400',
      modalBg: 'bg-amber-50/50 dark:bg-amber-900/20',
      modalBorder: 'border-amber-100/50 dark:border-amber-900/30'
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-950/30',
      border: 'border-rose-100 dark:border-rose-900/50',
      text: 'text-rose-900 dark:text-rose-100',
      accent: 'bg-rose-500',
      button: 'bg-rose-600',
      hover: 'hover:bg-rose-50 dark:hover:bg-rose-900/40',
      icon: 'text-rose-500 dark:text-rose-400',
      modalBg: 'bg-rose-50/50 dark:bg-rose-900/20',
      modalBorder: 'border-rose-100/50 dark:border-rose-900/30'
    },
    pink: {
      bg: 'bg-pink-50 dark:bg-pink-950/30',
      border: 'border-pink-100 dark:border-pink-900/50',
      text: 'text-pink-900 dark:text-pink-100',
      accent: 'bg-pink-500',
      button: 'bg-pink-600',
      hover: 'hover:bg-pink-50 dark:hover:bg-pink-900/40',
      icon: 'text-pink-500 dark:text-pink-400',
      modalBg: 'bg-pink-50/50 dark:bg-pink-900/20',
      modalBorder: 'border-pink-100/50 dark:border-pink-900/30'
    },
    stone: {
      bg: 'bg-stone-50 dark:bg-stone-800/50',
      border: 'border-stone-200 dark:border-stone-700',
      text: 'text-stone-900 dark:text-stone-100',
      accent: 'bg-stone-500',
      button: 'bg-stone-600',
      hover: 'hover:bg-stone-50 dark:hover:bg-stone-800/80',
      icon: 'text-stone-500 dark:text-stone-400',
      modalBg: 'bg-stone-50/50 dark:bg-stone-800/20',
      modalBorder: 'border-stone-100/50 dark:border-stone-700/30'
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-32">
      <header className="pt-20 px-6 flex items-center gap-5">
        {onBack && (
          <button 
            onClick={onBack}
            className="p-2.5 bg-white dark:bg-stone-800 shadow-sm border border-stone-100 dark:border-stone-700 rounded-full transition-all hover:scale-110 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-stone-600 dark:text-stone-300" />
          </button>
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-black text-stone-900 dark:text-white tracking-tight">Support Hub</h1>
          <p className="text-stone-500 dark:text-stone-400 font-medium">Care for your mind and body</p>
        </div>
        {activeView !== 'hub' && (
          <button 
            onClick={() => setActiveView('hub')}
            className="p-2.5 bg-stone-100 dark:bg-stone-800 rounded-full text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
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
            className="px-6 grid grid-cols-1 gap-5"
          >
            {/* Emergency Mode Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowEmergencyModal(true)}
              className="bg-red-600 p-6 rounded-[2.5rem] shadow-xl shadow-red-200/50 dark:shadow-none flex items-center gap-5 text-left hover:bg-red-700 transition-all group border border-red-500"
            >
              <div className="bg-white/20 p-4.5 rounded-2xl text-white group-hover:scale-110 transition-transform">
                <AlertCircle size={32} />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-white text-xl tracking-tight">Emergency Mode</h3>
                <p className="text-sm text-red-100 font-medium mt-1">What to do during labour & hospital info</p>
              </div>
              <ChevronRight size={22} className="text-red-200 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </motion.button>

            {hubCards.map((card) => (
              <motion.button
                whileTap={{ scale: 0.98 }}
                key={card.id}
                onClick={() => setActiveView(card.id as any)}
                className={`bg-white dark:bg-stone-900 p-6 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 shadow-xl shadow-stone-200/30 dark:shadow-none flex items-center gap-5 text-left hover:border-pink-200 dark:hover:border-pink-900 transition-all group`}
              >
                <div className={`${colorClasses[card.color as keyof typeof colorClasses].bg} p-4.5 rounded-2xl ${colorClasses[card.color as keyof typeof colorClasses].icon} group-hover:scale-110 transition-transform`}>
                  <card.icon size={26} />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-stone-900 dark:text-white text-lg tracking-tight">{card.title}</h3>
                  <p className="text-xs text-stone-400 dark:text-stone-500 font-medium">{card.description}</p>
                </div>
                <ChevronRight size={22} className="text-stone-300 dark:text-stone-700 group-hover:text-pink-400 group-hover:translate-x-1 transition-all" />
              </motion.button>
            ))}
          </motion.section>
        ) : (
          <motion.div
            key={activeView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {activeView === 'recovery' && (
              <section className="px-6">
                <div className={`${colorClasses.teal.bg} rounded-[3rem] p-8 border ${colorClasses.teal.border} shadow-xl shadow-teal-100/20 dark:shadow-none`}>
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`${colorClasses.teal.accent} p-3 rounded-2xl text-white shadow-lg shadow-teal-200 dark:shadow-none`}>
                      <Heart size={24} />
                    </div>
                    <h2 className={`text-2xl font-black tracking-tight ${colorClasses.teal.text}`}>Postpartum Recovery</h2>
                  </div>
                  <p className="text-teal-800 dark:text-teal-200 text-sm mb-8 leading-relaxed font-medium">
                    Healing takes time. Be gentle with yourself as your body recovers from the incredible journey of childbirth.
                  </p>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {POSTPARTUM_RECOVERY.map((item) => {
                      const Icon = getIcon(item.id);
                      return (
                        <motion.button 
                          whileTap={{ scale: 0.98 }}
                          key={item.id} 
                          onClick={() => openModal(item, 'teal')}
                          className={`bg-white dark:bg-stone-900/50 p-5 rounded-2xl border ${colorClasses.teal.border} flex items-center justify-between ${colorClasses.teal.text} font-black text-sm ${colorClasses.teal.hover} transition-all shadow-sm`}
                        >
                          <div className="flex items-center gap-4">
                            <Icon size={20} className={colorClasses.teal.icon} />
                            {item.title}
                          </div>
                          <ChevronRight size={18} />
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {activeView === 'mental-health' && (
              <section className="px-6">
                <div className={`${colorClasses.indigo.bg} rounded-[3rem] p-8 border ${colorClasses.indigo.border} shadow-xl shadow-indigo-100/20 dark:shadow-none`}>
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`${colorClasses.indigo.accent} p-3 rounded-2xl text-white shadow-lg shadow-indigo-200 dark:shadow-none`}>
                      <Brain size={24} />
                    </div>
                    <h2 className={`text-2xl font-black tracking-tight ${colorClasses.indigo.text}`}>Postpartum Mental Health</h2>
                  </div>
                  <p className="text-indigo-800 dark:text-indigo-200 text-sm mb-8 leading-relaxed font-medium">
                    Your emotional well-being is just as important as your physical health. You are not alone in this journey.
                  </p>
                  
                  <div className="grid grid-cols-1 gap-4 mb-8">
                    {POSTPARTUM_MENTAL_HEALTH.map((item) => {
                      const Icon = getIcon(item.id);
                      return (
                        <motion.button 
                          whileTap={{ scale: 0.98 }}
                          key={item.id} 
                          onClick={() => openModal(item, 'indigo')}
                          className={`bg-white dark:bg-stone-900/50 p-5 rounded-2xl border ${colorClasses.indigo.border} flex items-center justify-between ${colorClasses.indigo.text} font-black text-sm ${colorClasses.indigo.hover} transition-all shadow-sm`}
                        >
                          <div className="flex items-center gap-4">
                            <Icon size={20} className={colorClasses.indigo.icon} />
                            {item.title}
                          </div>
                          <div className="flex items-center gap-3">
                            {mentalHealthComments[item.id] && (
                              <span className="flex items-center gap-1.5 text-[10px] text-indigo-400 font-black uppercase tracking-widest">
                                <MessageSquare size={14} /> {mentalHealthComments[item.id].length}
                              </span>
                            )}
                            <ChevronRight size={18} />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="space-y-4 pt-6 border-t border-indigo-100 dark:border-indigo-900/50">
                    <motion.button 
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowPeerModal(true)}
                      className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none active:scale-95"
                    >
                      Talk to a Peer Counselor
                    </motion.button>
                  </div>
                </div>
              </section>
            )}

            {activeView === 'doctor' && (
              <section className="px-6">
                <div className="bg-rose-50 dark:bg-rose-950/30 rounded-[3rem] p-8 border border-rose-100 dark:border-rose-900/50 shadow-xl shadow-rose-100/20 dark:shadow-none">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-rose-500 p-3 rounded-2xl text-white shadow-lg shadow-rose-200 dark:shadow-none">
                        <UserCircle size={24} />
                      </div>
                      <h2 className="text-2xl font-black tracking-tight text-rose-900 dark:text-rose-100">Contact My Doctor</h2>
                    </div>
                    {profile.doctorContact && (
                      <button 
                        onClick={() => setIsEditingDoctor(true)}
                        className="text-[10px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 hover:text-rose-700 transition-colors"
                      >
                        Edit Info
                      </button>
                    )}
                  </div>

                  {!profile.doctorContact || isEditingDoctor ? (
                    <div className="space-y-6">
                      <p className="text-rose-800 dark:text-rose-200 text-sm leading-relaxed font-medium">
                        {isEditingDoctor ? 'Update your doctor\'s contact details below.' : 'Add your doctor\'s information so you can reach them quickly in case of concerns or emergencies.'}
                      </p>
                      
                      <div className="space-y-4 bg-white/50 dark:bg-stone-900/50 p-6 rounded-[2rem] border border-rose-100 dark:border-rose-900/30">
                        <div className="grid grid-cols-1 gap-4">
                          <input 
                            type="text"
                            placeholder="Doctor's Name"
                            value={doctorForm.name}
                            onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                            className="w-full bg-white dark:bg-stone-800 border border-rose-100 dark:border-rose-900/30 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900 transition-all text-stone-900 dark:text-white"
                          />
                          <input 
                            type="text"
                            placeholder="Hospital/Clinic Name"
                            value={doctorForm.hospital}
                            onChange={(e) => setDoctorForm({ ...doctorForm, hospital: e.target.value })}
                            className="w-full bg-white dark:bg-stone-800 border border-rose-100 dark:border-rose-900/30 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900 transition-all text-stone-900 dark:text-white"
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <input 
                              type="tel"
                              placeholder="Phone Number"
                              value={doctorForm.phone}
                              onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })}
                              className="w-full bg-white dark:bg-stone-800 border border-rose-100 dark:border-rose-900/30 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900 transition-all text-stone-900 dark:text-white"
                            />
                            <input 
                              type="tel"
                              placeholder="WhatsApp"
                              value={doctorForm.whatsapp}
                              onChange={(e) => setDoctorForm({ ...doctorForm, whatsapp: e.target.value })}
                              className="w-full bg-white dark:bg-stone-800 border border-rose-100 dark:border-rose-900/30 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900 transition-all text-stone-900 dark:text-white"
                            />
                          </div>
                          <input 
                            type="email"
                            placeholder="Email Address (Optional)"
                            value={doctorForm.email}
                            onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                            className="w-full bg-white dark:bg-stone-800 border border-rose-100 dark:border-rose-900/30 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900 transition-all text-stone-900 dark:text-white"
                          />
                          <input 
                            type="text"
                            placeholder="Specialty (e.g. OB/GYN)"
                            value={doctorForm.specialty}
                            onChange={(e) => setDoctorForm({ ...doctorForm, specialty: e.target.value })}
                            className="w-full bg-white dark:bg-stone-800 border border-rose-100 dark:border-rose-900/30 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900 transition-all text-stone-900 dark:text-white"
                          />
                        </div>
                        <motion.button 
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSaveDoctor}
                          disabled={!doctorForm.name || !doctorForm.hospital || !doctorForm.phone}
                          className="w-full bg-rose-600 text-white py-5 rounded-[2rem] font-black hover:bg-rose-700 transition-all shadow-xl shadow-rose-100 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                        >
                          {isEditingDoctor ? 'Save Changes' : 'Save Doctor Info'}
                        </motion.button>
                        {isEditingDoctor && (
                          <button 
                            onClick={() => setIsEditingDoctor(false)}
                            className="w-full text-stone-400 dark:text-stone-500 text-[10px] font-black uppercase tracking-widest py-2"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-white dark:bg-stone-900 p-6 rounded-[2.5rem] border border-rose-100 dark:border-rose-900/30 shadow-sm flex items-center gap-5">
                        <div className="w-14 h-14 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400">
                          <UserCircle size={32} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-black text-stone-900 dark:text-white text-lg tracking-tight">Dr. {profile.doctorContact.name}</h3>
                          <p className="text-xs text-stone-500 dark:text-stone-400 font-bold uppercase tracking-widest">{profile.doctorContact.specialty || 'Doctor'} • {profile.doctorContact.hospital}</p>
                        </div>
                      </div>

                      <motion.button 
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowDoctorActions(true)}
                        className="w-full bg-rose-600 text-white py-5 rounded-[2rem] font-black hover:bg-rose-700 transition-all shadow-xl shadow-rose-100 dark:shadow-none flex items-center justify-center gap-3 active:scale-95"
                      >
                        <Phone size={20} /> Contact My Doctor
                      </motion.button>
                    </div>
                  )}
                  
                  <p className="mt-6 text-[10px] text-rose-400 dark:text-rose-500 text-center italic font-bold tracking-wide">
                    In a life-threatening emergency, please call 911 immediately.
                  </p>
                </div>
              </section>
            )}

            {activeView === 'hospital' && (
              <section className="px-6">
                <div className="bg-stone-900 dark:bg-black rounded-[3rem] p-8 text-white shadow-2xl shadow-stone-200/20 dark:shadow-none border border-stone-800">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="bg-pink-600 p-3 rounded-2xl shadow-lg shadow-pink-900/50">
                      <MapPin size={24} />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight">Find Nearest Hospital</h2>
                  </div>
                  <p className="text-stone-400 text-sm mb-8 leading-relaxed font-medium">
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

            {activeView === 'expert' && (
              <section className="px-6">
                <div className="bg-teal-50 dark:bg-teal-950/30 rounded-[3rem] p-8 border border-teal-100 dark:border-teal-900/50 shadow-xl shadow-teal-100/20 dark:shadow-none">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="bg-teal-500 p-3 rounded-2xl text-white shadow-lg shadow-teal-200 dark:shadow-none">
                      <MessageCircle size={24} />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-teal-900 dark:text-teal-100">Ask a Health Expert</h2>
                  </div>
                  <p className="text-teal-800 dark:text-teal-200 text-sm mb-8 leading-relaxed font-medium">
                    Get reliable advice from certified nurses and gynecologists.
                  </p>
                  
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowExpertModal(true)}
                    className="w-full bg-teal-600 text-white py-5 rounded-[2rem] font-black hover:bg-teal-700 transition-all shadow-xl shadow-teal-100 dark:shadow-none active:scale-95"
                  >
                    Start Consultation
                  </motion.button>
                </div>
              </section>
            )}

            {activeView === 'doula' && (
              <section className="px-6">
                <div className="bg-stone-50 dark:bg-stone-900 rounded-[3rem] p-8 border border-stone-200 dark:border-stone-800 shadow-xl shadow-stone-200/20 dark:shadow-none">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="bg-stone-500 p-3 rounded-2xl text-white shadow-lg shadow-stone-200 dark:shadow-none">
                      <UserCircle size={24} />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-stone-900 dark:text-white">Ask a Doula</h2>
                  </div>
                  <p className="text-stone-600 dark:text-stone-400 text-sm mb-8 leading-relaxed font-medium">
                    Personalized guidance and emotional support from trained birth and postpartum professionals.
                  </p>
                  
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDoulaModal(true)}
                    className="w-full bg-stone-800 dark:bg-stone-700 text-white py-5 rounded-[2rem] font-black hover:bg-stone-900 dark:hover:bg-stone-600 transition-all shadow-xl shadow-stone-100 dark:shadow-none active:scale-95"
                  >
                    Connect with a Doula
                  </motion.button>
                </div>
              </section>
            )}

            {activeView === 'pelvic' && (
              <section className="px-6">
                <div className={`${colorClasses.amber.bg} rounded-[3rem] p-8 border ${colorClasses.amber.border} shadow-xl shadow-amber-100/20 dark:shadow-none`}>
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`${colorClasses.amber.accent} p-3 rounded-2xl text-white shadow-lg shadow-amber-200 dark:shadow-none`}>
                      <Sparkles size={24} />
                    </div>
                    <h2 className={`text-2xl font-black tracking-tight ${colorClasses.amber.text}`}>Pelvic Floor Exercises</h2>
                  </div>
                  <p className="text-amber-800 dark:text-amber-200 text-sm mb-8 leading-relaxed font-medium">
                    Strengthening your core and pelvic floor helps with recovery and long-term wellness.
                  </p>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {PELVIC_FLOOR_EXERCISES.map((item) => {
                      const Icon = getIcon(item.id);
                      return (
                        <motion.button 
                          whileTap={{ scale: 0.98 }}
                          key={item.id} 
                          onClick={() => openModal(item, 'amber')}
                          className={`bg-white dark:bg-stone-900/50 p-5 rounded-2xl border ${colorClasses.amber.border} flex items-center justify-between ${colorClasses.amber.text} font-black text-sm ${colorClasses.amber.hover} transition-all shadow-sm`}
                        >
                          <div className="flex items-center gap-4">
                            <Icon size={20} className={colorClasses.amber.icon} />
                            {item.title}
                          </div>
                          <ChevronRight size={18} />
                        </motion.button>
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
                          <div key={`exercise-${i}`} className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 flex items-start gap-3">
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
                        <div key={`tip-${i}`} className={`${colorClasses[modalColor].modalBg} p-3 rounded-xl border ${colorClasses[modalColor].modalBorder} flex items-start gap-3`}>
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
                        <li key={`sign-${i}`} className="text-xs text-rose-800 flex items-start gap-2">
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
                        <li key={`doula-support-${i}`} className="text-xs text-stone-600 flex items-start gap-2">
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

                <div className="space-y-6">
                  <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
                    Peer counselors are mothers who have been through similar journeys and are trained to provide empathetic, non-judgmental emotional support.
                  </p>
                  
                  <div className="bg-indigo-50 dark:bg-indigo-950/30 p-6 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-900/50 space-y-4">
                    <h4 className="text-[10px] font-black text-indigo-900 dark:text-white uppercase tracking-widest">Why speak to them?</h4>
                    <ul className="space-y-3">
                      {['Safe space to share feelings', 'Shared lived experiences', 'Practical tips from fellow mothers', 'Reduced feelings of isolation'].map((item, i) => (
                        <li key={`peer-support-${i}`} className="text-xs text-indigo-600 dark:text-indigo-400 flex items-start gap-3 font-medium">
                          <CheckCircle2 size={16} className="text-indigo-400 dark:text-indigo-600 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-[2.5rem] border border-amber-100 dark:border-amber-900/50">
                    <h4 className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-2">Availability</h4>
                    <p className="text-xs text-amber-800 dark:text-amber-200 font-bold">Available Mon-Fri, 9 AM - 8 PM</p>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-2 italic font-bold">Current status: Online</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest px-1">Request Message</h4>
                    <div className="relative group">
                      <div className="bg-stone-50 dark:bg-stone-800 p-5 rounded-[2rem] border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 italic leading-relaxed pr-14 font-medium">
                        "Hello, I would like to speak with a peer counselor for support. I have been feeling overwhelmed and would appreciate someone to talk to. Please let me know how I can connect. Thank you."
                      </div>
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleCopy(`Hello, I would like to speak with a peer counselor for support. I have been feeling overwhelmed and would appreciate someone to talk to. Please let me know how I can connect. Thank you.`)}
                        className="absolute top-4 right-4 p-2.5 bg-white dark:bg-stone-700 rounded-xl border border-stone-200 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-600 transition-all shadow-sm"
                      >
                        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-stone-400 dark:text-stone-500" />}
                      </motion.button>
                    </div>
                  </div>

                  <div className="bg-rose-50 dark:bg-rose-950/30 p-5 rounded-[2rem] border border-rose-100 dark:border-rose-900/50">
                    <p className="text-[10px] text-rose-800 dark:text-rose-200 leading-tight font-medium">
                      <strong className="font-black">Disclaimer:</strong> Peer counselors provide emotional support and shared understanding, but are not a replacement for emergency or medical care.
                    </p>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPeerModal(false)}
                  className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black shadow-xl transition-all active:scale-95"
                >
                  Request Support Now
                </motion.button>
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
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-end justify-center sm:items-center p-6"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-stone-900 w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] p-10 shadow-2xl space-y-8 border border-stone-100 dark:border-stone-800"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black text-stone-900 dark:text-white tracking-tight">Contact Dr. {profile.doctorContact.name}</h3>
                  <p className="text-xs text-stone-400 dark:text-stone-500 font-bold uppercase tracking-widest mt-1">{profile.doctorContact.hospital}</p>
                </div>
                <button 
                  onClick={() => setShowDoctorActions(false)} 
                  className="p-2.5 bg-stone-50 dark:bg-stone-800 rounded-full transition-all hover:scale-110 active:scale-95"
                >
                  <X size={20} className="text-stone-400 dark:text-stone-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <motion.a 
                  whileTap={{ scale: 0.98 }}
                  href={`tel:${profile.doctorContact.phone}`}
                  className="flex items-center gap-5 p-5 bg-stone-50 dark:bg-stone-800/50 rounded-[2rem] hover:bg-stone-100 dark:hover:bg-stone-800 transition-all border border-stone-100 dark:border-stone-700"
                >
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-2xl text-green-600 dark:text-green-400 shadow-sm">
                    <Phone size={22} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-sm text-stone-900 dark:text-white">Call Doctor</p>
                    <p className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-widest">{profile.doctorContact.phone}</p>
                  </div>
                </motion.a>

                {profile.doctorContact.whatsapp && (
                  <motion.a 
                    whileTap={{ scale: 0.98 }}
                    href={`https://wa.me/${profile.doctorContact.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-5 p-5 bg-stone-50 dark:bg-stone-800/50 rounded-[2rem] hover:bg-stone-100 dark:hover:bg-stone-800 transition-all border border-stone-100 dark:border-stone-700"
                  >
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-2xl text-emerald-600 dark:text-emerald-400 shadow-sm">
                      <MessageCircle size={22} />
                    </div>
                    <div className="text-left">
                      <p className="font-black text-sm text-stone-900 dark:text-white">Send WhatsApp Message</p>
                      <p className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-widest">Direct Message</p>
                    </div>
                  </motion.a>
                )}

                <motion.a 
                  whileTap={{ scale: 0.98 }}
                  href={`sms:${profile.doctorContact.phone}`}
                  className="flex items-center gap-5 p-5 bg-stone-50 dark:bg-stone-800/50 rounded-[2rem] hover:bg-stone-100 dark:hover:bg-stone-800 transition-all border border-stone-100 dark:border-stone-700"
                >
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-2xl text-blue-600 dark:text-blue-400 shadow-sm">
                    <MessageSquare size={22} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-sm text-stone-900 dark:text-white">Send SMS</p>
                    <p className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-widest">Quick Text</p>
                  </div>
                </motion.a>

                {profile.doctorContact.email && (
                  <motion.a 
                    whileTap={{ scale: 0.98 }}
                    href={`mailto:${profile.doctorContact.email}`}
                    className="flex items-center gap-5 p-5 bg-stone-50 dark:bg-stone-800/50 rounded-[2rem] hover:bg-stone-100 dark:hover:bg-stone-800 transition-all border border-stone-100 dark:border-stone-700"
                  >
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-2xl text-indigo-600 dark:text-indigo-400 shadow-sm">
                      <Mail size={22} />
                    </div>
                    <div className="text-left">
                      <p className="font-black text-sm text-stone-900 dark:text-white">Send Email</p>
                      <p className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-widest">{profile.doctorContact.email}</p>
                    </div>
                  </motion.a>
                )}

                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowEmergencyModal(true)}
                  className="flex items-center gap-5 p-5 bg-rose-50 dark:bg-rose-950/30 rounded-[2rem] hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-all border border-rose-100 dark:border-rose-900/50"
                >
                  <div className="bg-rose-100 dark:bg-rose-900/30 p-3 rounded-2xl text-rose-600 dark:text-rose-400 shadow-sm">
                    <AlertCircle size={22} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-sm text-rose-700 dark:text-rose-400">Emergency Alert</p>
                    <p className="text-[10px] text-rose-500 dark:text-rose-500 font-bold uppercase tracking-widest">Send pre-filled urgent message</p>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Expert Modal */}
        {showExpertModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowExpertModal(false)}
            className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-stone-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden border border-stone-100 dark:border-stone-800"
            >
              <button 
                onClick={() => setShowExpertModal(false)} 
                className="absolute top-6 right-6 p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors"
              >
                <X size={24} className="text-stone-400" />
              </button>

              <div className="space-y-6 text-center">
                <div className="bg-teal-100 dark:bg-teal-900/30 w-20 h-20 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-400 mx-auto shadow-lg shadow-teal-100 dark:shadow-none">
                  <MessageCircle size={40} />
                </div>
                
                <div>
                  <h2 className="text-3xl font-black text-stone-900 dark:text-white tracking-tight">Coming Soon</h2>
                  <p className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest text-xs mt-2">Expert Consultations</p>
                </div>

                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
                  We are partnering with certified nurses and gynecologists to bring you reliable, on-demand health advice. This feature will be available in our next update.
                </p>

                <div className="bg-stone-50 dark:bg-stone-800 p-5 rounded-[2rem] border border-stone-100 dark:border-stone-700">
                  <h4 className="text-[10px] font-black text-stone-900 dark:text-white uppercase tracking-widest mb-3">In the meantime:</h4>
                  <ul className="space-y-3 text-left">
                    <li className="text-xs text-stone-600 dark:text-stone-400 flex items-start gap-3 font-medium">
                      <CheckCircle2 size={16} className="text-teal-500 mt-0.5 flex-shrink-0" />
                      Check our community forums for shared experiences.
                    </li>
                    <li className="text-xs text-stone-600 dark:text-stone-400 flex items-start gap-3 font-medium">
                      <CheckCircle2 size={16} className="text-teal-500 mt-0.5 flex-shrink-0" />
                      Use the "Contact My Doctor" feature for medical concerns.
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => setShowExpertModal(false)}
                  className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-teal-100 dark:shadow-none hover:bg-teal-700 transition-colors"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Emergency Mode Modal */}
        {showEmergencyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-stone-900 w-full max-w-md rounded-[3rem] p-8 shadow-2xl space-y-6 border border-stone-100 dark:border-stone-800 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="bg-red-100 dark:bg-red-900/30 w-14 h-14 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400 shadow-lg shadow-red-100 dark:shadow-none">
                    <AlertCircle size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-stone-900 dark:text-white tracking-tight">Emergency Mode</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mt-1">Immediate Action Guide</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowEmergencyModal(false)} 
                  className="p-2 bg-stone-50 dark:bg-stone-800 rounded-full transition-all hover:scale-110 active:scale-95"
                >
                  <X size={20} className="text-stone-400 dark:text-stone-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-red-50 dark:bg-red-950/30 p-5 rounded-[2rem] border border-red-100 dark:border-red-900/50">
                  <h4 className="text-sm font-black text-red-800 dark:text-red-200 mb-3 flex items-center gap-2">
                    <Activity size={18} /> When to go to the hospital
                  </h4>
                  <ul className="space-y-2">
                    <li className="text-xs text-red-700 dark:text-red-300 flex items-start gap-2 font-medium">
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 flex-shrink-0" />
                      Contractions are 5 minutes apart, lasting 1 minute, for 1 hour (5-1-1 rule)
                    </li>
                    <li className="text-xs text-red-700 dark:text-red-300 flex items-start gap-2 font-medium">
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 flex-shrink-0" />
                      Your water breaks (note the color and time)
                    </li>
                    <li className="text-xs text-red-700 dark:text-red-300 flex items-start gap-2 font-medium">
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 flex-shrink-0" />
                      Heavy vaginal bleeding
                    </li>
                    <li className="text-xs text-red-700 dark:text-red-300 flex items-start gap-2 font-medium">
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 flex-shrink-0" />
                      Decreased fetal movement
                    </li>
                  </ul>
                </div>

                <div className="bg-stone-50 dark:bg-stone-800 p-5 rounded-[2rem] border border-stone-100 dark:border-stone-700">
                  <h4 className="text-sm font-black text-stone-900 dark:text-white mb-3 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-stone-500" /> What to do during early labour
                  </h4>
                  <ul className="space-y-2">
                    <li className="text-xs text-stone-600 dark:text-stone-400 flex items-start gap-2 font-medium">
                      <CheckCircle2 size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                      Stay calm and rest as much as possible
                    </li>
                    <li className="text-xs text-stone-600 dark:text-stone-400 flex items-start gap-2 font-medium">
                      <CheckCircle2 size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                      Stay hydrated and eat light snacks
                    </li>
                    <li className="text-xs text-stone-600 dark:text-stone-400 flex items-start gap-2 font-medium">
                      <CheckCircle2 size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                      Take a warm shower or bath to ease pain
                    </li>
                    <li className="text-xs text-stone-600 dark:text-stone-400 flex items-start gap-2 font-medium">
                      <CheckCircle2 size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                      Time your contractions
                    </li>
                  </ul>
                </div>

                {profile.doctorContact ? (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest ml-2">Send alert to Dr. {profile.doctorContact.name}</label>
                    <textarea 
                      value={emergencyNote}
                      onChange={(e) => setEmergencyNote(e.target.value)}
                      placeholder="Add a note (e.g. heavy bleeding, water broke)"
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-[1.5rem] p-4 text-xs font-medium outline-none focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 transition-all h-20 resize-none text-stone-900 dark:text-white"
                    />
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={handleEmergencyAlert}
                      className="w-full py-4 rounded-2xl font-black text-white bg-red-600 hover:bg-red-700 transition-all shadow-xl shadow-red-100 dark:shadow-none active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Send size={18} /> Send Alert to Doctor
                    </motion.button>
                  </div>
                ) : (
                  <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/50">
                    <p className="text-xs text-amber-800 dark:text-amber-200 font-medium text-center">
                      Add your doctor's contact info in the "Contact My Doctor" section to send quick alerts.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emergency Reminder */}
      <section className="px-6">
        <div className="bg-rose-50 dark:bg-rose-950/30 p-6 rounded-[2rem] border border-rose-100 dark:border-rose-900/50">
          <p className="text-rose-800 dark:text-rose-200 text-xs font-bold text-center leading-relaxed">
            If you are feeling overwhelmed or having thoughts of hurting yourself or your baby, please use the emergency button at the top right immediately.
          </p>
        </div>
      </section>
    </div>
  );
};
