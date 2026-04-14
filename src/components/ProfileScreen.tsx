import React, { useState } from 'react';
import { useUser } from '../UserContext';
import { UserStage } from '../types';
import { 
  Settings, Bell, Shield, Accessibility, LogOut, ChevronRight, 
  Volume2, Type, Layout, Sparkles, Calendar, Baby, Edit3, Check,
  UserCircle, ArrowLeft, Moon, Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../ThemeContext';

interface ProfileScreenProps {
  onBack?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack }) => {
  const { profile, updateProfile, togglePreference, logout } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBabyName, setIsEditingBabyName] = useState(false);
  const [isEditingDueDate, setIsEditingDueDate] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeSettingModal, setActiveSettingModal] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    if (onBack) onBack();
  };

  return (
    <div className="space-y-8 pb-32">
      <header className="pt-20 px-6 relative text-center">
        {onBack && (
          <button 
            onClick={onBack}
            className="absolute top-12 left-6 p-2.5 bg-white dark:bg-stone-800 shadow-sm border border-stone-100 dark:border-stone-700 rounded-full transition-all hover:scale-110 active:scale-95 z-10"
          >
            <ArrowLeft className="w-5 h-5 text-stone-600 dark:text-stone-300" />
          </button>
        )}
        <div className="w-28 h-28 bg-pink-100 dark:bg-pink-900/30 rounded-full mx-auto mb-6 flex items-center justify-center text-pink-600 dark:text-pink-400 text-4xl font-black border-4 border-white dark:border-stone-800 shadow-xl">
          {profile.name[0]}
        </div>
        
        <div className="relative inline-block group mb-2">
          {isEditingName ? (
            <div className="flex items-center gap-3 justify-center">
              <input 
                autoFocus
                type="text"
                value={profile.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                className="text-3xl font-bold text-stone-900 dark:text-white bg-transparent border-b-2 border-pink-500 text-center outline-none px-2 w-full max-w-[280px]"
              />
              <button onClick={() => setIsEditingName(false)} className="text-pink-600 dark:text-pink-400">
                <Check size={24} />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => setIsEditingName(true)}
              className="flex items-center justify-center gap-3 cursor-pointer group"
            >
              <h1 className="text-3xl font-black text-stone-900 dark:text-white tracking-tight">{profile.name}</h1>
              <Edit3 size={18} className="text-stone-300 dark:text-stone-600 group-hover:text-pink-400 transition-colors" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-pink-100 dark:border-pink-900/50">
            {profile.stage === UserStage.PREGNANT ? 'Pregnant' : 'New Mom'}
          </span>
          <span className="text-stone-300 dark:text-stone-700">•</span>
          <span className="text-stone-500 dark:text-stone-400 font-bold text-xs tracking-wide">
            {profile.stageValue} {profile.stage === UserStage.PREGNANT ? 'Weeks' : 'Months'}
          </span>
        </div>
      </header>

      {/* Journey Update Section */}
      <section className="px-6">
        <div className="bg-white dark:bg-stone-900 p-8 rounded-[3rem] border border-stone-100 dark:border-stone-800 shadow-xl shadow-stone-200/30 dark:shadow-none text-left transition-colors">
          <div className="flex items-center justify-between mb-6">
            <p className="text-[10px] text-stone-400 dark:text-stone-500 font-black uppercase tracking-widest">Update Your Journey</p>
            <Sparkles size={18} className="text-pink-300 dark:text-pink-700" />
          </div>
          
          <div className="flex p-1.5 bg-stone-50 dark:bg-stone-800 rounded-2xl mb-6 border border-stone-100 dark:border-stone-700">
            <button 
              onClick={() => updateProfile({ stage: UserStage.PREGNANT })}
              className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${profile.stage === UserStage.PREGNANT ? 'bg-white dark:bg-stone-700 text-pink-600 dark:text-white shadow-md' : 'text-stone-400 dark:text-stone-500'}`}
            >
              Pregnant
            </button>
            <button 
              onClick={() => updateProfile({ stage: UserStage.NEW_MOM })}
              className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${profile.stage === UserStage.NEW_MOM ? 'bg-white dark:bg-stone-700 text-pink-600 dark:text-white shadow-md' : 'text-stone-400 dark:text-stone-500'}`}
            >
              New Mom
            </button>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] text-stone-400 dark:text-stone-500 font-black uppercase ml-2 tracking-widest">
                {profile.stage === UserStage.PREGNANT ? 'Current Week' : 'Baby\'s Age'}
              </label>
              <div className="relative">
                <input 
                  type="number"
                  value={profile.stageValue}
                  onChange={(e) => updateProfile({ stageValue: parseInt(e.target.value) || 0 })}
                  className="w-full font-black text-pink-600 dark:text-pink-400 text-2xl bg-stone-50 dark:bg-stone-800 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-900 transition-all border border-stone-100 dark:border-stone-700"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] text-stone-400 dark:text-stone-500 font-black uppercase tracking-widest">
                  {profile.stage === UserStage.PREGNANT ? 'Wks' : 'Mos'}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] text-stone-400 dark:text-stone-500 font-black uppercase ml-2 tracking-widest">Quick Switch</label>
              <input 
                type="text"
                placeholder="e.g. Week 20"
                className="w-full text-sm font-bold bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white rounded-2xl px-5 py-4.5 outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-900 transition-all placeholder:text-stone-300 dark:placeholder:text-stone-600 border border-stone-100 dark:border-stone-700"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = e.currentTarget.value.toLowerCase();
                    const num = parseInt(val.replace(/\D/g, ''));
                    const updates: any = {};
                    if (!isNaN(num)) updates.stageValue = num;
                    if (val.includes('preg') || val.includes('week')) updates.stage = UserStage.PREGNANT;
                    else if (val.includes('mom') || val.includes('month') || val.includes('baby')) updates.stage = UserStage.NEW_MOM;
                    
                    if (Object.keys(updates).length > 0) {
                      updateProfile(updates);
                      e.currentTarget.value = '';
                      e.currentTarget.blur();
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-6">
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            whileTap={{ scale: 0.95 }}
            className="bg-white dark:bg-stone-900 p-6 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 shadow-lg shadow-stone-200/30 dark:shadow-none text-left relative overflow-hidden group transition-colors"
          >
            <div className="absolute -top-2 -right-2 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Calendar size={64} className="text-pink-600" />
            </div>
            <p className="text-[10px] text-stone-400 dark:text-stone-500 mb-2 font-black uppercase tracking-widest">Due Date</p>
            {isEditingDueDate ? (
              <input 
                autoFocus
                type="date"
                value={profile.dueDate || ''}
                onChange={(e) => updateProfile({ dueDate: e.target.value })}
                onBlur={() => setIsEditingDueDate(false)}
                className="w-full font-black text-stone-800 dark:text-white text-sm bg-stone-50 dark:bg-stone-800 rounded-xl px-3 py-2 outline-none border border-stone-100 dark:border-stone-700"
              />
            ) : (
              <p 
                onClick={() => setIsEditingDueDate(true)}
                className="font-black text-stone-800 dark:text-white text-base cursor-pointer hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
              >
                {profile.dueDate ? new Date(profile.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Set Date'}
              </p>
            )}
          </motion.div>

          <motion.div 
            whileTap={{ scale: 0.95 }}
            className="bg-white dark:bg-stone-900 p-6 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 shadow-lg shadow-stone-200/30 dark:shadow-none text-left relative overflow-hidden group transition-colors"
          >
            <div className="absolute -top-2 -right-2 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Baby size={64} className="text-pink-600" />
            </div>
            <p className="text-[10px] text-stone-400 dark:text-stone-500 mb-2 font-black uppercase tracking-widest">Baby Name</p>
            {isEditingBabyName ? (
              <input 
                autoFocus
                type="text"
                value={profile.babyName || ''}
                onChange={(e) => updateProfile({ babyName: e.target.value })}
                onBlur={() => setIsEditingBabyName(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingBabyName(false)}
                placeholder="Name..."
                className="w-full font-black text-stone-800 dark:text-white text-sm bg-stone-50 dark:bg-stone-800 rounded-xl px-3 py-2 outline-none border border-stone-100 dark:border-stone-700"
              />
            ) : (
              <p 
                onClick={() => setIsEditingBabyName(true)}
                className="font-black text-stone-800 dark:text-white text-base cursor-pointer hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
              >
                {profile.babyName || 'Edit Name'}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Accessibility Settings */}
      <section className="px-6">
        <h3 className="text-xl font-black mb-5 flex items-center gap-3 text-stone-900 dark:text-white tracking-tight">
          <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
            <Accessibility size={20} className="text-pink-600 dark:text-pink-400" />
          </div>
          Accessibility
        </h3>
        <div className="bg-white dark:bg-stone-900 rounded-[3rem] border border-stone-100 dark:border-stone-800 overflow-hidden shadow-xl shadow-stone-200/30 dark:shadow-none transition-colors">
          <div className="divide-y divide-stone-50 dark:divide-stone-800/50">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-2xl text-pink-600 dark:text-pink-400">
                  {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                </div>
                <div>
                  <p className="font-black text-sm text-stone-900 dark:text-white">Dark Mode</p>
                  <p className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-widest">Switch theme</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`w-14 h-7 rounded-full transition-all relative ${theme === 'dark' ? 'bg-pink-600' : 'bg-stone-200 dark:bg-stone-700'}`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${theme === 'dark' ? 'left-8' : 'left-1'}`} />
              </button>
            </div>

            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-2xl text-pink-600 dark:text-pink-400">
                  <Type size={20} />
                </div>
                <div>
                  <p className="font-black text-sm text-stone-900 dark:text-white">Large Text Mode</p>
                  <p className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-widest">Easier to read</p>
                </div>
              </div>
              <button
                onClick={() => togglePreference('largeText')}
                className={`w-14 h-7 rounded-full transition-all relative ${profile.preferences.largeText ? 'bg-pink-600' : 'bg-stone-200 dark:bg-stone-700'}`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${profile.preferences.largeText ? 'left-8' : 'left-1'}`} />
              </button>
            </div>



            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-2xl text-pink-600 dark:text-pink-400">
                  <Volume2 size={20} />
                </div>
                <div>
                  <p className="font-black text-sm text-stone-900 dark:text-white">Voice Guidance</p>
                  <p className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-widest">Audio playback</p>
                </div>
              </div>
              <button
                onClick={() => togglePreference('voiceGuidance')}
                className={`w-14 h-7 rounded-full transition-all relative ${profile.preferences.voiceGuidance ? 'bg-pink-600' : 'bg-stone-200 dark:bg-stone-700'}`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${profile.preferences.voiceGuidance ? 'left-8' : 'left-1'}`} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-2xl text-pink-600 dark:text-pink-400">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="font-black text-sm text-stone-900 dark:text-white">Fruit Theme</p>
                  <p className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-widest">Personalize size visual</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['standard', 'tropical', 'veggies'].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => updateProfile({ 
                      preferences: { ...profile.preferences, fruitTheme: theme as any } 
                    })}
                    className={`py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      profile.preferences.fruitTheme === theme 
                        ? 'bg-pink-600 text-white shadow-lg shadow-pink-100 dark:shadow-none' 
                        : 'bg-stone-50 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border border-stone-100 dark:border-stone-700'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* General Settings */}
      <section className="px-6">
        <h3 className="text-xl font-black mb-5 text-stone-900 dark:text-white tracking-tight">Settings</h3>
        <div className="bg-white dark:bg-stone-900 rounded-[3rem] border border-stone-100 dark:border-stone-800 overflow-hidden shadow-xl shadow-stone-200/30 dark:shadow-none transition-colors">
          <div className="divide-y divide-stone-50 dark:divide-stone-800/50">
            {[
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'privacy', label: 'Privacy & Security', icon: Shield },
              { id: 'general', label: 'General Settings', icon: Settings },
            ].map((item) => (
              <button 
                key={item.id} 
                onClick={() => setActiveSettingModal(item.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-2xl text-stone-400 dark:text-stone-500">
                    <item.icon size={20} />
                  </div>
                  <p className="font-black text-sm text-stone-800 dark:text-stone-200">{item.label}</p>
                </div>
                <ChevronRight size={20} className="text-stone-300 dark:text-stone-700" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pt-4">
        <button 
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center justify-center gap-3 text-rose-600 dark:text-rose-400 font-black py-5 rounded-[2rem] bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-all active:scale-95"
        >
          <LogOut size={22} /> Log Out
        </button>
      </section>

      <AnimatePresence>
        {activeSettingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setActiveSettingModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-[3rem] p-10 shadow-2xl border border-stone-100 dark:border-stone-800 relative"
            >
              <button 
                onClick={() => setActiveSettingModal(null)}
                className="absolute top-6 right-6 p-2 bg-stone-100 dark:bg-stone-800 rounded-full text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              >
                <X size={20} />
              </button>
              <div className="bg-stone-100 dark:bg-stone-800 w-16 h-16 rounded-2xl flex items-center justify-center text-stone-500 dark:text-stone-400 mb-6">
                {activeSettingModal === 'notifications' && <Bell size={32} />}
                {activeSettingModal === 'privacy' && <Shield size={32} />}
                {activeSettingModal === 'general' && <Settings size={32} />}
              </div>
              <h2 className="text-2xl font-black text-stone-900 dark:text-white mb-3 tracking-tight">
                {activeSettingModal === 'notifications' && 'Notifications'}
                {activeSettingModal === 'privacy' && 'Privacy & Security'}
                {activeSettingModal === 'general' && 'General Settings'}
              </h2>
              <p className="text-stone-500 dark:text-stone-400 mb-8 font-medium leading-relaxed">
                This section is currently under construction. We are working hard to bring you these features soon!
              </p>
              <button
                onClick={() => setActiveSettingModal(null)}
                className="w-full py-4 rounded-2xl font-black text-white bg-stone-900 dark:bg-stone-700 hover:bg-black dark:hover:bg-stone-600 transition-all shadow-xl shadow-stone-200 dark:shadow-none active:scale-95"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-[3rem] p-10 shadow-2xl text-center border border-stone-100 dark:border-stone-800"
            >
              <div className="bg-rose-100 dark:bg-rose-900/30 w-20 h-20 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto mb-6 shadow-lg shadow-rose-100 dark:shadow-none">
                <LogOut size={40} />
              </div>
              <h2 className="text-3xl font-black text-stone-900 dark:text-white mb-3 tracking-tight">Log Out?</h2>
              <p className="text-stone-500 dark:text-stone-400 mb-10 font-medium leading-relaxed">Are you sure you want to log out? Your local data will be reset.</p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-4.5 rounded-2xl font-black text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-all active:scale-95"
                >
                  No, stay
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-4.5 rounded-2xl font-black text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-xl shadow-rose-100 dark:shadow-none active:scale-95"
                >
                  Yes, log out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

