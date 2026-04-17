import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, 
  Phone, 
  UserCircle, 
  MapPin, 
  X, 
  ChevronLeft, 
  MessageSquare, 
  Mail, 
  Activity, 
  Clock,
  ShieldAlert,
  Hospital,
  Send,
  AlertCircle
} from 'lucide-react';
import { useUser } from '../UserContext';
import { UserStage } from '../types';
import { HospitalListModal } from './HospitalListModal';

interface EmergencyScreenProps {
  onBack: () => void;
}

export const EmergencyScreen: React.FC<EmergencyScreenProps> = ({ onBack }) => {
  const { profile } = useUser();
  const [showHospitalModal, setShowHospitalModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [emergencyNote, setEmergencyNote] = useState('');
  
  const doctor = profile.doctorContact;

  useEffect(() => {
    // Lock body scroll when emergency hub is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSendUrgentAlert = () => {
    if (!doctor) return;

    const message = `Hello Dr. ${doctor.name}, this is ${profile.name}. I need urgent support regarding my ${profile.stage === UserStage.PREGNANT ? 'pregnancy' : 'postpartum'} condition. Please reach me as soon as possible.${emergencyNote ? ` My current concern is: ${emergencyNote}` : ''}`;
    
    if (doctor.phone) {
      window.location.href = `sms:${doctor.phone}?body=${encodeURIComponent(message)}`;
    } else if (doctor.whatsapp) {
      window.open(`https://wa.me/${doctor.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    } else if (doctor.email) {
      window.location.href = `mailto:${doctor.email}?subject=URGENT ALERT: Pregnancy/Postpartum Support Needed&body=${encodeURIComponent(message)}`;
    }
    
    setShowAlertModal(false);
  };

  const screenContent = (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 dark:bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white dark:bg-stone-950 w-full max-w-lg max-h-[90vh] flex flex-col rounded-[2.5rem] shadow-6xl overflow-hidden border border-stone-100 dark:border-stone-800"
      >
        {/* Modal Header */}
        <div className="bg-rose-600 px-6 py-5 flex items-center justify-between shadow-lg shrink-0">
          <div className="flex items-center gap-3">
            <AlertTriangle size={24} fill="white" className="text-rose-600" />
            <h1 className="text-xl font-black text-white m-0 uppercase tracking-tight italic">Emergency Hub</h1>
          </div>
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-full transition-all text-white border-none bg-transparent cursor-pointer active:scale-90"
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto w-full scroll-smooth bg-stone-50/50 dark:bg-stone-950/50">
          <div className="p-6 sm:p-8 space-y-10">
            
            {/* Action Buttons Hub */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => window.location.href = 'tel:911'}
                className="group flex flex-col items-center justify-center gap-3 bg-red-600 text-white p-4 rounded-3xl font-black transition-all shadow-lg shadow-red-100 dark:shadow-none active:scale-95 border-none cursor-pointer"
              >
                <div className="bg-white text-red-600 p-2 rounded-xl">
                  <Phone size={24} fill="currentColor" />
                </div>
                <span className="uppercase tracking-tighter text-lg">Call 911</span>
              </button>

              <button
                onClick={() => setShowHospitalModal(true)}
                className="group flex flex-col items-center justify-center gap-3 bg-stone-900 dark:bg-stone-800 text-white p-4 rounded-3xl font-black transition-all shadow-lg active:scale-95 border-none cursor-pointer"
              >
                <div className="bg-pink-500 text-black p-2 rounded-xl">
                  <MapPin size={24} fill="currentColor" />
                </div>
                <span className="uppercase tracking-tighter text-lg">Hospital</span>
              </button>
            </div>

            {/* Critical Symptoms Check */}
            <section className="bg-white dark:bg-stone-900 p-6 rounded-3xl border-2 border-rose-100 dark:border-rose-900/30">
              <h2 className="text-stone-900 dark:text-white font-black text-xl mb-4 flex items-center gap-3">
                <ShieldAlert size={20} className="text-rose-600" /> Seek Help If:
              </h2>
              <div className="space-y-3">
                {[
                  'Severe pain (Abdomen/Chest)',
                  'Heavy vaginal bleeding',
                  'Sudden swelling or blurring',
                  'Reduced/Absent baby movement',
                  'Fever over 100.4°F (38°C)',
                  'Thoughts of self-harm or fear'
                ].map((symptom, i) => (
                  <div key={i} className="flex items-center gap-3 bg-stone-50 dark:bg-stone-800/50 p-3 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                    <span className="text-sm font-bold text-stone-700 dark:text-stone-300">{symptom}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Doctor Contact Hub */}
            {doctor ? (
              <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                    <UserCircle size={40} />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-stone-900 dark:text-white m-0 tracking-tight">Dr. {doctor.name}</h3>
                    <p className="text-sm text-stone-500 m-0 font-bold uppercase tracking-tight">{doctor.hospital || 'Medical Unit'}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <a
                    href={`tel:${doctor.phone}`}
                    className="flex-1 flex items-center justify-center gap-3 py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm no-underline active:scale-95 transition-all shadow-lg shadow-emerald-100 dark:shadow-none"
                  >
                    <Phone size={18} fill="currentColor" />
                    Call
                  </a>
                  <button
                    onClick={() => setShowAlertModal(true)}
                    className="flex-1 flex items-center justify-center gap-3 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm active:scale-95 transition-all border-none cursor-pointer shadow-lg shadow-blue-100 dark:shadow-none"
                  >
                    <Send size={18} />
                    Alert
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-10 bg-stone-100 dark:bg-stone-900/50 rounded-3xl border-2 border-dashed border-stone-200 dark:border-stone-800 text-center">
                <p className="text-stone-400 font-bold uppercase tracking-widest text-sm m-0">No Medical Contact Linked</p>
              </div>
            )}

            {/* Footer Disclaimer */}
            <div className="p-6 bg-stone-900 text-white rounded-3xl text-center space-y-3">
              <ShieldAlert size={32} className="mx-auto text-rose-600" />
              <p className="text-[10px] font-black leading-relaxed m-0 uppercase tracking-tighter opacity-70">
                MAMA AI IS NOT A REPLACEMENT FOR EMERGENCY SERVICES. IF LIFE-THREATENING, CALL 911 IMMEDIATELY.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <HospitalListModal 
        isOpen={showHospitalModal} 
        onClose={() => setShowHospitalModal(false)} 
      />

      {/* Alert Composer Overlay */}
      <AnimatePresence>
        {showAlertModal && doctor && (
          <div className="fixed inset-0 z-[1001] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-[2rem] p-8 shadow-6xl space-y-8"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center text-white mx-auto">
                  <Send size={32} fill="white" />
                </div>
                <h3 className="text-2xl font-black text-stone-900 dark:text-white m-0 tracking-tight italic uppercase">Send Alert</h3>
                <p className="text-sm text-stone-500 font-bold uppercase tracking-tight">To Dr. {doctor.name}</p>
              </div>

              <textarea 
                value={emergencyNote}
                onChange={(e) => setEmergencyNote(e.target.value)}
                placeholder="What is happening?..."
                className="w-full bg-stone-50 dark:bg-stone-800 border-2 border-stone-100 dark:border-stone-700 rounded-2xl p-4 text-base text-stone-900 dark:text-white outline-none focus:border-rose-600 resize-none h-32 font-bold uppercase tracking-tight"
              />

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleSendUrgentAlert}
                  className="w-full py-4 bg-rose-600 text-white rounded-xl font-black uppercase tracking-widest text-sm shadow-xl shadow-rose-100 border-none cursor-pointer"
                >
                  Confirm Send
                </button>
                <button 
                  onClick={() => setShowAlertModal(false)}
                  className="w-full py-2 text-stone-400 font-bold uppercase tracking-widest text-[10px] border-none bg-transparent cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  return createPortal(screenContent, document.body);
};