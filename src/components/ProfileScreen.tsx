import React, { useState } from 'react';
import { useUser } from '../UserContext';
import { UserStage } from '../types';
import { 
  Settings, Bell, Shield, Accessibility, LogOut, ChevronRight, 
  Volume2, Type, Layout, Sparkles, Calendar, Baby, Edit3, Check,
  UserCircle, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileScreenProps {
  onBack?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack }) => {
  const { profile, updateProfile, togglePreference, logout } = useUser();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBabyName, setIsEditingBabyName] = useState(false);
  const [isEditingDueDate, setIsEditingDueDate] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    if (onBack) onBack();
  };

  return (
    <div className="space-y-6 pb-24">
      <header className="pt-8 px-4 relative">
        {onBack && (
          <button 
            onClick={onBack}
            className="absolute top-8 left-4 p-2 hover:bg-stone-100 rounded-full transition-colors z-10"
          >
            <ArrowLeft className="w-6 h-6 text-stone-600" />
          </button>
        )}
        <div className="w-24 h-24 bg-pink-100 rounded-full mx-auto mb-4 flex items-center justify-center text-pink-600 text-3xl font-bold border-4 border-white shadow-lg">
          {profile.name[0]}
        </div>
        
        <div className="relative inline-block group">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input 
                autoFocus
                type="text"
                value={profile.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                className="text-2xl font-bold text-stone-900 bg-stone-50 border-b-2 border-pink-500 text-center outline-none px-2 w-full max-w-[250px]"
              />
              <button onClick={() => setIsEditingName(false)} className="text-pink-600">
                <Check size={20} />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => setIsEditingName(true)}
              className="flex items-center justify-center gap-2 cursor-pointer group"
            >
              <h1 className="text-2xl font-bold text-stone-900">{profile.name}</h1>
              <Edit3 size={16} className="text-stone-300 group-hover:text-pink-400 transition-colors" />
            </div>
          )}
        </div>

        <div className="text-stone-500 text-sm flex items-center justify-center gap-1 mt-1">
          <span className="bg-pink-50 text-pink-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            {profile.stage === UserStage.PREGNANT ? 'Pregnant' : 'New Mom'}
          </span>
          <span>•</span>
          <span className="font-medium">
            {profile.stageValue} {profile.stage === UserStage.PREGNANT ? 'Weeks' : 'Months'}
          </span>
        </div>
      </header>

      {/* Journey Update Section */}
      <section className="px-4">
        <div className="bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-sm text-left">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">Update Your Journey</p>
            <Sparkles size={16} className="text-pink-300" />
          </div>
          
          <div className="flex p-1 bg-stone-50 rounded-2xl mb-5">
            <button 
              onClick={() => updateProfile({ stage: UserStage.PREGNANT })}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${profile.stage === UserStage.PREGNANT ? 'bg-white text-pink-600 shadow-sm' : 'text-stone-400'}`}
            >
              Pregnant
            </button>
            <button 
              onClick={() => updateProfile({ stage: UserStage.NEW_MOM })}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${profile.stage === UserStage.NEW_MOM ? 'bg-white text-pink-600 shadow-sm' : 'text-stone-400'}`}
            >
              New Mom
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-stone-400 font-bold uppercase ml-1">
                {profile.stage === UserStage.PREGNANT ? 'Current Week' : 'Baby\'s Age'}
              </label>
              <div className="relative">
                <input 
                  type="number"
                  value={profile.stageValue}
                  onChange={(e) => updateProfile({ stageValue: parseInt(e.target.value) || 0 })}
                  className="w-full font-bold text-pink-600 text-xl bg-stone-50 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-200 transition-all"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-stone-400 font-medium">
                  {profile.stage === UserStage.PREGNANT ? 'Wks' : 'Mos'}
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] text-stone-400 font-bold uppercase ml-1">Quick Switch</label>
              <input 
                type="text"
                placeholder="e.g. Week 20"
                className="w-full text-sm bg-stone-50 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-200 transition-all placeholder:text-stone-300"
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
      <section className="px-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-3xl border border-stone-100 shadow-sm text-left relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <Calendar size={40} className="text-pink-600" />
            </div>
            <p className="text-xs text-stone-400 mb-1 font-bold uppercase tracking-tighter">Due Date</p>
            {isEditingDueDate ? (
              <input 
                autoFocus
                type="date"
                value={profile.dueDate || ''}
                onChange={(e) => updateProfile({ dueDate: e.target.value })}
                onBlur={() => setIsEditingDueDate(false)}
                className="w-full font-bold text-stone-800 text-sm bg-stone-50 rounded-lg px-2 py-1 outline-none"
              />
            ) : (
              <p 
                onClick={() => setIsEditingDueDate(true)}
                className="font-bold text-stone-800 text-sm cursor-pointer hover:text-pink-600 transition-colors"
              >
                {profile.dueDate ? new Date(profile.dueDate).toLocaleDateString() : 'Set Date'}
              </p>
            )}
          </div>

          <div className="bg-white p-4 rounded-3xl border border-stone-100 shadow-sm text-left relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <Baby size={40} className="text-pink-600" />
            </div>
            <p className="text-xs text-stone-400 mb-1 font-bold uppercase tracking-tighter">Baby Name</p>
            {isEditingBabyName ? (
              <input 
                autoFocus
                type="text"
                value={profile.babyName || ''}
                onChange={(e) => updateProfile({ babyName: e.target.value })}
                onBlur={() => setIsEditingBabyName(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingBabyName(false)}
                placeholder="Name..."
                className="w-full font-bold text-stone-800 text-sm bg-stone-50 rounded-lg px-2 py-1 outline-none"
              />
            ) : (
              <p 
                onClick={() => setIsEditingBabyName(true)}
                className="font-bold text-stone-800 text-sm cursor-pointer hover:text-pink-600 transition-colors"
              >
                {profile.babyName || 'Edit Name'}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Accessibility Settings */}
      <section className="px-4">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Accessibility size={20} className="text-pink-500" /> Accessibility
        </h3>
        <div className="bg-white rounded-[2.5rem] border border-stone-100 overflow-hidden shadow-sm">
          <div className="divide-y divide-stone-50">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-50 rounded-lg text-pink-600">
                  <Type size={18} />
                </div>
                <div>
                  <p className="font-bold text-sm">Large Text Mode</p>
                  <p className="text-xs text-stone-400">Easier to read</p>
                </div>
              </div>
              <button
                onClick={() => togglePreference('largeText')}
                className={`w-12 h-6 rounded-full transition-colors relative ${profile.preferences.largeText ? 'bg-pink-600' : 'bg-stone-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${profile.preferences.largeText ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-50 rounded-lg text-pink-600">
                  <Layout size={18} />
                </div>
                <div>
                  <p className="font-bold text-sm">Simple UI Mode</p>
                  <p className="text-xs text-stone-400">Minimalist layout</p>
                </div>
              </div>
              <button
                onClick={() => togglePreference('simpleUI')}
                className={`w-12 h-6 rounded-full transition-colors relative ${profile.preferences.simpleUI ? 'bg-pink-600' : 'bg-stone-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${profile.preferences.simpleUI ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-50 rounded-lg text-pink-600">
                  <Volume2 size={18} />
                </div>
                <div>
                  <p className="font-bold text-sm">Voice Guidance</p>
                  <p className="text-xs text-stone-400">Audio playback</p>
                </div>
              </div>
              <button
                onClick={() => togglePreference('voiceGuidance')}
                className={`w-12 h-6 rounded-full transition-colors relative ${profile.preferences.voiceGuidance ? 'bg-pink-600' : 'bg-stone-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${profile.preferences.voiceGuidance ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-pink-50 rounded-lg text-pink-600">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="font-bold text-sm">Fruit Theme</p>
                  <p className="text-xs text-stone-400">Personalize size visual</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['standard', 'tropical', 'veggies'].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => updateProfile({ 
                      preferences: { ...profile.preferences, fruitTheme: theme as any } 
                    })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all ${
                      profile.preferences.fruitTheme === theme 
                        ? 'bg-pink-600 text-white shadow-md' 
                        : 'bg-stone-50 text-stone-500 border border-stone-100'
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
      <section className="px-4">
        <h3 className="text-lg font-bold mb-3">Settings</h3>
        <div className="bg-white rounded-[2.5rem] border border-stone-100 overflow-hidden shadow-sm">
          <div className="divide-y divide-stone-50">
            {[
              { label: 'Notifications', icon: Bell },
              { label: 'Privacy & Security', icon: Shield },
              { label: 'General Settings', icon: Settings },
            ].map((item, i) => (
              <button key={i} className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-stone-50 rounded-lg text-stone-400">
                    <item.icon size={18} />
                  </div>
                  <p className="font-bold text-sm text-stone-700">{item.label}</p>
                </div>
                <ChevronRight size={18} className="text-stone-300" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pt-4">
        <button 
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center justify-center gap-2 text-rose-600 font-bold py-4 rounded-2xl bg-rose-50 hover:bg-rose-100 transition-colors"
        >
          <LogOut size={20} /> Log Out
        </button>
      </section>

      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl text-center"
            >
              <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center text-rose-600 mx-auto mb-4">
                <LogOut size={32} />
              </div>
              <h2 className="text-2xl font-bold text-stone-800 mb-2">Log Out?</h2>
              <p className="text-stone-500 mb-8">Are you sure you want to log out? Your local data will be reset.</p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-4 rounded-2xl font-bold text-stone-500 bg-stone-100 hover:bg-stone-200 transition-colors"
                >
                  No, stay
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-4 rounded-2xl font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-lg shadow-rose-100"
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

