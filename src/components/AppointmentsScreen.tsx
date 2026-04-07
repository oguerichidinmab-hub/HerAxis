import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  ChevronLeft, 
  Trash2, 
  AlertCircle,
  Stethoscope,
  Baby,
  Activity,
  Syringe,
  MoreHorizontal,
  RefreshCw,
  ExternalLink,
  Check
} from 'lucide-react';
import { useUser } from '../UserContext';
import { Appointment } from '../types';

interface AppointmentsScreenProps {
  onBack: () => void;
}

export const AppointmentsScreen: React.FC<AppointmentsScreenProps> = ({ onBack }) => {
  const { profile, addAppointment, removeAppointment, togglePreference } = useUser();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [newAppt, setNewAppt] = useState<Omit<Appointment, 'id' | 'reminded'>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    type: 'prenatal',
    notes: '',
    syncToNative: profile.preferences.googleSyncEnabled
  });

  useEffect(() => {
    checkGoogleStatus();
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        setIsGoogleConnected(true);
        togglePreference('googleSyncEnabled');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const checkGoogleStatus = async () => {
    try {
      const response = await fetch('/api/auth/status');
      const data = await response.json();
      setIsGoogleConnected(data.connected);
    } catch (error) {
      console.error("Failed to check Google status:", error);
    }
  };

  const handleConnectGoogle = async () => {
    try {
      const response = await fetch('/api/auth/google/url');
      const { url } = await response.json();
      window.open(url, 'google_oauth', 'width=600,height=700');
    } catch (error) {
      console.error("Failed to get Google auth URL:", error);
    }
  };

  const appointments = [...(profile.appointments || [])].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addAppointment(newAppt);
    setShowAddModal(false);
    setNewAppt({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      type: 'prenatal',
      notes: '',
      syncToNative: profile.preferences.googleSyncEnabled
    });
  };

  const getTypeIcon = (type: Appointment['type']) => {
    switch (type) {
      case 'pediatrician': return <Baby className="w-5 h-5 text-blue-500" />;
      case 'prenatal': return <Activity className="w-5 h-5 text-rose-500" />;
      case 'ultrasound': return <Stethoscope className="w-5 h-5 text-purple-500" />;
      case 'vaccination': return <Syringe className="w-5 h-5 text-emerald-500" />;
      default: return <Calendar className="w-5 h-5 text-stone-500" />;
    }
  };

  const isPast = (date: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(date) < today;
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-stone-600" />
          </button>
          <h1 className="text-xl font-semibold text-stone-800">Appointments</h1>
        </div>
        <button 
          onClick={handleConnectGoogle}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            isGoogleConnected 
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
              : 'bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200'
          }`}
        >
          {isGoogleConnected ? (
            <><Check className="w-3 h-3" /> Connected</>
          ) : (
            <><RefreshCw className="w-3 h-3" /> Sync Google</>
          )}
        </button>
      </header>

      <div className="p-4 space-y-6">
        {/* Sync Banner */}
        {!isGoogleConnected && (
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-4 text-white shadow-md">
            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm">Sync with Google Calendar</h3>
                <p className="text-xs opacity-90 mt-1">Never miss a visit! Sync your HERAXIS appointments with your device's native calendar.</p>
                <button 
                  onClick={handleConnectGoogle}
                  className="mt-3 bg-white text-blue-600 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors"
                >
                  Connect Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wider">Upcoming</h2>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 text-rose-500 font-medium text-sm hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New
            </button>
          </div>

          <div className="space-y-3">
            {appointments.filter(a => !isPast(a.date)).length === 0 ? (
              <div className="bg-white border-2 border-dashed border-stone-200 rounded-2xl p-8 text-center">
                <Calendar className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-500 font-medium">No upcoming appointments</p>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 text-rose-500 text-sm font-bold underline"
                >
                  Schedule your first visit
                </button>
              </div>
            ) : (
              appointments.filter(a => !isPast(a.date)).map(appt => (
                <motion.div
                  layout
                  key={appt.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-stone-50 flex items-center justify-center shrink-0">
                    {getTypeIcon(appt.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <h3 className="font-bold text-stone-800 truncate">{appt.title}</h3>
                        {appt.googleEventId && (
                          <div className="bg-blue-50 text-blue-500 p-0.5 rounded" title="Synced to Google Calendar">
                            <ExternalLink className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => removeAppointment(appt.id)}
                        className="p-1 text-stone-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-stone-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(appt.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {appt.time}
                      </span>
                    </div>
                    {appt.notes && (
                      <p className="mt-2 text-xs text-stone-400 italic line-clamp-2">
                        {appt.notes}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Past Section */}
        {appointments.filter(a => isPast(a.date)).length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-4">Past</h2>
            <div className="space-y-3 opacity-60">
              {appointments.filter(a => isPast(a.date)).map(appt => (
                <div
                  key={appt.id}
                  className="bg-stone-100 rounded-2xl p-4 border border-stone-200 flex gap-4 grayscale"
                >
                  <div className="w-12 h-12 rounded-xl bg-stone-200 flex items-center justify-center shrink-0">
                    {getTypeIcon(appt.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-stone-700 truncate">{appt.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-stone-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(appt.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed inset-x-0 bottom-0 bg-white rounded-t-[32px] z-50 p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="w-12 h-1.5 bg-stone-200 rounded-full mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-stone-800 mb-6">New Appointment</h2>
              
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-stone-600 mb-1">Title</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. 12 Week Scan"
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    value={newAppt.title}
                    onChange={e => setNewAppt({ ...newAppt, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-stone-600 mb-1">Date</label>
                    <input
                      required
                      type="date"
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                      value={newAppt.date}
                      onChange={e => setNewAppt({ ...newAppt, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-600 mb-1">Time</label>
                    <input
                      required
                      type="time"
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                      value={newAppt.time}
                      onChange={e => setNewAppt({ ...newAppt, time: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-600 mb-1">Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['prenatal', 'pediatrician', 'ultrasound', 'vaccination', 'other'] as Appointment['type'][]).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setNewAppt({ ...newAppt, type })}
                        className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all capitalize ${
                          newAppt.type === type 
                            ? 'bg-rose-500 text-white border-rose-500' 
                            : 'bg-white text-stone-600 border-stone-200 hover:border-rose-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-600 mb-1">Notes (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Any questions for the doctor?"
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
                    value={newAppt.notes}
                    onChange={e => setNewAppt({ ...newAppt, notes: e.target.value })}
                  />
                </div>

                {isGoogleConnected && (
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-bold text-blue-800">Sync to Google Calendar</p>
                        <p className="text-xs text-blue-600">Add this visit to your native calendar</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewAppt({ ...newAppt, syncToNative: !newAppt.syncToNative })}
                      className={`w-12 h-6 rounded-full transition-colors relative ${newAppt.syncToNative ? 'bg-blue-500' : 'bg-stone-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${newAppt.syncToNative ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 bg-rose-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-colors mt-4"
                >
                  Save Appointment
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

