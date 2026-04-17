import React, { useState } from 'react';
import { AlertTriangle, Phone, X, MessageSquare, Mail, MessageCircle, AlertCircle, Check, UserCircle, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../UserContext';
import { UserStage } from '../types';
import { HospitalListModal } from './HospitalListModal';

export const EmergencyButton: React.FC = () => {
  const { profile } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [showContactActions, setShowContactActions] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showHospitalModal, setShowHospitalModal] = useState(false);
  const [emergencyNote, setEmergencyNote] = useState('');

  const doctor = profile.doctorContact;

  const handleEmergencyAlert = () => {
    if (!doctor) return;

    const message = `Hello Dr. ${doctor.name}, this is ${profile.name}. I need urgent support regarding my ${profile.stage === UserStage.PREGNANT ? 'pregnancy' : 'postpartum'} condition. Please reach me as soon as possible.${emergencyNote ? ` My current concern is: ${emergencyNote}` : ''}`;
    
    // Default to SMS for emergency alert if available, otherwise WhatsApp or Email
    if (doctor.phone) {
      window.location.href = `sms:${doctor.phone}?body=${encodeURIComponent(message)}`;
    } else if (doctor.whatsapp) {
      window.open(`https://wa.me/${doctor.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    } else if (doctor.email) {
      window.location.href = `mailto:${doctor.email}?subject=URGENT: Pregnancy/Postpartum Support Needed&body=${encodeURIComponent(message)}`;
    }
    
    setShowEmergencyModal(false);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="pointer-events-auto bg-rose-600 text-white p-3 rounded-full shadow-lg hover:bg-rose-700 transition-colors flex items-center justify-center"
        aria-label="Emergency Help"
      >
        <AlertTriangle size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl overflow-y-auto max-h-[90vh] border border-stone-100 dark:border-stone-800"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-rose-600 flex items-center gap-2">
                  <AlertTriangle /> Emergency Help
                </h2>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors">
                  <X size={24} className="text-stone-400 dark:text-stone-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 p-4 rounded-2xl">
                  <p className="text-rose-800 dark:text-rose-200 font-bold mb-2">If you are experiencing:</p>
                  <ul className="text-rose-700 dark:text-rose-300 text-sm space-y-1 list-disc pl-4 font-medium">
                    <li>Severe abdominal pain</li>
                    <li>Heavy bleeding</li>
                    <li>Sudden swelling of face/hands</li>
                    <li>Reduced baby movement</li>
                    <li>Thoughts of self-harm</li>
                  </ul>
                </div>

                <p className="text-stone-600 dark:text-stone-400 text-sm italic font-medium">
                  Disclaimer: This app provides guidance, not medical diagnosis. Please seek professional care immediately.
                </p>

                <div className="grid grid-cols-1 gap-3">
                  <a
                    href="tel:911"
                    className="flex items-center justify-center gap-3 bg-rose-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-rose-700 transition-all shadow-lg shadow-rose-100 dark:shadow-none active:scale-95"
                  >
                    <Phone size={20} /> Call Emergency Services
                  </a>
                  
                  {doctor ? (
                    <button
                      onClick={() => setShowContactActions(true)}
                      className="flex items-center justify-center gap-3 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 py-4 rounded-2xl font-bold hover:bg-stone-200 dark:hover:bg-stone-700 transition-all active:scale-95"
                    >
                      <UserCircle size={20} className="text-pink-500" /> Contact My Doctor
                    </button>
                  ) : (
                    <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-dashed border-stone-200 dark:border-stone-700 text-center">
                      <p className="text-xs text-stone-400 dark:text-stone-500 mb-2 font-medium">No doctor contact saved yet.</p>
                      <p className="text-[10px] text-stone-400 dark:text-stone-500 italic">Add your doctor in the Support Hub to enable quick contact.</p>
                    </div>
                  )}
                  
                  <button
                    onClick={() => {
                      setShowHospitalModal(true);
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-center gap-3 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 py-4 rounded-2xl font-bold hover:bg-stone-200 dark:hover:bg-stone-700 transition-all active:scale-95"
                  >
                    <MapPin size={20} className="text-pink-500" /> Find Nearest Hospital
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        <HospitalListModal 
          isOpen={showHospitalModal} 
          onClose={() => setShowHospitalModal(false)} 
        />

        {/* Contact Actions Panel */}
        {showContactActions && doctor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowContactActions(false)}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl space-y-6 border border-stone-100 dark:border-stone-800"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-stone-900 dark:text-white">Contact Dr. {doctor.name}</h3>
                  <p className="text-xs text-stone-400 dark:text-stone-500">{doctor.hospital}</p>
                </div>
                <button onClick={() => setShowContactActions(false)} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors">
                  <X size={20} className="text-stone-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <a 
                  href={`tel:${doctor.phone}`}
                  className="flex items-center gap-4 p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                >
                  <div className="bg-green-100 dark:bg-green-900/30 p-2.5 rounded-xl text-green-600 dark:text-green-400">
                    <Phone size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm text-stone-900 dark:text-white">Call Doctor</p>
                    <p className="text-[10px] text-stone-400 dark:text-stone-500">{doctor.phone}</p>
                  </div>
                </a>

                {doctor.whatsapp && (
                  <a 
                    href={`https://wa.me/${doctor.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                  >
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2.5 rounded-xl text-emerald-600 dark:text-emerald-400">
                      <MessageCircle size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm text-stone-900 dark:text-white">Send WhatsApp Message</p>
                      <p className="text-[10px] text-stone-400 dark:text-stone-500">Direct Message</p>
                    </div>
                  </a>
                )}

                <a 
                  href={`sms:${doctor.phone}`}
                  className="flex items-center gap-4 p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                >
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-xl text-blue-600 dark:text-blue-400">
                    <MessageSquare size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm text-stone-900 dark:text-white">Send SMS</p>
                    <p className="text-[10px] text-stone-400 dark:text-stone-500">Quick Text</p>
                  </div>
                </a>

                {doctor.email && (
                  <a 
                    href={`mailto:${doctor.email}`}
                    className="flex items-center gap-4 p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                  >
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2.5 rounded-xl text-indigo-600 dark:text-indigo-400">
                      <Mail size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm text-stone-900 dark:text-white">Send Email</p>
                      <p className="text-[10px] text-stone-400 dark:text-stone-500">{doctor.email}</p>
                    </div>
                  </a>
                )}

                <button 
                  onClick={() => setShowEmergencyModal(true)}
                  className="flex items-center gap-4 p-4 bg-rose-50 dark:bg-rose-950/30 rounded-2xl hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors border border-rose-100 dark:border-rose-900/50"
                >
                  <div className="bg-rose-100 dark:bg-rose-900/30 p-2.5 rounded-xl text-rose-600 dark:text-rose-400">
                    <AlertCircle size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm text-rose-700 dark:text-rose-400">Emergency Alert</p>
                    <p className="text-[10px] text-rose-500 dark:text-rose-500">Send pre-filled urgent message</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Emergency Alert Confirmation Modal */}
        {showEmergencyModal && doctor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl space-y-6 border border-stone-100 dark:border-stone-800"
            >
              <div className="text-center space-y-3">
                <div className="bg-rose-100 dark:bg-rose-900/30 w-16 h-16 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto shadow-lg shadow-rose-100 dark:shadow-none">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-stone-900 dark:text-white">Emergency Alert</h3>
                <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">This will send an urgent message to Dr. {doctor.name}.</p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider ml-1">Add a note (Optional)</label>
                <textarea 
                  value={emergencyNote}
                  onChange={(e) => setEmergencyNote(e.target.value)}
                  placeholder="What is happening? (e.g. heavy bleeding, severe pain)"
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-2xl p-4 text-sm text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900 transition-all h-24 resize-none"
                />
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/50 flex items-start gap-3">
                <AlertCircle size={16} className="text-amber-500 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-amber-800 dark:text-amber-200 leading-tight font-medium">
                  <strong>Important:</strong> If this is a life-threatening emergency, please call 911 or your local emergency services immediately.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowEmergencyModal(false)}
                  className="flex-1 py-4 rounded-2xl font-bold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleEmergencyAlert}
                  className="flex-1 py-4 rounded-2xl font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-lg shadow-rose-100 dark:shadow-none active:scale-95"
                >
                  Send Alert
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
